import { SET_ALERT, REMOVE_ALERT } from "../actions/types";
const initialState = [];

//{ id: 1, msg: "Please log in", alertType: "success" }. State is immutable

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_ALERT:
      /* returns the whole new state plus the payload */
      return [...state, payload];
    case REMOVE_ALERT:
      /* returns the whole new state filtered for alerts in the payload */
      return state.filter((alert) => alert.id !== payload);
    default:
      return state;
  }
}
