import * as actionTypes from './actionTypes';


const initialState = {

     all_category:[],
     all_booked_vehicle: [],
     see_all_booked_vehicle:[],
     category:[],
     vehicles:[],
     all_cars:[],
     isLoading: false,


     authFailedMsg: null,
     successMsg:null,
     errorMsg:null,

     token: null,
     // expirationTime:0,
     user_type:"",
     userId: null,
     authLoading: false,
     error: null,
     lengthRoom: 0,
     lengthRoomBooked: 0,
     lengthRoomLeft: 0,
     bookedRooms:[]
};

const reducer = (state = initialState, action) => {
     switch (action.type) {
          case actionTypes.CREATE_CATEGORY_SUCCESS:
               return {
                    ...state,
                    isLoading: false,
                    successMsg: "Successfully category created.",
                    category: action.payload.categoryList,
                    errorMsg: null
               };
          case actionTypes.CREATE_CATEGORY_FAILURE:
               return {
                    ...state,
                    isLoading: false,
                    successMsg: null,
                    errorMsg: action.payload
               };

          // Fetch category
          case actionTypes.FETCH_ALL_CATEGORY_REQUEST:
               return {
                    ...state,
                    isLoading: true,
                    error: null
               }


          case actionTypes.FETCH_ALL_CATEGORY_SUCCESS:
               return {
                    ...state,
                    isLoading: false,
                    all_category: action.payload,
                    error: null,
               }

          case actionTypes.FETCH_ALL_CATEGORY_FAILURE:
               return {
                    ...state,
                    isLoading: false,
                    error: action.payload
               }



          // Fetch category
          case actionTypes.FETCH_CATEGORY_REQUEST:
               return {
                    ...state,
                    isLoading: true,
                    error: null
               }


          case actionTypes.FETCH_CATEGORY_SUCCESS:
               return {
                    ...state,
                    isLoading: false,
                    category: action.payload,
                    error: null,
               }

          case actionTypes.FETCH_CATEGORY_FAILURE:
               return {
                    ...state,
                    isLoading: false,
                    error: action.payload
               }

          // Fetch vehicle
          case actionTypes.FETCH_VEHICLE_REQUEST:
               return {
                    ...state,
                    isLoading: true,
                    error: null
               }


          case actionTypes.FETCH_VEHICLE_SUCCESS:
               return {
                    ...state,
                    isLoading: false,
                    vehicles: action.payload,
                    error: null,
               }

          case actionTypes.FETCH_VEHICLE_FAILURE:
               return {
                    ...state,
                    isLoading: false,
                    error: action.payload
               }

          //all vehicle
          case actionTypes.FETCH_ALL_VEHICLE_REQUEST:
               return {
                    ...state,
                    isLoading: true,
                    error: null
               }


          case actionTypes.FETCH_ALL_VEHICLE_SUCCESS:
               return {
                    ...state,
                    isLoading: false,
                    all_cars: action.payload,
                    error: null,
               }

          case actionTypes.FETCH_ALL_VEHICLE_FAILURE:
               return {
                    ...state,
                    isLoading: false,
                    error: action.payload
               }


          //all vehicle
          case actionTypes.FETCH_ALL_BOOKED_VEHICLE_REQUEST:
               return {
                    ...state,
                    isLoading: true,
                    error: null
               }


          case actionTypes.FETCH_ALL_BOOKED_VEHICLE_SUCCESS:
               return {
                    ...state,
                    isLoading: false,
                    all_booked_vehicle: action.payload,
                    error: null,
               }

          case actionTypes.FETCH_ALL_BOOKED_VEHICLE_FAILURE:
               return {
                    ...state,
                    isLoading: false,
                    error: action.payload
               }


          //see all vehicle
          case actionTypes.FETCH_ALL_SEE_VEHICLE_REQUEST:
               return {
                    ...state,
                    isLoading: true,
                    error: null
               }


          case actionTypes.FETCH_ALL_SEE_VEHICLE_SUCCESS:
               return {
                    ...state,
                    isLoading: false,
                    see_all_booked_vehicle: action.payload,
                    error: null,
               }

          case actionTypes.FETCH_ALL_SEE_VEHICLE_FAILURE:
               return {
                    ...state,
                    isLoading: false,
                    error: action.payload
               }


          // create Vehicle

          case actionTypes.CREATE_VEHICLE_SUCCESS:
               return {
                    ...state,
                    isLoading: false,
                    successMsg: "Successfully created.",
                    vehicles: action.payload.data,
                    errorMsg: null
               };
          case actionTypes.CREATE_VEHICLE_FAILURE:
               return {
                    ...state,
                    isLoading: false,
                    successMsg: null,
                    errorMsg: action.payload
               };

          
          //Auth Cases
          case actionTypes.AUTH_SUCCESS:
               return {
                    ...state,
                    token: action.payload.token,
                    userId: action.payload.userId,
                    user_type: action.payload.user_type,
                    successMsg: "Successfully Login",
                    // errorMsg: "There is no error",
               };


          case actionTypes.AUTH_LOGOUT:
               return {
                    ...state,
                    authFailedMsg: null,
                    token: null,
                    userId: null,
                    user_type:"",
                    successMsg:"Successfully Logout"
               }
          case actionTypes.AUTH_LOADING:
               return {
                    ...state,
                    authLoading: action.payload,
               }
          case actionTypes.AUTH_FAILED:
               return {
                    ...state,
                    authFailedMsg: action.payload,
               }

          default:
               return state;
     }
};

export default reducer;
