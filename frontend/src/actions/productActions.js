import axios from "axios";
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
} from "../constants/productConstants";
// to make an asynchronous request we use redux thunk-using thunk we can call a function within a function
export const listProducts = () => async (dispatch) => {
  try {
    //2- listProducts() is dispatched from the HomeScreen.js
    //   dispatch the request
    dispatch({ type: PRODUCT_LIST_REQUEST });
    // data from axios request
    const { data } = await axios.get("/api/products");
    // request success
    //3-since data received is successful so it passes the data to the payload and calls the reducer
    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
// listProductDetails action
export const listProductDetails = (id) => async (dispatch) => {
  try {
    //   dispatch the request
    dispatch({ type: PRODUCT_DETAILS_REQUEST });
    // data from axios request
    const { data } = await axios.get(`/api/products/${id}`);
    // request success
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
