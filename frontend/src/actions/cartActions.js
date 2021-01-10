import axios from "axios";
import { CART_ADD_ITEM, CART_REMOVE_ITEM } from "../constants/cartConstants";
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
