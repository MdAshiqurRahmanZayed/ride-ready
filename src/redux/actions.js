import axios from 'axios';

import * as actionTypes from './actionTypes';
import {
     baseUrl
} from './baseUrls';



export const fetchAllCategoryRequest = () => ({
     type: actionTypes.FETCH_ALL_CATEGORY_REQUEST
})


export const fetchAllCategorySuccess = (categories) => ({
     type: actionTypes.FETCH_ALL_CATEGORY_SUCCESS,
     payload: categories
})

export const fetchAllCategoryFailure = (error) => ({
     type: actionTypes.FETCH_ALL_CATEGORY_FAILURE,
     payload: error
})


export const fetchAllCategory = () => {
     return async (dispatch) => {
          dispatch(fetchAllCategoryRequest())
          try {

               const response = await axios.get(baseUrl + 'api/all-categories/');
               // console.log(response.data);
               // console.log(response.data);
               dispatch(fetchAllCategorySuccess(response.data));

          } catch (error) {
               dispatch(fetchAllCategoryFailure(error));
          }
     }
}

export const fetchCategoryRequest = () => ({
     type: actionTypes.FETCH_CATEGORY_REQUEST
})


export const fetchCategorySuccess = (category) => ({
     type: actionTypes.FETCH_CATEGORY_SUCCESS,
     payload: category
})

export const fetchCategoryFailure = (error) => ({
     type: actionTypes.FETCH_CATEGORY_FAILURE,
     payload: error
})


export const fetchCategory = (token) => {
     return async (dispatch) => {
          dispatch(fetchCategoryRequest())
          try {
               const config = {
                    headers: {
                         Authorization: `Bearer ${token}`,
                    },
               };
               const response = await axios.get(baseUrl + 'api/category/', config);
               // console.log(response.data);
               dispatch(fetchCategorySuccess(response.data));

          } catch (error) {
               dispatch(fetchCategoryFailure(error));
          }
     }
}



export const createCategorySuccess = (newData, categoryList) => ({
     type: actionTypes.CREATE_CATEGORY_SUCCESS,
     payload: {
          newData,
          categoryList
     }
});

export const createCategoryFailure = (errorMsg) => ({
     type: actionTypes.CREATE_CATEGORY_FAILURE,
     payload: errorMsg
});


export const createCategory = (categoryName, userId, token) => {
     return async (dispatch) => {
          const data = {
               name: categoryName,
               user: userId,
          };

          const config = {
               headers: {
                    Authorization: `Bearer ${token}`,
               },
          };

          try {
               const response = await axios.post(baseUrl + 'api/category/', data, config);
               const fetchResponse = await axios.get(baseUrl + 'api/category/', config);

               dispatch(createCategorySuccess(response.data, fetchResponse.data));
          } catch (error) {
               // console.log(error.response.data.name[0]);
               dispatch(createCategoryFailure(error.response.data.name[0]));
          }
     };
};

export const updateCategory = (categoryName, userId, token, id) => {
     return async (dispatch) => {
          const data = {
               name: categoryName,
               user: userId,
          };

          const config = {
               headers: {
                    Authorization: `Bearer ${token}`,
               },
          };

          try {
               const response = await axios.put(baseUrl + 'api/category/' + id + '/', data, config);
               const fetchResponse = await axios.get(baseUrl + 'api/category/', config);
               dispatch(createCategorySuccess(response.data, fetchResponse.data));
          } catch (error) {
               // console.log(error.response.data.name[0]);
               dispatch(createCategoryFailure(error.response.data.name[0]));
          }
     };
};



export const deleteCategory = (token, id) => {
     return async (dispatch) => {
          const config = {
               headers: {
                    Authorization: `Bearer ${token}`,
               },
          };

          try {
               const response = await axios.delete(baseUrl + 'api/category/' + id + '/', config);
               const fetchResponse = await axios.get(baseUrl + 'api/category/', config);
               dispatch(createCategorySuccess(response.data, fetchResponse.data));
          } catch (error) {
               // console.log(error.response.data.name[0]);
               dispatch(createCategoryFailure(error.response.data.name[0]));
          }
     };
};





export const fetchVehicleRequest = () => ({
     type: actionTypes.FETCH_VEHICLE_REQUEST
})


export const fetchVehicleSuccess = (category) => ({
     type: actionTypes.FETCH_VEHICLE_SUCCESS,
     payload: category
})

export const fetchVehicleFailure = (error) => ({
     type: actionTypes.FETCH_VEHICLE_FAILURE,
     payload: error
})


export const fetchVehicle = (token) => {
     return async (dispatch) => {
          dispatch(fetchVehicleRequest())
          try {
               const config = {
                    headers: {
                         Authorization: `Bearer ${token}`,
                    },
               };
               const url = `${baseUrl}api/vehicle/`
               const response = await axios.get(url, config);
               // console.log(response.data);
               // console.log(response.data);
               dispatch(fetchVehicleSuccess(response.data));

          } catch (error) {
               dispatch(fetchVehicleFailure(error));
          }
     }
}


export const createVehicleSuccess = (successMsg, data) => ({
     type: actionTypes.CREATE_VEHICLE_SUCCESS,
     payload: {
          successMsg,
          data,
     }
});

