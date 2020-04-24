import { SET_ALERT, REMOVE_ALERT } from "./types";
import { v4 as uuidv4 } from "uuid";

export const setAlert = (msg, alertType, timeout = 5000) => (dispatch) => {
  /* random universal id */
  const id = uuidv4();
  /* dispatches the msg, alertType, and id as a payload to the store. The 
  state is also updated according to the data in the payload */
  dispatch({ type: SET_ALERT, payload: { msg, alertType, id } });
  /* after 5 seconds the alert will be removed*/
  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
