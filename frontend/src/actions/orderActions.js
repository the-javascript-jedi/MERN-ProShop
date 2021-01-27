import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_PAY_FAIL,
  ORDER_PAY_SUCCESS,
  ORDER_PAY_REQUEST,
  ORDER_LIST_MY_REQUEST,
  ORDER_LIST_MY_SUCCESS,
  ORDER_LIST_MY_FAIL,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_DELIVER_REQUEST,
  ORDER_DELIVER_SUCCESS,
  ORDER_DELIVER_FAIL,
} from "../constants/orderConstants";
import axios from "axios";
// createOrder action
//it accepts an entire order
//we need to send a token so we use getState - we can get userInfo from getState which has the token in it
export const createOrder = (order) => async (dispatch, getState) => {
  try {
    // dispatch the ORDER_CREATE_REQUEST action
    dispatch({ type: ORDER_CREATE_REQUEST });
    // we want to destructure within 2 levels getState.userLogin.userInfo
    const {
      userLogin: { userInfo },
    } = getState();
    // we want to send a header with the content-type:application/json and token
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    // POST request
    //order is the second argument with the data we want to update with
    const { data } = await axios.post(`/api/orders`, order, config);
    // after register dispatch the ORDER_CREATE_SUCCESS
    dispatch({ type: ORDER_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
// getOrderDetails action
//it accepts an order id
//we need to send a token so we use getState - we can get userInfo from getState which has the token in it
export const getOrderDetails = (id) => async (dispatch, getState) => {
  try {
    // dispatch the ORDER_DETAILS_REQUEST action
    dispatch({ type: ORDER_DETAILS_REQUEST });
    // we want to destructure within 2 levels getState.userLogin.userInfo
    const {
      userLogin: { userInfo },
    } = getState();
    // we want to send a header with the content-type:application/json and token
    const config = {
      headers: {
        // GET request so Content-Type is not necessary
        // "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    // GET request
    const { data } = await axios.get(`/api/orders/${id}`, config);
    // after register dispatch the ORDER_DETAILS_SUCCESS
    dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
// payOrder action
//it accepts an order id and a paymentResult which comes from paypal
//we need to send a token so we use getState - we can get userInfo from getState which has the token in it
export const payOrder = (orderId, paymentResult) => async (
  dispatch,
  getState
) => {
  try {
    // dispatch the ORDER_PAY_REQUEST action
    dispatch({ type: ORDER_PAY_REQUEST });
    // we want to destructure within 2 levels getState.userLogin.userInfo
    const {
      userLogin: { userInfo },
    } = getState();
    // we want to send a header with the content-type:application/json and token
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    // PUT request
    // pass in the paymentResult and headers config
    const { data } = await axios.put(
      `/api/orders/${orderId}/pay`,
      paymentResult,
      config
    );
    // after register dispatch the ORDER_PAY_SUCCESS
    dispatch({ type: ORDER_PAY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ORDER_PAY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
// deliverOrder action
//it accepts the entire order
//we need to send a token so we use getState - we can get userInfo from getState which has the token in it
export const deliverOrder = (order) => async (dispatch, getState) => {
  try {
    // dispatch the ORDER_DELIVER_REQUEST action
    dispatch({ type: ORDER_DELIVER_REQUEST });
    // we want to destructure within 2 levels getState.userLogin.userInfo
    const {
      userLogin: { userInfo },
    } = getState();
    // we want to send a header with the content-type:application/json and token
    const config = {
      headers: {
        //  we are not sending data so we don't need the Content-Type
        // "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    // PUT request
    // we are not sending any data so pass an empty object to PUT request
    const { data } = await axios.put(
      `/api/orders/${order._id}/deliver`,
      {},
      config
    );
    // after register dispatch the ORDER_DELIVER_SUCCESS
    dispatch({ type: ORDER_DELIVER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ORDER_DELIVER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
// listMyOrder action
//we dont need to pass anything it knows us by our token
//we need to send a token so we use getState - we can get userInfo from getState which has the token in it
export const listMyOrders = () => async (dispatch, getState) => {
  try {
    // dispatch the ORDER_LIST_MY_REQUEST action
    dispatch({ type: ORDER_LIST_MY_REQUEST });
    // we want to destructure within 2 levels getState.userLogin.userInfo
    const {
      userLogin: { userInfo },
    } = getState();
    // we want to send a header with the content-type:application/json and token
    const config = {
      headers: {
        //For GET request we don't need the content-type
        //"Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    // GET request
    const { data } = await axios.get(`/api/orders/myorders`, config);
    // after register dispatch the ORDER_LIST_MY_SUCCESS
    dispatch({ type: ORDER_LIST_MY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ORDER_LIST_MY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
// listOrders action
//we dont need to pass anything it knows us by our token
//we need to send a token so we use getState - we can get userInfo from getState which has the token in it
export const listOrders = () => async (dispatch, getState) => {
  try {
    // dispatch the ORDER_LIST_REQUEST action
    dispatch({ type: ORDER_LIST_REQUEST });
    // we want to destructure within 2 levels getState.userLogin.userInfo
    const {
      userLogin: { userInfo },
    } = getState();
    // we want to send a header with the content-type:application/json and token
    const config = {
      headers: {
        //For GET request we don't need the content-type
        //"Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    // GET request
    const { data } = await axios.get(`/api/orders`, config);
    // after register dispatch the ORDER_LIST_SUCCESS
    dispatch({ type: ORDER_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ORDER_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
