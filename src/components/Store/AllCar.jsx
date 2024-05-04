import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchAllVehicle } from "../../redux/actions";
import Loading from "../Loading/Loading";
import Car from "./Car";

const mapStateToProps = (state) => ({
  token: state.token,
  user_type: state.user_type,
  all_cars: state.all_cars,
  isLoading: state.isLoading,
});

const mapDispatchToProps = (dispatch) => ({
  fetchAllVehicle: () => dispatch(fetchAllVehicle()),
});

const AllCar = ({ fetchAllVehicle, all_cars, isLoading }) => {
  const [allCars, setallCars] = useState([]);

  useEffect(() => {
    fetchAllVehicle();
  }, [fetchAllVehicle]);

  useEffect(() => {
    setallCars(all_cars);
  }, [all_cars]);

  let all_car_show = null;
  if (isLoading) {
    all_car_show = <Loading />;
  } else {
    all_car_show = allCars.map((item) => (
      <div className="col-md-4" key={item.id}>
        <Car car={item} />
      </div>
    ));
  }

  return (
    <div className="">
      
      <div className="row">{all_car_show}</div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(AllCar);
