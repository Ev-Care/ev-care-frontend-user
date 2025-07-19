import { apiPostRequest } from "../../../redux/api/post";
import { apiPatchRequest } from "../../../redux/api/patch";
import { apiPostFileRequest } from "../../../redux/api/postSingleFile";
import { apiGetRequest } from "../../../redux/api/get";

const API_URL = process.env.APP_BACKEND_API || "http://evcareindia.com/api";

// API CALLS
export const signInAPI = (data) =>
  apiPostRequest({
    apiUrl: `${API_URL}/auth/signInMobile`,
    content_type: "application/json",
    data: data,
  });
// API CALLS
export const loginAPI = (data) =>
  apiPostRequest({
    apiUrl: `${API_URL}/auth/signin`,
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
export const registerAPI = (data) =>
  apiPostRequest({
    apiUrl: `${API_URL}/auth/register`,
    content_type: "application/json",
    data: data,
  });
  
export const forgetPasswordAPI = (data) =>
  apiPostRequest({
    apiUrl: `${API_URL}/auth/forgotPassword`,
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
};

export const updateVendorAPI = async (data) => {
  try {
    var response = await apiPatchRequest({
      apiUrl: `${API_URL}/users/update-vendor-profile/${data.user_key}`,
      content_type: "application/json",
      data: data.detail,
      accessToken: data.accessToken,
    });
    return response;
  } catch (error) {
    return error;
   
  }
  
};

export const getUserByKeyApi = (data) =>
  apiGetRequest({
    apiUrl: `${API_URL}/users/get-user/${data.user_key}`,
    content_type: "application/json",
    accessToken: data.accessToken
  });
