import React, { useEffect } from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { Route, Routes, Navigate } from "react-router-dom";
import Auth from "./Auth/Auth";
import Logout from "./Auth/Logout";
import { connect, useDispatch, useSelector } from "react-redux";
import Home from "./Home/Home";
import { authCheck, remove_auth_message } from "../redux/authActionCreators";
import "react-toastify/dist/ReactToastify.css";
import Categories from "./Category/Categories";
import Vehicles from "./Vehicle/Vehicles";
import CarDetail from "./Store/CarDetail";
import AllBooked from "./Book/AllBooked";
import SeeBookedVehicle from "./Vehicle/SeeBookedVehicle";
// import toast, { Toaster } from "react-hot-toast";
// import { notificationTime } from "../redux/baseUrls";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
  
const mapStateToProps = (state) => ({
  token: state.token,
  successMsg: state.successMsg,
  authCheckResponse: state.authCheckResponse,
});

const mapDispatchToProps = (dispatch) => ({
  authCheck: () => dispatch(authCheck()),
});

const Main = ({ token, authCheck, successMsg }) => {
    const authFailedMsg = useSelector((state) => state.authFailedMsg);
    const authSuccessMsg = useSelector((state) => state.authSuccessMsg);
    const dispatch = useDispatch();

  useEffect(() => {
    authCheck()
  }, [authCheck]);


  let routes = null;
  const notify = (message, type) => {
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "warning":
        toast.warning(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "info":
        toast.info(message);
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    if (authSuccessMsg) {
      notify(authSuccessMsg, "info");
      dispatch(remove_auth_message());
    }
    if (authFailedMsg) {
      notify(authFailedMsg, "error");
      dispatch(remove_auth_message());
    }
  }, [authSuccessMsg, authFailedMsg, dispatch]);
  if (token) {
    // If token exists, user is authenticated
    routes = (
      <Routes>
        <Route path="/" element={<Home notify={notify} />} />
        <Route path="/category" element={<Categories notify={notify} />} />
        <Route path="/vehicle" element={<Vehicles notify={notify} />} />
        <Route path="/car/:id" element={<CarDetail />} />
        <Route path="/all-booked" element={<AllBooked notify={notify} />} />
        <Route
          path="/see-all-booked"
          element={<SeeBookedVehicle notify={notify} />}
        />
        <Route path="/logout" element={<Logout notify={notify} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  } else {
    // If token doesn't exist, user is not authenticated
    routes = (
      <Routes>
        <Route path="/" element={<Home notify={notify} />} />
        <Route path="/car/:id" element={<CarDetail />} />
        <Route path="/signin" element={<Auth notify={notify} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <div>
      <Header notify={notify} />
      <ToastContainer />
      
      {routes}
      <Footer />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
