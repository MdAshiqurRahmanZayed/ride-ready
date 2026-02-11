import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../redux/baseUrls";
import Loading from "../Loading/Loading";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import BookingForm from "../Book/BookingForm";
import { connect, useSelector } from "react-redux";

const mapStateToProps = (state) => ({
  user_type: state.user_type,
  token: state.token,
  userId: state.userId,
});


const CarDetail = ({ user_type, token }) => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const url = baseUrl + "api/car/" + id;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userId = useSelector((state) => state.userId);

  // console.log(userId);
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(url);
        // console.log(response.data);
        setCar(response.data);
        setLoading(false);
        //    console.log(response.data);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchCar();
  }, [url]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  let context = null;
  if (token ) {
    if (car) {
      if (user_type === "car_owner") {
        context = <p>Please log in as client for booking a car.</p>;
      } else if (car.check_booked === false) {
        context = (
          <Button color="primary my-2" onClick={openModal}>
            Book car
          </Button>
        );
      } else if (car.check_booked === true) {
        context = <div className="text-info">Already Booked</div>;
      } else {
        context = <div className="text-success">You can book</div>;
      }
    }
  } else {
    context = <div>Please log in as client.</div>;
  }

  return (
    <div className="container">
      {loading ? (
        <Loading />
      ) : car ? (
        <div className="car-details">
          <div className="row">
            <div className="col-md-9">
              <h2>
                Model: <b>{car.model}</b> <br />
                By: <b> {car.make}</b>
                <br />
                Year: <b> ({car.year})</b>
                <br />
              </h2>
            </div>
            <div className="col-md-3">
              {context}
              <Modal isOpen={isModalOpen} toggle={closeModal}>
                <ModalHeader toggle={closeModal}>Book car</ModalHeader>
                <ModalBody>
                  <BookingForm car={car} toggle={closeModal} />
                </ModalBody>
              </Modal>
            </div>
          </div>
          <h3>Category:{car.category.name}</h3>
          <p>
            Price per Day: $ <b> {car.price_per_day}</b>
          </p>
          <img
            src={car.image}
            height="500px"
            alt={`${car.make} ${car.model}`}
          />
          <p>Description: {car.description}</p>
        </div>
      ) : (
        <div>Error: Car not found</div>
      )}
    </div>
  );
};

export default connect(mapStateToProps)(CarDetail);
