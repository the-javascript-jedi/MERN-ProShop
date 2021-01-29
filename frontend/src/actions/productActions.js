import axios from "axios";
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_CREATE_REVIEW_REQUEST,
  PRODUCT_CREATE_REVIEW_SUCCESS,
  PRODUCT_CREATE_REVIEW_FAIL,
  PRODUCT_TOP_REQUEST,
  PRODUCT_TOP_SUCCESS,
  PRODUCT_TOP_FAIL,
} from "../constants/productConstants";
// to make an asynchronous request we use redux thunk-using thunk we can call a function within a function
// pass in keyword with default value set as empty string
export const listProducts = (keyword = "", pageNumber = "") => async (
  dispatch
) => {
  try {
    //2- listProducts() is dispatched from the HomeScreen.js
    //   dispatch the request
    dispatch({ type: PRODUCT_LIST_REQUEST });
    // data from axios request - pass in keyword(?) and pageNumber(&) as querystrings
    const { data } = await axios.get(
      `/api/products?keyword=${keyword}&pageNumber=${pageNumber}`
    );
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
// deleteProduct action
//we need to pass the id of the product we need to delete
//we need to send a token so we use getState - we can get userInfo from getState which has the token in it
export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    // dispatch the PRODUCT_DELETE_REQUEST action
    dispatch({ type: PRODUCT_DELETE_REQUEST });
    // we want to destructure within 2 levels getState.userLogin.userInfo
    const {
      userLogin: { userInfo },
    } = getState();
    // we want to send a header with the content-type:application/json and token
    const config = {
      headers: {
        //For GET,DELETE request we don't need the content-type
        //"Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    // DELETE request
    await axios.delete(`/api/products/${id}`, config);
    // after register dispatch the PRODUCT_DELETE_SUCCESS
    // for delete request we don't need to pass any data to payload
    dispatch({ type: PRODUCT_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: PRODUCT_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
// createProduct action
//create product creates a sample product with dummy data
//we need to send a token so we use getState - we can get userInfo from getState which has the token in it
export const createProduct = (id) => async (dispatch, getState) => {
  try {
    // dispatch the PRODUCT_CREATE_REQUEST action
    dispatch({ type: PRODUCT_CREATE_REQUEST });
    // we want to destructure within 2 levels getState.userLogin.userInfo
    const {
      userLogin: { userInfo },
    } = getState();
    // we want to send a header with the content-type:application/json and token
    const config = {
      headers: {
        //For GET,DELETE request we don't need the content-type
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    // POST request
    // we send an empty object as the second argument because we are actually not sending any data
    const { data } = await axios.post(`/api/products`, {}, config);
    // after register dispatch the PRODUCT_CREATE_SUCCESS
    dispatch({ type: PRODUCT_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
// updateProduct action
//update product with the manual data to overwrite the sample data already present
//we need to send a token so we use getState - we can get userInfo from getState which has the token in it
export const updateProduct = (product) => async (dispatch, getState) => {
  try {
    // dispatch the PRODUCT_UPDATE_REQUEST action
    dispatch({ type: PRODUCT_UPDATE_REQUEST });
    // we want to destructure within 2 levels getState.userLogin.userInfo
    const {
      userLogin: { userInfo },
    } = getState();
    // we want to send a header with the content-type:application/json and token
    const config = {
      headers: {
        //For GET,DELETE request we don't need the content-type
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    // PUT request
    // we send the product as the second argument because we need to update the existing sample data in db with the updated product data present in second argument
    const { data } = await axios.put(
      `/api/products/${product._id}`,
      product,
      config
    );
    // after register dispatch the PRODUCT_UPDATE_SUCCESS
    dispatch({ type: PRODUCT_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
// createProductReview action
//createProductReview takes the product id and a review object which has a rating and a comment
//we need to send a token so we use getState - we can get userInfo from getState which has the token in it
export const createProductReview = (productId, review) => async (
  dispatch,
  getState
) => {
  try {
    // dispatch the PRODUCT_CREATE_REVIEW_REQUEST action
    dispatch({ type: PRODUCT_CREATE_REVIEW_REQUEST });
    // we want to destructure within 2 levels getState.userLogin.userInfo
    const {
      userLogin: { userInfo },
    } = getState();
    // we want to send a header with the content-type:application/json and token
    const config = {
      headers: {
        //For GET,DELETE request we don't need the content-type
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    // POST request
    // we send the product id in the request as params
    //we are not returning anything from the request except a message so we can simply call the route and ignore displaying the response message
    //we pass in the review object as a second argument this will contain the rating and comments as data
    await axios.post(`/api/products/${productId}/reviews`, review, config);
    // after register dispatch the PRODUCT_CREATE_REVIEW_SUCCESS
    //we doont need to send any payload:data to the request, so we simply dispatch the action type
    dispatch({ type: PRODUCT_CREATE_REVIEW_SUCCESS });
  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_REVIEW_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
// listProducts actions
export const listTopProducts = () => async (dispatch) => {
  try {
    //   dispatch the request
    dispatch({ type: PRODUCT_TOP_REQUEST });
    // data from axios request - pass in keyword(?) and pageNumber(&) as querystrings
    const { data } = await axios.get(`/api/products/top`);
    // request success
    dispatch({ type: PRODUCT_TOP_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_TOP_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
