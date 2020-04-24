import axios from "axios";
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
import { setAlert } from "./alert";
import setAuthToken from "../utils/setAuthToken";

/* Load user: To handle asynchronous action functions (that include API calls) with 
network requests, we have to return a function. When an action function returns a 
function, it becomes a thunk. The returned function is executed by Redux Thunk 
Middleware. The Thunk middleware passes the dispatch method as an argument to 
the returned function allowing dispatches.*/

export const loadUser = () => async (dispatch) => {
  /* if the token exists in localStorage, set the x-auth-token in the header
  to the token in local storage.*/
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    /* if the loadUser function is successful, load the /api/auth page*/
    const res = await axios.get("/api/auth");
    /* dispatch reducer which sets the user to the payload. The payload
    is the response sent from the axios request*/
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
  }
};

//Register user
export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ name, email, password });
  try {
    /* if the loadUser function is successful, perform a post request to the 
    /api/users path sending the name, email, and password in the body and
    sending a header identifying that the body is json*/
    const res = await axios.post("/api/users", body, config);
    /* dispatch the token received from the POST request (res.data) 
    to the state. */
    dispatch({ type: REGISTER_SUCCESS, payload: res.data });
    /* loadUser stores the token in local stoage and makes a
    GET request to /api/auth */
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({ type: REGISTER_FAIL });
  }
};

//Login user
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ email, password });
  try {
    /* a post request with a body containing the email and password. It 
      also contains a header to tell the backend that the content is json.
      The response from the post request is stored as res. */
    const res = await axios.post("/api/auth", body, config);
    /* send the type and payload (key) to the store. The store accepts the type and updates
    the state according to the payload*/
    dispatch({ type: LOGIN_SUCCESS, payload: res.data });
    /* calls the loadUser method defined above which makes a GET request to /api/auth */
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({ type: LOGIN_FAIL });
  }
};

//Log out, clear profile

export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
  dispatch({ type: CLEAR_PROFILE });
};
