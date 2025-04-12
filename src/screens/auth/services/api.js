
import { apiPostRequest } from "../../../redux/api/post";
import { apiPatchRequest } from "../../../redux/api/patch";
import { apiPostFileRequest } from "../../../redux/api/postSingleFile";


const API_URL = process.env.APP_BACKEND_API || "http://89.116.34.17:3010";

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
        apiUrl: `${API_URL}/auth/signup/${data.user_key}`,
        content_type: "application/json",
        data: data,
    });

export const postSingleFileAPI = (data) => {
    // console.log("data", data);
    return apiPostFileRequest({
        apiUrl: `${API_URL}/file-upload/single`,
        content_type: "multipart/form-data",
        file: data.file,
        accessToken: data.accessToken,
    });
}