import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchAllCategory, updateVehicle } from "../../redux/actions";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

const mapStateToProps = (state) => ({
  all_category: state.all_category,
  token: state.token,
});

const mapDispatchToProps = (dispatch) => ({
  fetchAllCategory: () => dispatch(fetchAllCategory()),
  updateVehicle: (vehicleData, token, id) =>
    dispatch(updateVehicle(vehicleData, token, id)),
});

const VehicleFormUpdate = ({
  fetchAllCategory,
  token,
  toggle,
  updateVehicle,
  all_category,
  vehicle,
}) => {
  const [allCategoried, setAllCategoried] = useState([]);
  const [imageForm, setImageForm] = useState(null);


  const [formData, setFormData] = useState({
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    price_per_day: vehicle.price_per_day,
    image: vehicle.image,
    description: vehicle.description,
    category: vehicle.category,
  });
  useEffect(() => {
    setAllCategoried(all_category);
  }, [all_category]);
  // console.log(all_category);

  // console.log(vehicle);

  // console.log(token);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // const handleFileChange = (e) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.files[0],
  //   });
  // };

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
        // image: formData?.image,
      };
      if (imageForm!==null) {
        vehicleData.image = imageForm;
        
      }

      if (formData.category !== "") {
        vehicleData.category = formData.category;
      }
      // console.log(vehicleData);

      updateVehicle(vehicleData, token,vehicle.id);
      toggle();


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
            // onChange={handleFileChange}
            onChange={(e) => {
              setImageForm(e.target.files[0]);
            }}
          />
          See Image:
          <a href={formData.image} target="_blank" rel="noopener noreferrer">
            <img src={formData.image} alt="" height="100px" className="my-2" />
          </a>
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

export default connect(mapStateToProps, mapDispatchToProps)(VehicleFormUpdate);
