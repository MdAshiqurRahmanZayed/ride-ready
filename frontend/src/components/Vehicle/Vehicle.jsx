import React, { useState } from "react";
import { Card, CardBody, CardTitle, CardText } from "reactstrap";

import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import VehicleFormUpdate from "./VehicleFormUpdate";
import DeleteVehicle from "./DeleteVehicle";


const Vehicle = ({ vehicle, notify }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenUpdate, setisModalOpenUpdate] = useState(false);

  const openModalUpdate = () => {
    setisModalOpenUpdate(true);
  };

  const closeModalDelete = () => {
    setisModalOpenUpdate(false);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  // console.log(vehicle);

  return (
    <div>
      <Card key={vehicle.id} className="mb-3">
        <CardBody>
          <div className="row">
            <div className="col-md-8">
              <img src={vehicle.image} alt="" width="600px" />
              <CardTitle tag="h5">
                Model: <b>{vehicle.model}</b> <br />
                Make By: <b>{`${vehicle.make}`}</b>
              </CardTitle>
              <CardText>
                <strong>Year:</strong> {vehicle.year}
              </CardText>
              <CardText>
                <strong>Price per Day:</strong> ${vehicle.price_per_day}
              </CardText>
            </div>
            <div className="col-md-4">
              <Button color="primary me-2" onClick={openModalUpdate}>
                Update Vehicle
              </Button>

              <Modal isOpen={isModalOpenUpdate} toggle={closeModalDelete}>
                <ModalHeader toggle={closeModalDelete}>
                  Update Vehicle
                </ModalHeader>
                <ModalBody>
                  <VehicleFormUpdate
                    notify={notify}
                    toggle={closeModalDelete}
                    vehicle={vehicle}
                  />
                </ModalBody>
              </Modal>

              <Button color="danger my-2" onClick={openModal}>
                Delete Vehicle
              </Button>

              <Modal isOpen={isModalOpen} toggle={closeModal}>
                <ModalHeader toggle={closeModal}>Delete Vehicle</ModalHeader>
                <ModalBody>
                  <DeleteVehicle
                    notify={notify}
                    vehicle={vehicle}
                    toggle={closeModal}
                  />
                </ModalBody>
              </Modal>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Vehicle;
