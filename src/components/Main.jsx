import React from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { Route, Routes, Navigate } from "react-router-dom";
import Auth from "./Auth/Auth";
import Logout from "./Auth/Logout";
import { connect } from "react-redux";
import Home from "./Home/Home";
import { authCheck } from "../redux/authActionCreators";
import "react-toastify/dist/ReactToastify.css";
import Categories from "./Category/Categories";
import Vehicles from "./Vehicle/Vehicles";
import CarDetail from "./Store/CarDetail";
import AllBooked from "./Book/AllBooked";
import SeeBookedVehicle from "./Vehicle/SeeBookedVehicle";

const mapStateToProps = (state) => ({
  token: state.token,
  successMsg: state.successMsg,
});

const mapDispatchToProps = (dispatch) => ({
  authCheck: () => dispatch(authCheck()),
});

const Main = ({ token, authCheck, successMsg }) => {
  let routes = null;
  if (token) {
    // If token exists, user is authenticated
    routes = (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category" element={<Categories />} />
        <Route path="/vehicle" element={<Vehicles />} />
        <Route path="/car/:id" element={<CarDetail />} />
        <Route path="/all-booked" element={<AllBooked />} />
        <Route path="/see-all-booked" element={<SeeBookedVehicle/>} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  } else {
    // If token doesn't exist, user is not authenticated
    routes = (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/car/:id" element={<CarDetail />} />
        <Route path="/signin" element={<Auth />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <div>
      <Header />
      
      {routes}
      <Footer />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
