import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../redux/baseUrls";
import Loading from "../Loading/Loading";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import BookingForm from "../Book/BookingForm";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({
  user_type: state.user_type,
  token: state.token,
  userId: state.userId,
});


const CarDetail = ({ user_type }) => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const url = baseUrl + "api/car/" + id;
  const [isModalOpen, setIsModalOpen] = useState(false);

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
              
              {user_type === "client" && car.check_booked === false ? (
                <Button color="primary my-2" onClick={openModal}>
                  Book car
                </Button>
              ) : (
                <div className="">
                  login as client for booking car
                </div>
              )}
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
