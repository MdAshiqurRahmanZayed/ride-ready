import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { createCategory, updateCategory } from "../../redux/actions";


const mapStateToProps = (state) => ({
  token: state.token,
  userId: state.userId,
  successMsg: state.successMsg,
});

const mapDispatchToProps = (dispatch) => ({
  createCategory: (categoryName, userId, token) =>
    dispatch(createCategory(categoryName, userId, token)),
  updateCategory: (categoryName, userId, token, id) =>
    dispatch(updateCategory(categoryName, userId, token, id)),
});

const CategoryForm = ({
  token,
  userId,
  createCategory,
  updateCategory,
  closeModal,
  mode,
  category,
  notify,
}) => {
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (mode === "update") {
      setCategoryName(category.name);
    }
  }, [mode, category]);

  const handleChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "update") {
      try {
        await updateCategory(categoryName, userId, token, category.id);
        setCategoryName("");
        closeModal();
        notify("Category updated successfully", "success");
      } catch (error) {
        closeModal();
        notify("Category does not updated", "error");
        console.error("Error updating category:", error);
      }
    } else {
      try {
        await createCategory(categoryName, userId, token);
        setCategoryName("");
        notify("Category created successfully", "success");
        closeModal();
      } catch (error) {
        notify("Sorry there are error", "error");
        closeModal();
        console.error("Error creating category:", error);
      }
    }
  };


  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="categoryName">Category Name</Label>
          <Input
            type="text"
            name="categoryName"
            id="categoryName"
            placeholder="Enter category name"
            value={categoryName}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <Button color="primary" type="submit">
          Submit
        </Button>
      </Form>
      
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryForm);
