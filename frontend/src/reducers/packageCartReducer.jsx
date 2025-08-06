import {
  ADD_TO_PACKAGE_CART,
  REMOVE_CART_PACKAGE_ITEM,
} from "../constants/cartContants";

export const packageCartReducer = (
  state = { packageCartItems: [] },
  action
) => {
  switch (action.type) {
    case ADD_TO_PACKAGE_CART:
      const item = action.payload;

      const isItemExist = state.packageCartItems.find((i) => i.id === item.id);

      if (isItemExist) {
        return {
          ...state,
          packageCartItems: state.packageCartItems.map((i) =>
            i.id === isItemExist.id ? item : i
          ),
        };
      } else {
        return {
          ...state,
          packageCartItems: [...state.packageCartItems, item],
        };
      }

    case REMOVE_CART_PACKAGE_ITEM:
      return {
        ...state,
        packageCartItems: state.packageCartItems.filter(
          (i) => i.id !== action.payload
        ),
      };

    default:
      return state;
  }
};
