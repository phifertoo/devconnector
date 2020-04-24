import axios from "axios";
import { setAlert } from "./alert";
import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  CLEAR_PROFILE,
  ACCOUNT_DELETED,
  GET_REPOS,
  GET_POST,
} from "./types";

// get current users profile
export const getCurrentProfile = () => async (dispatch) => {
  try {
    /* GET requeset to api/profile/me which responds with the user's
    profile. */
    const res = await axios.get("/api/profile/me");
    /* dispatch the reducer. The GET_PROFILE case in the reducer will 
    set the profile to the payload which is res.data. res.data is the profile
    that is sent from the server */
    dispatch({ type: GET_PROFILE, payload: res.data });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//get all profiles
export const getProfiles = () => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  try {
    /* GET requeset to api/profile/me which responds with the user's
    profile. */
    const res = await axios.get("/api/profile");
    /* dispatch the reducer. The GET_PROFILE case in the reducer will 
    set the profile to the payload which is res.data. res.data is the profile
    that is sent from the server */
    dispatch({ type: GET_PROFILES, payload: res.data });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//get profile by id
export const getProfileById = (userId) => async (dispatch) => {
  try {
    /* GET requeset to api/profile/me which responds with the user's
    profile. */
    const res = await axios.get(`/api/profile/user/${userId}`);
    /* dispatch the reducer. The GET_PROFILE case in the reducer will 
    set the profile to the payload which is res.data. res.data is the profile
    that is sent from the server */
    dispatch({ type: GET_PROFILE, payload: res.data });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//get Github repos
export const getGithubRepos = (username) => async (dispatch) => {
  try {
    /* GET requeset to api/profile/me which responds with the user's
    profile. */
    const res = await axios.get(`/api/profile/github/${username}`);
    /* dispatch the reducer. The GET_PROFILE case in the reducer will 
    set the profile to the payload which is res.data. res.data is the profile
    that is sent from the server */
    dispatch({ type: GET_REPOS, payload: res.data });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//create or update profile

export const createProfile = (formData, history, edit = false) => async (
  dispatch
) => {
  try {
    /* configure the headers*/
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    /* make a post request to api/profile passing the formData and
    configuration (headers).  */
    const res = await axios.post("/api/profile", formData, config);
    /* dispatch the reducer. The GET_PROFILE case in the reducer will 
    set the profile to the payload which is res.data. res.data is the profile
    that is sent from the server */
    dispatch({ type: GET_PROFILE, payload: res.data });
    /* call the setAlert action. If the profile was updated, the alert
    will be be that the profile was udpated.*/
    dispatch(setAlert(edit ? "Profile Updated" : "Profile Created", "success"));
    /* if the profile was not updated, the user will be routed to the dashboard*/
    if (!edit) {
      history.push("/dashboard");
    }
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// add experience

export const addExperience = (formData, history) => async (dispatch) => {
  try {
    /* configure the headers*/
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    /* make a post request to api/profile passing the formData and
    configuration (headers).  */
    const res = await axios.put("/api/profile/experience", formData, config);
    /* dispatch the reducer. The GET_PROFILE case in the reducer will 
    set the profile to the payload which is res.data. res.data is the profile
    that is sent from the server */
    dispatch({ type: UPDATE_PROFILE, payload: res.data });
    /* call the setAlert action. If the profile was updated, the alert
    will be be that the profile was udpated.*/
    dispatch(setAlert("Experience Added", "success"));
    /* if the profile was not updated, the user will be routed to the dashboard*/
    history.push("/dashboard");
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// add education

export const addEducation = (formData, history) => async (dispatch) => {
  try {
    /* configure the headers*/
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    /* make a post request to api/profile passing the formData and
    configuration (headers).  */
    const res = await axios.put("/api/profile/education", formData, config);
    /* dispatch the reducer. The GET_PROFILE case in the reducer will 
    set the profile to the payload which is res.data. res.data is the profile
    that is sent from the server */
    dispatch({ type: UPDATE_PROFILE, payload: res.data });
    /* call the setAlert action. If the profile was updated, the alert
    will be be that the profile was udpated.*/
    dispatch(setAlert("Education Added", "success"));
    /* if the profile was not updated, the user will be routed to the dashboard*/
    history.push("/dashboard");
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete experience

export const deleteExperience = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });
    dispatch(setAlert("Experience Removed", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete education

export const deleteEducation = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/education/${id}`);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });
    dispatch(setAlert("Education Removed", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete account & profile

export const deleteAccount = (id) => async (dispatch) => {
  if (window.confirm("Are you sure? This cannot be undone")) {
    try {
      await axios.delete("/api/profile/");
      dispatch({
        type: CLEAR_PROFILE,
      });
      dispatch({
        type: ACCOUNT_DELETED,
      });
      dispatch(setAlert("Your account ha been permanantly deleted", "success"));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};
