import {
  ADD_TO_EBOOK_CART,
  REMOVE_CART_EBOOK_ITEM,
} from "../constants/cartContants";

export const ebookCartReducer = (state = { ebookCartItems: [] }, action) => {
  switch (action.type) {
    case ADD_TO_EBOOK_CART:
      const item = action.payload;

      const isItemExist = state.ebookCartItems.find((i) => i.id === item.id);

      if (isItemExist) {
        return {
          ...state,
          ebookCartItems: state.ebookCartItems.map((i) =>
            i.id === isItemExist.id ? item : i
          ),
        };
      } else {
        return {
          ...state,
          ebookCartItems: [...state.ebookCartItems, item],
        };
      }

    case REMOVE_CART_EBOOK_ITEM:
      return {
        ...state,
        ebookCartItems: state.ebookCartItems.filter(
          (i) => i.id !== action.payload
        ),
      };

    default:
      return state;
  }
};
