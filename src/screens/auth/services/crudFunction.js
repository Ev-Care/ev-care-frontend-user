import { 
    signInSuccess, 
    signInFailed, 
    verifyOtpSuccess, 
    verifyOtpFailed, 
    signUpSuccess, 
    signUpFailed 
} from "./slice"; 

import { signInAPI, verifyOtpAPI, signupAPI } from "./api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const postSignIn = createAsyncThunk(
    "auth/signIn",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await signInAPI(data);
            if (response.status === 200 || response.status === 201) {
                const responseData = await response.json();
                dispatch(signInSuccess(responseData));
                return responseData;
            } else {
                throw new Error("Error : otp not sent ,Try again");
            }
        } catch (error) {
            dispatch(signInFailed(error.message));
            return rejectWithValue(error.message);
        }
    }
);

export const postVerifyOtp = createAsyncThunk(
    "auth/verifyOtp",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await verifyOtpAPI(data);
            if (response.status === 200 || response.status === 201) {
                const responseData = await response.json();
                dispatch(verifyOtpSuccess(responseData));
                return responseData;
            } else {
                throw new Error("OTP verification failed");
            }
        } catch (error) {
            dispatch(verifyOtpFailed(error.message));
            return rejectWithValue(error.message);
        }
    }
);

export const postSignUp = createAsyncThunk(
    "auth/signUp",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await signupAPI(data);
            if (response.status === 200 || response.status === 201) {
                const responseData = await response.json();
                dispatch(signUpSuccess(responseData));
                return responseData;
            } else {
                throw new Error("Signup failed");
            }
        } catch (error) {
            dispatch(signUpFailed(error.message));
            return rejectWithValue(error.message);
        }
    }
);
