import axios from "axios";

import {
  ADD_TO_PACKAGE_CART,
  REMOVE_CART_PACKAGE_ITEM,
} from "../constants/cartContants.jsx";
const API_URL = import.meta.env.VITE_API_URL;
// Add to Cart
export const addItemsPackageToCart =
  (id, quantity) => async (dispatch, getState) => {
    const { data } = await axios.get(`${API_URL}/api/v1/packages/${id}`);

    dispatch({
      type: ADD_TO_PACKAGE_CART,
      payload: {
        id: data.package._id,
        name: data.package.name,
        price: data.package.discountPrice,
        image: data.package.image.url,
        type: "package",
        quantity,
      },
    });

    localStorage.setItem(
      "packageCartItems",
      JSON.stringify(getState().packageCart.packageCartItems)
    );
  };

// REMOVE FROM CART
export const removeItemsPackageFromCart =
  (id) => async (dispatch, getState) => {
    dispatch({
      type: REMOVE_CART_PACKAGE_ITEM,
      payload: id,
    });

    localStorage.setItem(
      "packageCartItems",
      JSON.stringify(getState().packageCart.packageCartItems)
    );
  };
