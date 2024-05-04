import React, { useEffect } from "react";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const mapStateToProps = (state) => ({
  successMsg: state.successMsg,
  errorMsg: state.errorMsg,
});


const Notification = ({ successMsg, errorMsg }) => {
  useEffect(() => {
    if (successMsg) {
      toast.success(successMsg, { autoClose: 5000 });
    }
    if (errorMsg) {
      toast.error(errorMsg, { autoClose: 5000 });
    }
  }, [successMsg, errorMsg]);

  return <div>
      <ToastContainer />
  </div>;
};

export default connect(mapStateToProps)(Notification);
