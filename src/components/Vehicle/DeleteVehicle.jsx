import React from "react";
import { connect } from "react-redux";
import {deleteVehicle } from "../../redux/actions";


const mapStateToProps = (state) => ({
  token: state.token,
});


const mapDispatchToProps = (dispatch) => ({
  deleteVehicle: (id, token) => dispatch(deleteVehicle(id, token)),
});

const DeleteVehicle = ({ vehicle, toggle, token, deleteVehicle, notify }) => {
  const handleDelete = () => {
    deleteVehicle(vehicle.id, token);
    notify("Vehicle deleted successfully", "error");
    toggle();
  };

  return (
    <div>
      <p>Are you sure you want to delete ?</p>

      <button className="btn btn-danger me-1" onClick={handleDelete}>
        Delete
      </button>
      <button onClick={toggle} className="btn btn-primary">
        Cancel
      </button>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteVehicle);
