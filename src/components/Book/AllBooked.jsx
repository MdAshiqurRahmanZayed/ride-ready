import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchAllBookedVehicle } from "../../redux/actions";
import Loading from "../Loading/Loading";
import AllBookedSingle from "./AllBookedSingle";

const mapStateToProps = (state) => ({
  isLoading: state.isLoading,
  all_booked_vehicle: state.all_booked_vehicle,
  successMsg: state.successMsg,
  errorMsg: state.errorMsg,
  token: state.token,
});

const mapDispatchToProps = (dispatch) => ({
  fetchAllBookedVehicle: (token) => dispatch(fetchAllBookedVehicle(token)),
});

const AllBooked = ({
  fetchAllBookedVehicle,
  all_booked_vehicle,
  isLoading,
  token,
}) => {
  const [allBooked, setAllBooked] = useState(null);

  useEffect(() => {
    fetchAllBookedVehicle(token);
  }, [fetchAllBookedVehicle, token]);

  useEffect(() => {
    setAllBooked(all_booked_vehicle);
  }, [all_booked_vehicle]);
  // console.log(allBooked);

  return (
    <div className="container">
      <h2>All Booked Vehicles</h2>
      {isLoading ? (
        <Loading />
      ) : allBooked && allBooked.length > 0 ? (
        <div className="row">
          {allBooked.map((vehicle) => (
            <div key={vehicle.id} className="mb-2">
              <AllBookedSingle vehicle={vehicle}/>
            </div>
          ))}
        </div>
      ) : (
        <div>No booked vehicles found.</div>
      )}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(AllBooked);
