const dotenv = require("dotenv");
const Stripe = require("stripe");
const Order = require("../models/orderModel");
const User = require("../models/userModel");

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Checkout Session
const createCheckoutSession = async (req, res, next) => {
  try {
    const { shippingInfo, orderItems, itemsPrice, shippingPrice, totalPrice } =
      req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Order Payment",
            },
            unit_amount: Math.round(Number(totalPrice) * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: req.user._id.toString(),
        shippingInfo: JSON.stringify(shippingInfo),
        orderItems: JSON.stringify(orderItems),
        itemsPrice: itemsPrice.toString(),
        shippingPrice: shippingPrice.toString(),
        totalPrice: totalPrice.toString(),
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    next(err);
  }
};

// Stripe Webhook
const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Prevent duplicate order
    const existingOrder = await Order.findOne({
      "payment.transactionId": session.payment_intent,
    });

    if (existingOrder) {
      return res.status(200).send("Order already exists");
    }

    const user = await User.findById(session.metadata.userId);
    if (!user) return res.status(404).send("User not found");

    // Parse session metadata
    const orderItems = JSON.parse(session.metadata.orderItems);
    const shippingInfo = JSON.parse(session.metadata.shippingInfo);
    const itemsPrice = Number(session.metadata.itemsPrice);
    const shippingPrice = Number(session.metadata.shippingPrice);
    const totalPrice = Number(session.metadata.totalPrice);

    // Detect order_type
    // Step 1: All types in orderItems
    const itemTypes = [...new Set(orderItems.map((item) => item.type))];

    // Step 3: Use that type as order_type
    const order_type = itemTypes[0]; // "book", "ebook", or "package"
    const isEbookOnly = order_type === "ebook";

    // Step 4: Create Order
    const order = new Order({
      user: {
        id: user._id,
        name: user.name,
        email: user.email || "",
        number: user.number || "",
        country: user.country || "",
      },
      shippingInfo: isEbookOnly ? {} : shippingInfo,
      orderItems: orderItems,
      itemsPrice: itemsPrice,
      shippingPrice: isEbookOnly ? 0 : shippingPrice,
      totalPrice: totalPrice,
      payment: {
        method: "stripe",
        transactionId: session.payment_intent,
        status: "paid",
      },
      order_type: order_type, // "book" / "ebook" / "package"
      order_status: isEbookOnly ? "completed" : "pending",
    });

    await order.save();
    return res.status(200).send("Order created");
  }

  res.status(200).send("Webhook received");
};

module.exports = {
  createCheckoutSession,
  stripeWebhook,
};
