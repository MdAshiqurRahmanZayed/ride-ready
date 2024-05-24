import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authActionCreators";

const Logout = ({ notify }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    if (!notified) {
      dispatch(logout());
      notify("Logout Successfully", "info");
      setNotified(true);
      navigate("/");
    }
  }, [dispatch, navigate, notify, notified]);

  return <div></div>;
};

export default Logout;
