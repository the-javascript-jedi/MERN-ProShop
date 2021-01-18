import axios from "axios";
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
} from "../constants/cartConstants";
//dispatch is passed to the action
// getState - is passed to get the entire state tree from the reducer
export const addToCart = (id, qty) => async (dispatch, getState) => {
  // data from axios request
  const { data } = await axios.get(`/api/products/${id}`);

  dispatch({
    type: CART_ADD_ITEM,
    // stuff we want to display in our cart
    payload: {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty,
    },
  });
  //   save entire cart using getState we can access the store reducer
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};
// remove from cart
export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};
// save the shipping address
//it takes in the submitted form data
export const saveShippingAddress = (data) => (dispatch, getState) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  });
  // save to the local storage
  localStorage.setItem("shippingAddress", JSON.stringify(data));
};
// save the payment method
//it takes in the submitted payment methoda
export const savePaymentMethod = (data) => (dispatch, getState) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  });
  // save to the local storage
  localStorage.setItem("paymentMethod", JSON.stringify(data));
};
