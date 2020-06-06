import axios from "axios";
import cogoToast from "cogo-toast";

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
} from "./types";

export const loadUser = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/users/user");

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};


export const register = (name, email, password, history) => async (
  dispatch
) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ name, email, password });
  try {
    const res = await axios.post("/api/users/register", body, config);
    if (res.status === 200) {
      cogoToast.success('User successfully registered', {
        position: "top-right",
      });
    }

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
    history.push("/signin");
  } catch (err) {
    
    if (err.response.status === 403) {
      cogoToast.error(err.response.data.msg, {
        position: "top-right",
      });
    }

    if (err.response.status === 400) {
      cogoToast.error("Password must be at least 6 characters long", {
        position: "top-right",
      });
    }


    dispatch({
      type: REGISTER_FAIL,
    });
  }
};


export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("/api/users/login", body, config);
    if (res.status === 200) {
      cogoToast.success("Welcome back", {
        position: "bottom-right",
      });
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
    }

    dispatch(loadUser());
  } catch (err) {
    // const errors = err.response.data.errors;
    if (err.response.status === 400) {
      cogoToast.error(err.response.data.msg, {
        position: "top-right",
      });
    }
    if (err.response.status === 500) {
      cogoToast.error(err.response.data.msg, {
        position: "top-right",
      });
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

/* export const googleLogin = (res) => dispatch => {
  dispatch({
    type: LOGIN_SUCCESS,
    payload: res.data,
  });
  dispatch(loadUser());
} */
export const googleLogin = (response) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios({
      method: "POST",
      url: "/api/users/google-login",
      data: { idToken: response.tokenId },
      config,
    });
    if (res.status === 200) {
      cogoToast.success("Welcome back", {
        position: "bottom-right",
      });
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
    }

    dispatch(loadUser());
  } catch (err) {
    
    if (err.response.status === 400) {
      cogoToast.error(err.response.data.msg, {
        position: "top-right",
      });
    }
    if (err.response.status === 500) {
      cogoToast.error(err.response.data.msg, {
        position: "top-right",
      });
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
} 

// Logout / Clear Profile
export const logout = () => (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
  
};
