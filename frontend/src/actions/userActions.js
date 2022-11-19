import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGIN_REQUEST,
  CLEAR_ERRORS,
} from "../constants/userConstants";

import axios from "axios";

export const getUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error.response.data.message,
    });
  }
};
