import axios from "axios";
import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
} from "../constants/userConstants";

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
