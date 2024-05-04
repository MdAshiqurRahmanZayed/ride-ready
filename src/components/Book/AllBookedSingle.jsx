import React from "react";

import { Card, CardBody, CardTitle } from "reactstrap";

const AllBookedSingle = ({ vehicle }) => {
  return (
    <Card className="">
      <img src={vehicle.vehicle.image} alt="" height="300px" width="100%" />
      <CardBody>
        <CardTitle>
          Make:{vehicle.vehicle.make} <br />
          Model:{vehicle.vehicle.model} <br />
          Year:{vehicle.vehicle.year} <br />
        </CardTitle>
        Start Date:{vehicle.start_date} <br />
        End Date:{vehicle.end_date} <br />
        Total Cost:${vehicle.total_cost} <br />
        ID: <b>{vehicle.uuid}</b>
      </CardBody>
    </Card>
  );
};

export default AllBookedSingle;
