import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,

} from "reactstrap";
import VehicleForm from "./VehicleForm";
import { fetchVehicle } from "../../redux/actions";
import Vehicle from "./Vehicle";
import Loading from "../Loading/Loading";

const mapStateToProps = (state) => ({
  token: state.token,
  vehicles: state.vehicles,
  isLoading: state.isLoading,
});

const mapDispatchToProps = (dispatch) => ({
  fetchVehicle: (token) => dispatch(fetchVehicle(token)),
});

const Vehicles = ({ token, vehicles, fetchVehicle, isLoading, notify }) => {
  const [modal, setModal] = useState(false);
  const [fetchedVehicles, setFetchedVehicles] = useState([]);
  // console.log(vehicles);

  useEffect(() => {
    fetchVehicle(token);
  }, [fetchVehicle, token]);

  useEffect(() => {
    setFetchedVehicles(vehicles);
  }, [vehicles]);

  const toggleModal = () => {
    setModal(!modal);
  };

  let vehicle_show = null;
  if (isLoading) {
    vehicle_show = <Loading />;
  } else {
    vehicle_show = fetchedVehicles.map((vehicle) => (
      <div className="" key={vehicle.id}>
        <Vehicle notify={notify} vehicle={vehicle} />
      </div>
    ));
  }
  return (
    <div className="container">
      <h3>My own Vehicle:</h3>
      <Button color="primary" onClick={toggleModal}>
        Add Vehicle
      </Button>
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Add Vehicle</ModalHeader>
        <ModalBody>
          <VehicleForm notify={notify} toggle={toggleModal} />
        </ModalBody>
      </Modal>

      <div className="mt-4">{vehicle_show}</div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Vehicles);
