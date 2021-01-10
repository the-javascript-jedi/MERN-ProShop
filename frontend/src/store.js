import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { productListReducer } from "./reducers/productReducers";
import { productDetailsReducer } from "./reducers/productReducers";
import { cartReducer } from "./reducers/cartReducers";
// combine reducers
const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  cart: cartReducer,
});
//fetch cart data from local storage
const cartItemsFromStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];
const initialState = {
  //if localStorage has any cart values set the state to localStorage cart data
  cart: { cartItems: cartItemsFromStorage },
};
const middleware = [thunk];
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);
export default store;
