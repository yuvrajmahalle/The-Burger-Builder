import axios from 'axios';
import * as actionTypes from './actionTypes';

export const authStart = () =>{
    return {
        type: actionTypes.AUTH_START
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error:error
    };
};

export const authSucces = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    }
}

export const logout = () =>{
    return{
        type: actionTypes.AUTH_LOGOUT
    }
}

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        debugger;
        setTimeout(() =>{
            dispatch(logout());
        },expirationTime * 1000)
    }
}   

export const auth = (email, password, isSignup) =>  {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email:email,
            password:password,
            returnSecureToken: true
        };
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBwg7l_kWi4caPUVG9XbJJbUqvX05Y-g1I';
        if(!isSignup){
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBwg7l_kWi4caPUVG9XbJJbUqvX05Y-g1I';
        }   
 
        axios.post(url,authData)
        .then(response => {
            console.log(response);
            
            dispatch(authSucces(response.data.idToken, response.data.localId));
            dispatch(checkAuthTimeout(response.data.expiresIn));
        })
        .catch(error=>{
            console.log(error);
            dispatch(authFail(error.response.data.error));
        })
    }
}