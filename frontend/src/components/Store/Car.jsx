import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom"; 
import { Button } from "reactstrap";

const Car = ({ car }) => {
  const userId = useSelector((state) => state.userId);
  const user_type = useSelector((state) => state.user_type);

  let context = null;
  if (car) {
    if (car.check_booked === false) {
      context = <div className="text-success">You can book</div>;
    }  else {
      context = <div className="text-info">Already Booked</div>;
    }
  }

  return (
    <div className="col-md-3 my-2 ">
      <Link to={`/car/${car.id}`} className="text-decoration-none text-dark">
        <div className="card">
          <img src={car.image} className="card-img-top" alt={car.model} />
          <div className="card-body">
            <h5 className="card-title">{car.model}</h5>
            <p className="card-text">Make: {car.make}</p>
            <p className="card-text">Year: {car.year}</p>
            <h6>Category:
              <b>
            {car.category.name}
              </b>
            </h6>
            {context}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Car;