export const createVehicleFailure = (errorMsg) => ({
     type: actionTypes.CREATE_VEHICLE_FAILURE,
     payload: errorMsg
});

export const createVehicle = (vehicleData, token) => {
     return async (dispatch) => {
          try {
               const config = {
                    headers: {
                         "Content-Type": "multipart/form-data",
                         Authorization: `Bearer ${token}`,
                    },
               };
               // console.log(vehicleData, token);
               const response = await axios.post(`${baseUrl}api/vehicle/`, vehicleData, config);
               const fetchResponse = await axios.get(`${baseUrl}api/vehicle/`, config);
               // console.log(response.data);
               dispatch(createVehicleSuccess(response.data.message, fetchResponse.data));
          } catch (error) {
               dispatch(createVehicleFailure(error.response.data.message));
          }
     };
};


export const updateVehicle = (vehicleData, token, id) => {
     return async (dispatch) => {
          try {
               const config = {
                    headers: {
                         'Content-Type': 'multipart/form-data',
                         Authorization: `Bearer ${token}`
                    }
               };
               const response = await axios.put(`${baseUrl}api/vehicle/${id}/`, vehicleData, config);
               const fetchResponse = await axios.get(`${baseUrl}api/vehicle/`, config);
               // console.log(response.data);
               dispatch(createVehicleSuccess(response.data.message, fetchResponse.data));

          } catch (error) {
               dispatch(createVehicleFailure(error.response.data.message));
          }
     };
};

export const deleteVehicle = (id, token) => {
     return async (dispatch) => {
          try {
               const config = {
                    headers: {
                         'Content-Type': 'multipart/form-data',
                         Authorization: `Bearer ${token}`
                    }
               };
               const response = await axios.delete(`${baseUrl}api/vehicle/${id}/`, config);
               // console.log(response.data);
               const fetchResponse = await axios.get(`${baseUrl}api/vehicle/`, config);
               // console.log(response.data);
               dispatch(createVehicleSuccess(response.data, fetchResponse.data));
          } catch (error) {
               // console.log(error.response.data);
               dispatch(createVehicleFailure(error.response.data.message));
          }
     };
};







export const fetchAllVehicleRequest = () => ({
     type: actionTypes.FETCH_ALL_VEHICLE_REQUEST
})


export const fetchAllVehicleSuccess = (vehicles) => ({
     type: actionTypes.FETCH_ALL_VEHICLE_SUCCESS,
     payload: vehicles
})

export const fetchAllVehicleFailure = (error) => ({
     type: actionTypes.FETCH_ALL_VEHICLE_FAILURE,
     payload: error
})


export const fetchAllVehicle = () => {
     return async (dispatch) => {
          dispatch(fetchAllVehicleRequest())
          try {

               const response = await axios.get(baseUrl + 'api/all-cars/');
               // console.log(response.data);
               dispatch(fetchAllVehicleSuccess(response.data));

          } catch (error) {
               dispatch(fetchAllVehicleFailure(error));
          }
     }
}









// fetch all booked

export const fetchAllBookedVehicleRequest = () => ({
     type: actionTypes.FETCH_ALL_BOOKED_VEHICLE_REQUEST
})


export const fetchAllBookedVehicleSuccess = (all_booked_vehicle) => ({
     type: actionTypes.FETCH_ALL_BOOKED_VEHICLE_SUCCESS,
     payload: all_booked_vehicle
})

export const fetchAllBookedVehicleFailure = (error) => ({
     type: actionTypes.FETCH_ALL_BOOKED_VEHICLE_FAILURE,
     payload: error
})


export const fetchAllBookedVehicle = (token) => {
     return async (dispatch) => {
          dispatch(fetchAllBookedVehicleRequest())
          try {
               const config = {
                    headers: {
                         Authorization: `Bearer ${token}`,
                    },
               };
               let url = baseUrl + "api/all-booked/";
               // console.log(url);
               // console.log(token)
               const response = await axios.get(url, config);
               // console.log(response.data);
               // console.log(response.data);
               dispatch(fetchAllBookedVehicleSuccess(response.data));

          } catch (error) {
               dispatch(fetchAllBookedVehicleFailure(error));
          }
     }
}




// fetch all see booked

export const fetchAllSeeBookedVehicleRequest = () => ({
     type: actionTypes.FETCH_ALL_SEE_VEHICLE_REQUEST
})


export const fetchAllSeeBookedVehicleSuccess = (all_booked_vehicle) => ({
     type: actionTypes.FETCH_ALL_SEE_VEHICLE_SUCCESS,
     payload: all_booked_vehicle
})

export const fetchAllSeeBookedVehicleFailure = (error) => ({
     type: actionTypes.FETCH_ALL_SEE_VEHICLE_FAILURE,
     payload: error
})


export const fetchAllSeeBookedVehicle = (token) => {
     return async (dispatch) => {
          dispatch(fetchAllSeeBookedVehicleRequest())
          try {
               const config = {
                    headers: {
                         Authorization: `Bearer ${token}`,
                    },
               };
               let url = baseUrl + "api/see-all-booked/";
               const response = await axios.get(url, config);
               dispatch(fetchAllSeeBookedVehicleSuccess(response.data));

          } catch (error) {
               dispatch(fetchAllSeeBookedVehicleFailure(error));
          }
     }
}
