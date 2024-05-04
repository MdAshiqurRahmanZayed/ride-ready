import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchAllSeeBookedVehicle } from "../../redux/actions";
import Loading from "../Loading/Loading";

const mapStateToProps = (state) => ({
  isLoading: state.isLoading,
  see_all_booked_vehicle: state.see_all_booked_vehicle,
  successMsg: state.successMsg,
  errorMsg: state.errorMsg,
  token: state.token,
});

const mapDispatchToProps = (dispatch) => ({
  fetchAllSeeBookedVehicle: (token) =>
    dispatch(fetchAllSeeBookedVehicle(token)),
});

const SeeBookedVehicle = ({
  fetchAllSeeBookedVehicle,
  token,
  see_all_booked_vehicle,
  isLoading,
}) => {
  const [seeAllBooked, setSeeAllBooked] = useState([]);

  useEffect(() => {
    fetchAllSeeBookedVehicle(token);
  }, [fetchAllSeeBookedVehicle, token]);

  useEffect(() => {
    setSeeAllBooked(see_all_booked_vehicle);
  }, [see_all_booked_vehicle]);
  // console.log(see_all_booked_vehicle);
  let see_all_booked = null;
  if (isLoading) {
    see_all_booked = <Loading />;
  } else {
see_all_booked = seeAllBooked.map((data) => {
  return (
    <div key={data.uuid} className="card mb-2">
      <img src={data.vehicle.image} alt="Vehicle" height="400px" />
      <div className="card-body">
        <h5 className="card-title">
          {data.vehicle.make} {data.vehicle.model}
        </h5>
        <p>Start Date: {data.start_date}</p>
        <p>End Date: {data.end_date}</p>
        <p>Client Email: {data.client.email}</p>
        <p>Client Phone: {data.phone}</p>
        <p>ID: {data.uuid}</p>
      </div>
    </div>
  );
});

  }

  return <div className="container">
    <br />
    {see_all_booked}
    </div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(SeeBookedVehicle);
