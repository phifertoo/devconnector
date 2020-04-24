import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

/* passing in alerts to use inside of the component*/
const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  /* the alerts in the state are an array*/
  alerts.map((alert) => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));

alert.propTypes = { alerts: PropTypes.array.isRequired };

/* properties you need from the state*/
const mapStateToProps = (state) => ({
  alerts: state.alert,
});

export default connect(mapStateToProps)(Alert);
