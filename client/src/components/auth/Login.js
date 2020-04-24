import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../../actions/auth";

export const Login = ({ login, isAuthenticated }) => {
  /* sets the initial state property formData to email: "" and password: ""
    setFormData is defined as a function that can alter the formData state */
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  /* whenever the input is changed, the setFormData function updates the state.
  e.target.name is the name of the formData property that was updated. It has the be in brackets
  because it is a property that is being set and it is a variable. e.target.value
  is the aggregate value (i.e. entire string) that was changed. You could also just use
  setFormData(e.target.value = e.target.value) */
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    login(email, password);
    //   const newUser = {
    //     name,
    //     email,
    //     password,
    //   };

    //   try {
    //     const config = {
    //       headers: { "Content-Type": "Application/json" },
    //     };
    //     const body = JSON.stringify(newUser);
    //     const res = await axios.post("/api/users", body, config);
    //     console.log(res.data);
    //   } catch (err) {
    //     console.error(err.response.data);
    //   }
  };

  // redirect if logged in
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign Into Your Account
      </p>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => onChange(e)}
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Fragment>
  );
};

// checking the type of the props that are being passed into the component

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

/* mapStateToProps is the first argument that is passed into the connect method.
mapStateToProps selects data from the store that the component needs. It is called
every time the store state changes. The state argument is the entire redux store. 
Therefore, the mapStateToProps method below returns an object with an isAuthenticated property
set to the value of state.auth.isAuthenticated.*/

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
