import * as actionTypes from './actionTypes';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { baseUrl } from './baseUrls';



export const authSuccess = (token, userId, user_type) => {
     return {
          type: actionTypes.AUTH_SUCCESS,
          payload: {
               token: token,
               userId: userId,
               user_type: user_type,
          },
     };
};

export const authLoading = isLoading => {
     return {
          type: actionTypes.AUTH_LOADING,
          payload: isLoading,
     }
}


export const authFailedMsg = errorMsg => {
     return {
          type: actionTypes.AUTH_FAILED,
          payload: errorMsg,
     }
}


const saveTokenDataGetUserId = (access, user_type) => {
               const access_token = access
               const token = jwtDecode(access_token)
               // console.log(token);
               localStorage.setItem('token', access_token);
               localStorage.setItem('user_type', user_type);
               localStorage.setItem('userId', token.user_id);
               const expirationTime = new Date( token.exp * 1000);
               // console.log(expirationTime);
               localStorage.setItem('expirationTime', expirationTime);
               return token.user_id

}


export const auth = (email, password, passwordConfirm, user_type, mode) => dispatch => {
     dispatch(authLoading(true))
     const authData = {
          email: email,
          password: password,
          passwordConfirm: passwordConfirm,
          user_type: user_type,
          // returnSecureToken: true,
     }
// console.log(authData);
     let authUrl = null;
     if (mode === "Sign Up") {
          authUrl = baseUrl + "api/register/";
          console.log(authData);
          axios.post(authUrl , authData)
               
               .then(response => {
                    dispatch(authLoading(false))
                    if (mode === "Sign Up") {
                         // console.log('login',response.data);
                         
                         console.log(response.data);
                         const data = {
                              email:authData.email,
                              password:authData.password
                         }
                         return axios.post(baseUrl + "api/token/", data)
                         .then(response=>{
                              const access_token = response.data.access
                              const user_type = response.data.user_type
                              const user_id= saveTokenDataGetUserId(access_token, user_type);
                              dispatch(authSuccess(access_token, user_id, user_type));
                         })
                        
                    }
     
     
               })
               .catch(error => {
     
                    dispatch(authLoading(false));
                    const key = Object.keys(error.response.data)[0]
                    // console.log(Object.keys(error.response.data));
                    const errValue = error.response.data[key]
                    // console.log(errValue);
                    dispatch(authFailedMsg(`(${key}) ${errValue}`));
               }
               );
     } else {
          authUrl = baseUrl + "api/token/";
          const data = {
               email: authData.email,
               password: authData.password
          }
          axios.post(authUrl, data)
               .then(response => {
                    dispatch(authLoading(false))
                    if (mode !== "Sign Up") {
                         // console.log('login',response.data);
                         
                         const access_token = response.data.access
                         const user_type = response.data.user_type
                         const user_id = saveTokenDataGetUserId(access_token, user_type);
                         dispatch(authSuccess(access_token, user_id, user_type));
     
                    }
     
               })
               .catch(error => {
     
                    dispatch(authLoading(false));
                    dispatch(authFailedMsg(error.response.data.detail));
               }
               );
     }

}

export const logout = () => {
     localStorage.removeItem('token');
     localStorage.removeItem('expirationTime');
     localStorage.removeItem('userId');
     localStorage.removeItem('user_type');
     return {
          type: actionTypes.AUTH_LOGOUT,
     }
}



export const authCheck = () => dispatch => {
     
     const token = localStorage.getItem('token');
     if (!token) {
          // Logout
          dispatch(logout());
     } else {
          const expirationTime = new Date(localStorage.getItem('expirationTime'));
          if (expirationTime <= new Date()) {
               // Logout
               dispatch(logout());
          } else {
               const userId = localStorage.getItem('userId');
               dispatch(authSuccess(token, userId));
          }
     }
}


