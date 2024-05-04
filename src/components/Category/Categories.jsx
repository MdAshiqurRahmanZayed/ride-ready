import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import Loading from "../Loading/Loading";
import Category from "./Category";
import "react-toastify/dist/ReactToastify.css";
import CategoryForm from "./CategoryForm";
import { fetchCategory } from "../../redux/actions";

const mapStateToProps = (state) => ({
  isLoading: state.isLoading,
  category: state.category,
  successMsg: state.successMsg,
  errorMsg: state.errorMsg,
  token: state.token,
});

const mapDispatchToProps = (dispatch) => ({
  fetchCategory: (token) => dispatch(fetchCategory(token)),
});

const Categories = ({
  category,
  isLoading,
  fetchCategory,
  successMsg,
  errorMsg,
  token,
}) => {
  const [categoryData, setCategoryData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCategory(token);
  }, [fetchCategory, successMsg, errorMsg, token]);
  // console.log(successMsg);
  useEffect(() => {
    setCategoryData(category);
  }, [category]);

  let category_show = null;
  if (isLoading) {
    category_show = <Loading />;
  } else {
    category_show = categoryData.map((cat) => <Category category={cat} />);
  }

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container">
      <h3>My own Category:</h3>
      
      {category_show}
      <Button color="primary my-2" onClick={openModal}>
        Add New Category
      </Button>

      <Modal isOpen={isModalOpen} toggle={closeModal}>
        <ModalHeader toggle={closeModal}>Add New Category</ModalHeader>
        <ModalBody>
          <CategoryForm closeModal={closeModal} />
        </ModalBody>
      </Modal>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
