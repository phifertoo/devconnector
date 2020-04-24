import axios from "axios";

const setAuthToken = (token) => {
  //if the token exists, set the x-auth-token in the header to the token in local storage
  if (token) {
    axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

export default setAuthToken;
