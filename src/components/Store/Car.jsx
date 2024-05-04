import React from "react";
import { Link } from "react-router-dom"; 

const Car = ({ car }) => {

  return (
    <div className="col-md-3 ">
      <Link to={`/car/${car.id}`} className="text-decoration-none text-dark">
        <div className="card">
          <img src={car.image} className="card-img-top" alt={car.model} />
          <div className="card-body">
            <h5 className="card-title">{car.model}</h5>
            <p className="card-text">Make: {car.make}</p>
            <p className="card-text">Year: {car.year}</p>
            
            {car.check_booked ? (
              <div className="text-warning">Already booked</div>
            ) : (
              <div className="text-success">You can book</div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Car;
