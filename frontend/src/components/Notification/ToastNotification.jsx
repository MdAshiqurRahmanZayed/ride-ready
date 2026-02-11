import React from "react";
import { ToastContainer,toast } from "react-toastify";
import { notificationTime } from "../../redux/baseUrls";


const ToastNotification = ({ message, type }) => {
  console.log('====================================');
  console.log(message);
  console.log('====================================');
  switch (type) {
    case 'success':
      toast(message, notificationTime);
      break;
  
    default:
      break;
  }
  
  // const toastClassName = `bg-${type}`;


  return (
    <div className="p-3 my-2 rounded">
      <ToastContainer />
    </div>
  );
};

export default ToastNotification;
