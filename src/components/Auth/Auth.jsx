import React, { Component } from "react";
import { Formik } from "formik";
import { connect } from "react-redux";
import { auth } from "../../redux/authActionCreators";
import Spinner from "../Loading/Loading";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import toast, { Toaster } from "react-hot-toast";
import { notificationTime } from "../../redux/baseUrls";

const mapStateToProps = (state) => ({
  authLoading: state.authLoading,
  authFailedMsg: state.authFailedMsg,
  successMsg: state.successMsg,
});

const mapDispatchToProps = (dispatch) => ({
  auth: (email, password, passwordConfirm, user_type, mode) =>
    dispatch(auth(email, password, passwordConfirm, user_type, mode)),
});

class Auth extends Component {
  state = {
    mode: "Login",
    showPassword: true,
  };

  switchModeHandler = () => {
    this.setState({
      mode: this.state.mode === "Sign Up" ? "Login" : "Sign Up",
    });
  };

  handleShowPassword = () => {
    this.setState({
      showPassword: !this.state.showPassword,
    });
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.successMsg !== prevProps.successMsg &&
      this.props.successMsg
    ) {
      toast.success(this.props.successMsg, { autoClose: 5000 });
    }

    if (this.props.authFailedMsg !== prevProps.authFailedMsg) {
      toast.error(this.props.authFailedMsg, { autoClose: 5000 });
    }
  }

  render() {
    const { authLoading } = this.props;
    const { mode } = this.state;

    return (
      <div className="container my-5 px-5">
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: notificationTime,
          }}
        />
        {authLoading ? (
          <Spinner />
        ) : (
          <div className="">
            <Formik
              initialValues={{
                email: "",
                password: "",
                passwordConfirm: "",
                user_type: "client",
              }}
              onSubmit={(values) => {
                this.props.auth(
                  values.email,
                  values.password,
                  values.passwordConfirm,
                  values.user_type,
                  mode
                );
                this.props.notify("Authentication successful",'info');
              }}
              validate={(values) => {
                const errors = {};

                if (!values.email) {
                  errors.email = "Required";
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  errors.email = "Invalid email address";
                }

                if (!values.password) {
                  errors.password = "Required";
                } else if (values.password.length < 4) {
                  errors.password = "Must be at least 4 characters!";
                }

                if (mode === "Sign Up") {
                  if (!values.passwordConfirm) {
                    errors.passwordConfirm = "Required";
                  } else if (values.password !== values.passwordConfirm) {
                    errors.passwordConfirm = "Password field does not match!";
                  }
                }

                return errors;
              }}
            >
              {({ values, handleChange, handleSubmit, errors }) => (
                <div
                  style={{
                    border: "1px grey solid",
                    padding: "15px",
                    borderRadius: "7px",
                  }}
                >
                  <button
                    style={{
                      width: "100%",
                      backgroundColor: "#537188",
                      color: "white",
                    }}
                    className="btn btn-lg"
                    onClick={this.switchModeHandler}
                  >
                    Switch to {mode === "Sign Up" ? "Login" : "Sign Up"}
                  </button>
                  <br />
                  <br />
                  <form onSubmit={handleSubmit}>
                    <input
                      name="email"
                      placeholder="Enter Your Email"
                      className="form-control"
                      value={values.email}
                      onChange={handleChange}
                    />
                    <span style={{ color: "red" }}>{errors.email}</span>
                    <br />
                    <input
                      name="password"
                      placeholder="Password"
                      className="form-control"
                      value={values.password}
                      type={this.state.showPassword ? "password" : "text"}
                      onChange={handleChange}
                    />
                    <span style={{ color: "red" }}>{errors.password}</span>
                    <br />

                    {mode === "Sign Up" && (
                      <div>
                        <input
                          name="passwordConfirm"
                          placeholder="Confirm Password"
                          className="form-control"
                          type={this.state.showPassword ? "password" : "text"}
                          value={values.passwordConfirm}
                          onChange={handleChange}
                        />
                        <span style={{ color: "red" }}>
                          {errors.passwordConfirm}
                        </span>
                        <br />
                        <select
                          name="user_type"
                          className="form-select"
                          value={values.user_type}
                          onChange={handleChange}
                        >
                          <option value="client">Client</option>
                          <option value="car_owner">Car owner</option>
                        </select>
                        <br />
                      </div>
                    )}
                    <div className="m-1">
                      <input
                        type="checkbox"
                        name=""
                        className="form-check-input"
                        id=""
                        onClick={() => this.handleShowPassword()}
                        value={this.state.showPassword}
                      />{" "}
                      Show password
                    </div>
                    <button type="submit" className="btn btn-success">
                      {mode === "Sign Up" ? "Sign Up" : "Login"}
                    </button>
                  </form>
                </div>
              )}
            </Formik>
            <Toaster
              position="top-right"
              reverseOrder={false}
              toastOptions={{
                duration: notificationTime,
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
