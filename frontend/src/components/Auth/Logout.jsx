import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authActionCreators";

const Logout = ({ notify }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    dispatch(logout());
    // notify("Logout Successfully", "info");
    navigate("/");
    
  }, [dispatch, navigate,notify]);

  return <div></div>;
};

export default Logout;
