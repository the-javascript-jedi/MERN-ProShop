import axios from "axios";
import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
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
