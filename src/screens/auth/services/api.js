
import { apiPostRequest } from "../../../redux/api/post";
import {apiPatchRequest} from "../../../redux/api/patch";

const API_URL = process.env.APP_BACKEND_API || "https://ev-care-api.vercel.app";

// API CALLS
export const signInAPI = (data) => 
    apiPostRequest({
        apiUrl: `${API_URL}/auth/signInMobile`,
        content_type: "application/json",
        data: data,
    });

export const verifyOtpAPI = (data) => 
        apiPostRequest({
            apiUrl: `${API_URL}/auth/verifyOtp`,
            content_type: "application/json",
            data: data,
        });
export const signupAPI = (data) => 
            apiPatchRequest({
                apiUrl: `${API_URL}/auth/signup/${deta.user_key}`,
                content_type: "application/json",
                data: data,
            });
