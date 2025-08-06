const express = require("express");
const {
  capturePaypalOrder,
  createCheckoutSession,
} = require("../controllers/paypalController.js");
const { isAuthenticator } = require("../middleware/auth.js");
const router = express.Router();

router.post("/paypal/checkout", isAuthenticator, createCheckoutSession);

router.post("/paypal/capture", isAuthenticator, capturePaypalOrder);

module.exports = router;
