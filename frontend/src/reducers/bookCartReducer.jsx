import {
  ADD_TO_BOOK_CART,
  REMOVE_CART_BOOK_ITEM,
} from "../constants/cartContants";

export const bookCartReducer = (state = { bookCartItems: [] }, action) => {
  switch (action.type) {
    case ADD_TO_BOOK_CART:
      const item = action.payload;

      const isItemExist = state.bookCartItems.find((i) => i.id === item.id);

      if (isItemExist) {
        return {
          ...state,
          bookCartItems: state.bookCartItems.map((i) =>
            i.id === isItemExist.id ? item : i
          ),
        };
      } else {
        return {
          ...state,
          bookCartItems: [...state.bookCartItems, item],
        };
      }

    case REMOVE_CART_BOOK_ITEM:
      return {
        ...state,
        bookCartItems: state.bookCartItems.filter(
          (i) => i.id !== action.payload
        ),
      };

    default:
      return state;
  }
};
