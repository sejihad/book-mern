import {
  ADMIN_BOOK_FAIL,
  ADMIN_BOOK_REQUEST,
  ADMIN_BOOK_SUCCESS,
  ALL_BOOK_FAIL,
  ALL_BOOK_REQUEST,
  ALL_BOOK_SUCCESS,
  CLEAR_ERRORS,
  DELETE_BOOK_FAIL,
  DELETE_BOOK_REQUEST,
  DELETE_BOOK_RESET,
  DELETE_BOOK_SUCCESS,
  NEW_BOOK_FAIL,
  NEW_BOOK_REQUEST,
  NEW_BOOK_RESET,
  NEW_BOOK_SUCCESS,
  UPDATE_BOOK_FAIL,
  UPDATE_BOOK_REQUEST,
  UPDATE_BOOK_RESET,
  UPDATE_BOOK_SUCCESS,
} from "../constants/bookConstants";

export const booksReducer = (state = { books: [] }, action) => {
  switch (action.type) {
    case ALL_BOOK_REQUEST:
    case ADMIN_BOOK_REQUEST:
      return {
        loading: true,
        books: [],
      };
    case ALL_BOOK_SUCCESS:
      return {
        loading: false,
        books: action.payload.books,
      };
    case ADMIN_BOOK_SUCCESS:
      return {
        loading: false,
        books: action.payload,
      };
    case ALL_BOOK_FAIL:
    case ADMIN_BOOK_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const newBookReducer = (state = { book: {} }, action) => {
  switch (action.type) {
    case NEW_BOOK_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NEW_BOOK_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
        book: action.payload.book,
      };
    case NEW_BOOK_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case NEW_BOOK_RESET:
      return {
        ...state,
        success: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
export const bookReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_BOOK_REQUEST:
    case UPDATE_BOOK_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_BOOK_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };

    case UPDATE_BOOK_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };
    case DELETE_BOOK_FAIL:
    case UPDATE_BOOK_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_BOOK_RESET:
      return {
        ...state,
        isDeleted: false,
      };
    case UPDATE_BOOK_RESET:
      return {
        ...state,
        isUpdated: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
