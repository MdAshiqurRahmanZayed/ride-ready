import React from "react";
import { connect } from "react-redux";
import { deleteCategory } from "../../redux/actions";


const mapStateToProps = (state) => ({
  token: state.token,
});


const mapDispatchToProps = (dispatch) => ({
  deleteCategory: (token, id) => dispatch(deleteCategory(token, id)),
});

const DeleteCategory = ({ category, deleteCategory, toggle,token }) => {
  const handleDelete = () => {
    deleteCategory(token, category.id);
    toggle(); 
  };

  return (
    <div>
      <p>
        Are you sure you want to delete <b> {category.name}</b>?
      </p>
      <button className="btn btn-danger me-1" onClick={handleDelete}>
        Delete
      </button>
      <button onClick={toggle} className="btn btn-primary">
        Cancel
      </button>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteCategory);
