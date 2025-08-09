import { composeWithDevTools } from "@redux-devtools/extension";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // LocalStorage use korar jonno
import { thunk } from "redux-thunk"; // ✅ Named import
import {
  blogAdminDetailsReducer,
  blogDetailsReducer,
  blogReducer,
  blogsReducer,
  newBlogReducer,
} from "./reducers/blogReducer";
import { bookCartReducer } from "./reducers/bookCartReducer";
import {
  bookAdminDetailsReducer,
  bookDetailsReducer,
  bookReducer,
  BookReviewsReducer,
  booksReducer,
  newBookReducer,
  newReviewReducer,
  reviewReducer,
} from "./reducers/bookReducer";
import {
  categoriesReducer,
  categoryDetailsReducer,
  categoryReducer,
  newCategoryReducer,
} from "./reducers/categoryReducer";
import { ebookCartReducer } from "./reducers/ebookCartReducer";
import {
  allOrdersReducer,
  myOrdersReducer,
  orderDetailsReducer,
  orderReducer,
} from "./reducers/orderReducer";
import { packageCartReducer } from "./reducers/packageCartReducer";
import {
  newPackageReducer,
  newPackageReviewReducer,
  packageAdminDetailsReducer,
  packageDetailsReducer,
  packageReducer,
  packagesReducer,
} from "./reducers/packageReducer";
import {
  newShipReducer,
  shipDetailsReducer,
  shipReducer,
  shipsReducer,
} from "./reducers/shipReducer";
import {
  allUsersReducer,
  forgotPasswordReducer,
  profileReducer,
  userDetailsReducer,
  userReducer,
} from "./reducers/userReducer";

// Persist Config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  profile: profileReducer,
  forgotPassword: forgotPasswordReducer,
  userDetails: userDetailsReducer,
  allUsers: allUsersReducer,
  newBlog: newBlogReducer,
  blogs: blogsReducer,
  blog: blogReducer,
  blogDetails: blogDetailsReducer,
  blogAdminDetails: blogAdminDetailsReducer,
  newCategory: newCategoryReducer,
  categories: categoriesReducer,
  category: categoryReducer,
  categoryDetails: categoryDetailsReducer,
  newShip: newShipReducer,
  ships: shipsReducer,
  ship: shipReducer,
  shipDetails: shipDetailsReducer,
  books: booksReducer,
  newBook: newBookReducer,
  book: bookReducer,
  bookDetails: bookDetailsReducer,
  bookAdminDetails: bookAdminDetailsReducer,
  newReview: newReviewReducer,

  packages: packagesReducer,
  newPackage: newPackageReducer,
  package: packageReducer,
  packageDetails: packageDetailsReducer,
  packageAdminDetails: packageAdminDetailsReducer,
  newPackageReview: newPackageReviewReducer,
  bookReview: reviewReducer,
  bookReviews: BookReviewsReducer,

  //order
  myOrders: myOrdersReducer,
  allOrders: allOrdersReducer,
  order: orderReducer,
  orderDetails: orderDetailsReducer,

  // cart
  ebookCart: ebookCartReducer,
  bookCart: bookCartReducer,
  packageCart: packageCartReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

let initialState = {
  ebookCart: {
    ebookCartItems: localStorage.getItem("ebookCartItems")
      ? JSON.parse(localStorage.getItem("ebookCartItems"))
      : [],
  },
  bookCart: {
    bookCartItems: localStorage.getItem("bookCartItems")
      ? JSON.parse(localStorage.getItem("bookCartItems"))
      : [],
  },
  packageCart: {
    packageCartItems: localStorage.getItem("packageCartItems")
      ? JSON.parse(localStorage.getItem("packageCartItems"))
      : [],
  },
};

// Middleware setup
const middleware = [thunk];

// Create store with persisted reducer
const store = createStore(
  persistedReducer,
  initialState,
  // applyMiddleware(...middleware),
  composeWithDevTools(applyMiddleware(...middleware))
);

// Persistor
export const persistor = persistStore(store);

export default store;
