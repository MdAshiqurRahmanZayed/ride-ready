import React from "react";

import { Card, CardBody, CardTitle } from "reactstrap";

const AllBookedSingle = ({ vehicle }) => {
  return (
    <Card >
      <img src={vehicle.vehicle.image} alt="" height="300px" width="100%" />
      <CardBody>
        <CardTitle>
          <h4>

          Make: {vehicle.vehicle.make} <br />
          Model: {vehicle.vehicle.model} <br />
          Year: {vehicle.vehicle.year} <br />
          </h4>
        </CardTitle>
        Start Date: {vehicle.start_date} <br />
        End Date: {vehicle.end_date} <br />
        Total Cost: ${vehicle.total_cost} <br />
        ID: <b>{vehicle.uuid}</b> <br />
        Transtion Id: <b>{vehicle.paymentId}</b> <br />
        Order Id: <b>{vehicle.orderId}</b> <br />
      </CardBody>
    </Card>
  );
};

export default AllBookedSingle;
