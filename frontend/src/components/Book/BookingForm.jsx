import React, { useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { baseUrl } from "../../redux/baseUrls";
import { useNavigate } from "react-router-dom";


const mapStateToProps = (state) => ({
  user_type: state.user_type,
  token: state.token,
  userId: state.userId,
});


const BookingForm = ({ toggle,token,userId,user_type,car  }) => {
  const [responseUrl, setResponseUrl] = useState("");

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    client: userId,
    vehicle: car.id,
    start_date: "",
    end_date: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

 const handleSubmit = async (e) => {
   e.preventDefault();

   try {
    //  let url = baseUrl + "api/booking/";
     let url = baseUrl +"api"+"/"+ "booking/"+car.id+"/payment/";
     console.log(url);
     const config = {
       headers: {
         "Content-Type": "application/json", 
         Authorization: `Bearer ${token}`,
       },
     };
    //  console.log(config);
     axios.post(url, formData,config)
     .then(response=>setResponseUrl(response.data))
     .catch(error=>console.log(error));
    //  console.log(responseUrl);
    //  navigate(responseUrl["GatewayPageURL"]);
     toggle();
   } catch (error) {
     console.error("Error submitting booking:", error);
   }
 };

 if (responseUrl) {
  window.location.href = responseUrl['GatewayPageURL'];
 }

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="start_date">Start Date:</label>
        <input
          className="form-control"
          type="date"
          id="start_date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="end_date">End Date:</label>
        <input
          className="form-control"
          type="date"
          id="end_date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          min={today}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Phone:</label>
        <input
          className="form-control"
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary my-3">
        Book Now
      </button>
    </form>
  );
};

export default connect(mapStateToProps)(BookingForm);
