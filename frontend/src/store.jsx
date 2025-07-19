import { composeWithDevTools } from "@redux-devtools/extension";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // LocalStorage use korar jonno
import { thunk } from "redux-thunk"; // ✅ Named import
import {
  forgotPasswordReducer,
  profileReducer,
  userReducer,
} from "./reducers/userReducer.jsx";

// Persist Config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // ✅ Only persist user reducer
};

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  profile: profileReducer,
  forgotPassword: forgotPasswordReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// let initialState = {
//   cart: {
//     cartItems: localStorage.getItem("cartItems")
//       ? JSON.parse(localStorage.getItem("cartItems"))
//       : [],
//   },
// };

// Middleware setup
const middleware = [thunk];

// Create store with persisted reducer
const store = createStore(
  persistedReducer,
  // initialState,
  //   applyMiddleware(...middleware)
  composeWithDevTools(applyMiddleware(...middleware))
);

// Persistor
export const persistor = persistStore(store);

export default store;
