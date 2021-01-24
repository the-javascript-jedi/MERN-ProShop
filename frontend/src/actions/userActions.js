import axios from "axios";
import {
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_DETAILS_RESET,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
} from "../constants/userConstants";
import { ORDER_LIST_MY_RESET } from "../constants/orderConstants";
// login action requires and email and password
export const login = (email, password) => async (dispatch) => {
  try {
    // dispatch the login request action
    dispatch({ type: USER_LOGIN_REQUEST });
    // we want to send a header with the content-type:application/json
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      "/api/users/login",
      { email, password },
      config
    );
    // after login dispatch the user login success
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    // save the userInfo to local storage
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
// logout action
export const logout = (dispatch) => {
  // remove user data from localstorage
  localStorage.removeItem("userInfo");
  dispatch({ type: USER_LOGOUT });
  // reset the order and user state
  dispatch({ type: USER_DETAILS_RESET });
  dispatch({ type: ORDER_LIST_MY_RESET });
  //reset the state such that all the users fetched for get all users to display to the admin is reset
  dispatch({ type: USER_LIST_RESET });
};
// register action
// register action requires name, email and password
export const register = (name, email, password) => async (dispatch) => {
  try {
    // dispatch the register request action
    dispatch({ type: USER_REGISTER_REQUEST });
    // we want to send a header with the content-type:application/json
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      "/api/users",
      { name, email, password },
      config
    );
    // after register dispatch the user register success
    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
    //after registration we want the user to be logged in
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    // when we login or register we get the user data and token back for both login action and register action
    // save the userInfo to local storage
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
// get user details action
// getUserDetails action requires user id
//we need to send a token so we use getState - we can get userInfo from getState which has the token in it
export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    // dispatch the USER_DETAILS_REQUEST action
    dispatch({ type: USER_DETAILS_REQUEST });
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
    const { data } = await axios.get(`/api/users/${id}`, config);
    // after register dispatch the USER_DETAILS_SUCCESS
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
// update user profile action
// updateUserProfile action requires entire user object
//we need to send a token so we use getState - we can get userInfo from getState which has the token in it
export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    // dispatch the USER_UPDATE_PROFILE_REQUEST action
    dispatch({ type: USER_UPDATE_PROFILE_REQUEST });
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
    // PUT request for updating,
    //user is the second argument with the data we want to update with
    const { data } = await axios.put(`/api/users/profile`, user, config);
    // after register dispatch the USER_UPDATE_PROFILE_SUCCESS
    dispatch({ type: USER_UPDATE_PROFILE_SUCCESS, payload: data });
    //for updating the navbar with updated name
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    // set the user info in local storage
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
// list users action
// listUsers action does not require any arguments
//we need to send a token so we use getState - we can get userInfo from getState which has the token in it
export const listUsers = (user) => async (dispatch, getState) => {
  try {
    // dispatch the USER_LIST_REQUEST action
    dispatch({ type: USER_LIST_REQUEST });
    // we want to destructure within 2 levels getState.userLogin.userInfo
    const {
      userLogin: { userInfo },
    } = getState();
    // we want to send a header with the content-type:application/json and token
    const config = {
      headers: {
        // GET request does not require content-type
        // "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    // GET request,
    const { data } = await axios.get(`/api/users`, config);
    // after register dispatch the USER_LIST_SUCCESS
    dispatch({ type: USER_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
// delete user action
// deleteUser action does not require the id to be deleted
//we need to send a token so we use getState - we can get userInfo from getState which has the token in it
export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    // dispatch the USER_DELETE_REQUEST action
    dispatch({ type: USER_DELETE_REQUEST });
    // we want to destructure within 2 levels getState.userLogin.userInfo
    const {
      userLogin: { userInfo },
    } = getState();
    // we want to send a header with the content-type:application/json and token
    const config = {
      headers: {
        // GET request does not require content-type
        // "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    // DELETE request
    await axios.delete(`/api/users/${id}`, config);
    // after register dispatch the USER_DELETE_SUCCESS
    // no need to send a payload
    dispatch({ type: USER_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: USER_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
// update user data action
// updateuser action require the user object
//we need to send a token so we use getState - we can get userInfo from getState which has the token in it
export const updateUser = (user) => async (dispatch, getState) => {
  try {
    // dispatch the USER_UPDATE_REQUEST action
    dispatch({ type: USER_UPDATE_REQUEST });
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
    // send the user data as a second argument
    const { data } = await axios.put(`/api/users/${user._id}`, user, config);
    // after register dispatch the USER_UPDATE_SUCCESS
    // no need to send a payload
    dispatch({ type: USER_UPDATE_SUCCESS });
    // dispatch USER_DETAILS_SUCCESS so state.user will be updated with the updated data
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
