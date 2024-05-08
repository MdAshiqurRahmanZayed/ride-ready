import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";

import { logout } from "../../redux/authActionCreators";
// import toast, { Toaster } from "react-hot-toast";
// import { notificationTime } from "../../redux/baseUrls";

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
    
  };
};

class Logout extends Component {
  componentDidMount() {
    this.props.logout();
    this.props.notify("Logout Successfully",'success');
    // console.log(this.props.notify);
  }
  
  render() {
    return (
      <div className="">
        <Navigate to="/" />
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(Logout);
