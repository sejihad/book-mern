import { CLEAR_ERRORS } from "../constants/blogContants";
import {
  ADMIN_CATEGORY_FAIL,
  ADMIN_CATEGORY_REQUEST,
  ADMIN_CATEGORY_SUCCESS,
  ALL_CATEGORY_FAIL,
  ALL_CATEGORY_REQUEST,
  ALL_CATEGORY_SUCCESS,
  CATEGORY_DETAILS_FAIL,
  CATEGORY_DETAILS_REQUEST,
  CATEGORY_DETAILS_SUCCESS,
  DELETE_CATEGORY_FAIL,
  DELETE_CATEGORY_REQUEST,
  DELETE_CATEGORY_RESET,
  DELETE_CATEGORY_SUCCESS,
  NEW_CATEGORY_FAIL,
  NEW_CATEGORY_REQUEST,
  NEW_CATEGORY_RESET,
  NEW_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_FAIL,
  UPDATE_CATEGORY_REQUEST,
  UPDATE_CATEGORY_RESET,
  UPDATE_CATEGORY_SUCCESS,
} from "../constants/categoryContants";
export const categoriesReducer = (state = { categories: [] }, action) => {
  switch (action.type) {
    case ALL_CATEGORY_REQUEST:
    case ADMIN_CATEGORY_REQUEST:
      return {
        loading: true,
        categories: [],
      };
    case ALL_CATEGORY_SUCCESS:
      return {
        loading: false,
        categories: action.payload.categories,
      };
    case ADMIN_CATEGORY_SUCCESS:
      return {
        loading: false,
        categories: action.payload,
      };
    case ALL_CATEGORY_FAIL:
    case ADMIN_CATEGORY_FAIL:
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
export const newCategoryReducer = (state = { category: {} }, action) => {
  switch (action.type) {
    case NEW_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NEW_CATEGORY_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
        category: action.payload.category,
      };
    case NEW_CATEGORY_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case NEW_CATEGORY_RESET:
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

export const categoryReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_CATEGORY_REQUEST:
    case UPDATE_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };

    case UPDATE_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };
    case DELETE_CATEGORY_FAIL:
    case UPDATE_CATEGORY_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_CATEGORY_RESET:
      return {
        ...state,
        isDeleted: false,
      };
    case UPDATE_CATEGORY_RESET:
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
export const categoryDetailsReducer = (state = { category: {} }, action) => {
  switch (action.type) {
    case CATEGORY_DETAILS_REQUEST:
      return {
        loading: true,
        ...state,
      };
    case CATEGORY_DETAILS_SUCCESS:
      return {
        loading: false,
        category: action.payload,
      };
    case CATEGORY_DETAILS_FAIL:
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
