import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const PrivateRoute = ({
  /* In App.js, <PrivateRoute> passes in props = {component: Dashboard}
  which we set to component: Component below. Now, <Component>
  will be set to <DashBoard>
  ...rest accounts for any other props that are passed in from App.js
isAuthenticated and loading are pulled from the state*/
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}) => (
  <Route
    {...rest}
    /* To render a component with props using <Route>, you need to use the 
    render prop which takes in a function. The function has a props parameter
    which can pass in all the props into the Component by using {...props}*/
    render={(props) =>
      !isAuthenticated && !loading ? (
        <Redirect to="/login" />
      ) : (
        <Component {...props} />
      )
    }
  />
);

PrivateRoute.propTypes = { auth: PropTypes.object.isRequired };

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
