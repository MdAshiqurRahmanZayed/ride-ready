import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../../redux/authActionCreators";
import Spinner from "../Loading/Loading";

const Auth = ({ notify }) => {
  const [mode, setMode] = useState("Login");
  const [showPassword, setShowPassword] = useState(true);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    user_type: "client",
  });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const authLoading = useSelector((state) => state.authLoading);

  const switchModeHandler = () => {
    setMode((prevMode) => (prevMode === "Sign Up" ? "Login" : "Sign Up"));
  };

  const handleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };


  const validate = () => {
    const errors = {};
    if (!formValues.email) {
      errors.email = "Required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formValues.email)
    ) {
      errors.email = "Invalid email address";
    }
    if (!formValues.password) {
      errors.password = "Required";
    } else if (formValues.password.length < 4) {
      errors.password = "Must be at least 4 characters!";
    }
    if (mode === "Sign Up") {
      if (!formValues.passwordConfirm) {
        errors.passwordConfirm = "Required";
      } else if (formValues.password !== formValues.passwordConfirm) {
        errors.passwordConfirm = "Password field does not match!";
      }
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
       dispatch(
         auth(
          formValues.email,
          formValues.password,
          formValues.passwordConfirm,
          formValues.user_type,
          mode
        )
      );
    }
  };

  return (
    <div className="container my-5 px-5">
      {authLoading ? (
        <Spinner />
      ) : (
        <div className="">
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
              onClick={switchModeHandler}
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
                value={formValues.email}
                onChange={handleChange}
              />
              <span style={{ color: "red" }}>{errors.email}</span>
              <br />
              <input
                name="password"
                placeholder="Password"
                className="form-control"
                type={showPassword ? "password" : "text"}
                value={formValues.password}
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
                    type={showPassword ? "password" : "text"}
                    value={formValues.passwordConfirm}
                    onChange={handleChange}
                  />
                  <span style={{ color: "red" }}>{errors.passwordConfirm}</span>
                  <br />
                  <select
                    name="user_type"
                    className="form-select"
                    value={formValues.user_type}
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
                  className="form-check-input"
                  onClick={handleShowPassword}
                  checked={!showPassword}
                />
                Show password
              </div>
              <button type="submit" className="btn btn-success">
                {mode === "Sign Up" ? "Sign Up" : "Login"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
