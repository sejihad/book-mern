import axios from "axios";

import {
  ADD_TO_BOOK_CART,
  REMOVE_CART_BOOK_ITEM,
} from "../constants/cartContants.jsx";
const API_URL = import.meta.env.VITE_API_URL;
// Add to Cart
export const addItemsBookToCart =
  (id, quantity) => async (dispatch, getState) => {
    const { data } = await axios.get(`${API_URL}/api/v1/books/${id}`);

    dispatch({
      type: ADD_TO_BOOK_CART,
      payload: {
        id: data.book._id,
        name: data.book.name,
        price: data.book.discountPrice,
        image: data.book.image.url,
        type: "book",
        quantity,
      },
    });

    localStorage.setItem(
      "bookCartItems",
      JSON.stringify(getState().bookCart.bookCartItems)
    );
  };

// REMOVE FROM CART
export const removeItemsBookFromCart = (id) => async (dispatch, getState) => {
  dispatch({
    type: REMOVE_CART_BOOK_ITEM,
    payload: id,
  });

  localStorage.setItem(
    "bookCartItems",
    JSON.stringify(getState().bookCart.bookCartItems)
  );
};
