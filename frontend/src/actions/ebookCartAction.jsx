import axios from "axios";

import {
  ADD_TO_EBOOK_CART,
  REMOVE_CART_EBOOK_ITEM,
} from "../constants/cartContants.jsx";
const API_URL = import.meta.env.VITE_API_URL;
// Add to Cart
export const addItemsEbookToCart =
  (id, quantity) => async (dispatch, getState) => {
    const { data } = await axios.get(`${API_URL}/api/v1/books/${id}`);

    dispatch({
      type: ADD_TO_EBOOK_CART,
      payload: {
        id: data.book._id,
        name: data.book.name,
        price: data.book.discountPrice,
        image: data.book.image.url,
        type: "ebook",
        quantity,
      },
    });

    localStorage.setItem(
      "ebookCartItems",
      JSON.stringify(getState().ebookCart.ebookCartItems)
    );
  };

// REMOVE FROM CART
export const removeItemsEbookFromCart = (id) => async (dispatch, getState) => {
  dispatch({
    type: REMOVE_CART_EBOOK_ITEM,
    payload: id,
  });

  localStorage.setItem(
    "ebookCartItems",
    JSON.stringify(getState().ebookCart.ebookCartItems)
  );
};
