// import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
// import { baseUrl } from "../../redux/baseUrls";
import { createVehicle, fetchAllCategory } from "../../redux/actions";


const mapStateToProps = (state) => ({
  token: state.token,
  userId: state.userId,
  categories: state.all_category,
});

const mapDispatchToProps = (dispatch) => ({
  fetchAllCategory: () => dispatch(fetchAllCategory()),
  createVehicle: (vehicleData, token) => dispatch(createVehicle(vehicleData, token)),
});

const VehicleForm = ({
  token,
  toggle,
  userId,
  categories,
  fetchAllCategory,
  createVehicle,
  mode

}) => {
  const [allCategoried, setAllCategoried] = useState([]);

  useEffect(() => {
    fetchAllCategory();
  }, [fetchAllCategory]);

  
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year:  "" ,
    price_per_day:  "" ,
    image: null,
    description:  "" ,
    category:  "",
  });
useEffect(() => {
  setAllCategoried(categories);
}, [categories]);
// console.log(categories);

// console.log(vehicle);

  // console.log(token);

  const handleChange = (e) => {
    
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  // console.log(formData);
  try {
    const vehicleData = {
      make: formData.make,
      model: formData.model,
      year: formData.year,
      price_per_day: formData.price_per_day,
      description: formData.description,
      owner: localStorage.getItem("userId"),
      category: formData.category,
      image:formData.image
    };

    // Check if category is not empty and include it in vehicleData
    if (formData.category !== "") {
      vehicleData.category = formData.category;
    }
    // console.log(vehicleData);


    
    createVehicle(vehicleData, token);
    toggle();
    
    //     const config = {
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //         Authorization: `Bearer ${localStorage.getItem("token")}`,
    //       },
    //     };
    // axios
    //   .post(baseUrl + "api/vehicle/", vehicleData, config)
    //   .then((response) => {
    //     console.log(response.data);
    //      toggle();
    //   })
    //   .catch((error) => {
    //     console.log(error.message);
    //   });

    setFormData({
      make: "",
      model: "",
      year: "",
      price_per_day: "",
      image: null,
      description: "",
      category: "",
    });
  } catch (error) {
    console.error("Error creating vehicle:", error);
  }
  };



  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="category">Category</Label>
          <select
            className="form-select"
            required={true}
            name="category"
            id="category"
            value={formData.category}
            onChange={handleChange}
          >
            {/* Default option */}
            <option value="">Select a category</option>

            {/* Mapping categories */}
            {allCategoried.map((category, index) => (
              <option
                key={category.id}
                value={category.id}
                selected={index === 0} // Select first category by default
              >
                {category.name}
              </option>
            ))}
          </select>
        </FormGroup>
        <FormGroup>
          <Label for="make">Make</Label>
          <Input
            type="text"
            name="make"
            id="make"
            value={formData.make}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="model">Model</Label>
          <Input
            type="text"
            name="model"
            id="model"
            value={formData.model}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="year">Year</Label>
          <Input
            type="date"
            name="year"
            id="year"
            value={formData.year}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="price_per_day">Price per Day</Label>
          <Input
            type="number"
            name="price_per_day"
            id="price_per_day"
            value={formData.price_per_day}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="image">Image</Label>
          <Input
            type="file"
            name="image"
            id="image"
            onChange={handleFileChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="description">Description</Label>
          <Input
            type="textarea"
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
          />
        </FormGroup>
        <Button color="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(VehicleForm);
