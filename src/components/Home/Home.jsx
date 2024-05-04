import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchAllVehicle } from "../../redux/actions";
import Loading from "../Loading/Loading";
import Car from "../Store/Car";
import AllCategory from "../Category/AllCategory";

const mapStateToProps = (state) => ({
  token: state.token,
  user_type: state.user_type,
  all_cars: state.all_cars,
  isLoading: state.isLoading,
});

const mapDispatchToProps = (dispatch) => ({
  fetchAllVehicle: () => dispatch(fetchAllVehicle()),
});

const Home = ({ fetchAllVehicle, all_cars, isLoading }) => {
  const [filteredCars, setFilteredCars] = useState([]);

  useEffect(() => {
    fetchAllVehicle();
  }, [fetchAllVehicle]);

  useEffect(() => {
    setFilteredCars(all_cars);
  }, [all_cars]);
  
  const handleCategorySelect = (id) => {
    let filtered = null


    if (id===0) {
    filtered = all_cars  
    }
    else{
    filtered = all_cars.filter((car) => car.category === id);
    }
    setFilteredCars(filtered);
  };

  let all_car_show = null;
  if (isLoading) {
    all_car_show = <Loading />;
  } else {
    all_car_show = filteredCars.map((item) => <Car key={item.id} car={item} />);
  }

  return (
    <div className="container">
      <AllCategory onSelectCategory={handleCategorySelect} />
      <div className="row mb-3">
      {all_car_show}
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
