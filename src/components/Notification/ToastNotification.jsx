import React from "react";
import { ToastContainer,toast } from "react-toastify";

const ToastNotification = ({ message, type }) => {
  switch (type) {
    case 'success':
      toast(message, 5000);
      break;
  
    default:
      break;
  }
  
  // const toastClassName = `bg-${type}`;
  console.log(message);

  return (
    <div className="p-3 my-2 rounded">
      <ToastContainer />
    </div>
  );
};

export default ToastNotification;
