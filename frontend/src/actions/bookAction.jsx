import axios from "axios";
import {
  ADMIN_BOOK_FAIL,
  ADMIN_BOOK_REQUEST,
  ADMIN_BOOK_SUCCESS,
  ALL_BOOK_FAIL,
  ALL_BOOK_REQUEST,
  ALL_BOOK_SUCCESS,
  BOOK_DETAILS_FAIL,
  BOOK_DETAILS_REQUEST,
  BOOK_DETAILS_SUCCESS,
  CLEAR_ERRORS,
  DELETE_BOOK_FAIL,
  DELETE_BOOK_REQUEST,
  DELETE_BOOK_SUCCESS,
  NEW_BOOK_FAIL,
  NEW_BOOK_REQUEST,
  NEW_BOOK_SUCCESS,
  NEW_REVIEW_FAIL,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_SUCCESS,
  UPDATE_BOOK_FAIL,
  UPDATE_BOOK_REQUEST,
  UPDATE_BOOK_SUCCESS,
} from "../constants/bookConstants";
const API_URL = import.meta.env.VITE_API_URL;
export const getBook = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_BOOK_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/v1/books`);

    dispatch({
      type: ALL_BOOK_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_BOOK_FAIL,
      payload: error.response.data.message,
    });
  }
};
export const getAdminBook = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_BOOK_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(`${API_URL}/api/v1/admin/books`, config);

    dispatch({
      type: ADMIN_BOOK_SUCCESS,
      payload: data.books,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_BOOK_FAIL,
      payload: error.response.data.message,
    });
  }
};
export const getBookDetails = (slug) => async (dispatch) => {
  try {
    dispatch({ type: BOOK_DETAILS_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/v1/book/${slug}`);

    dispatch({
      type: BOOK_DETAILS_SUCCESS,
      payload: data.book,
    });
  } catch (error) {
    dispatch({
      type: BOOK_DETAILS_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};
export const createBook = (productData) => async (dispatch) => {
  try {
    // Dispatching NEW_PRODUCT_REQUEST action to show loading
    dispatch({ type: NEW_BOOK_REQUEST });

    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    // Sending POST request
    const { data } = await axios.post(
      `${API_URL}/api/v1/admin/book/new`,
      productData,
      config
    );

    // Dispatch success action with the response data
    dispatch({
      type: NEW_BOOK_SUCCESS,
      payload: data,
    });
  } catch (error) {
    // Dispatching failure action with error message

    dispatch({
      type: NEW_BOOK_FAIL,
      payload: error.response?.data?.message,
    });
  }
};
export const updateBook = (id, productData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_BOOK_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${API_URL}/api/v1/admin/book/${id}`,
      productData,
      config
    );

    dispatch({
      type: UPDATE_BOOK_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_BOOK_FAIL,
      payload: error.response.data.message,
    });
  }
};
export const deleteBook = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_BOOK_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.delete(
      `${API_URL}/api/v1/admin/book/${id}`,
      config
    );

    dispatch({
      type: DELETE_BOOK_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_BOOK_FAIL,
      payload: error.response.data.message,
    });
  }
};
export const newReview = (reviewData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_REVIEW_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${API_URL}/api/v1/review`,
      reviewData,
      config
    );

    dispatch({
      type: NEW_REVIEW_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: NEW_REVIEW_FAIL,
      payload: error.response.data.message,
    });
  }
};
// ✅ Errors Clear
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
