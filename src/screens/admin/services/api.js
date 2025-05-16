import { apiGetRequest } from "../../../redux/api/get";
import { apiPatchRequest } from "../../../redux/api/patch";
import { apiPostRequest } from "../../../redux/api/post";

const API_URL = process.env.APP_BACKEND_API || "http://89.116.34.17:3010";

export const getAllPendingStationAPI = (data) =>
  apiGetRequest({
    apiUrl: `${API_URL}/charging-stations/get-all-pending-stations`,
    content_type: "application/json",
    accessToken: data.accessToken,
  });
export const getAllStationsAPI = (data) =>
  apiGetRequest({
    apiUrl: `${API_URL}/charging-stations`,
    content_type: "application/json",
    accessToken: data.accessToken,
  });

export const getAllStationsByUserIdAPI = (data) =>
    apiGetRequest({
    apiUrl: `${API_URL}/charging-stations?owner_id=${data.owner_id}`,
    content_type: "application/json",
    accessToken: data.accessToken,
  });

export const getAllPendingUsersAPI = (data) =>
  apiGetRequest({
    apiUrl: `${API_URL}/users/get-all-users?status=completed&userType=vendor`,
    content_type: "application/json",
    accessToken: data.accessToken,
  });

export const getAllUsersAPI = (data) =>
  apiGetRequest({
    apiUrl: `${API_URL}/users/get-all-users?status=${data.status}&userType=${data.userType}`,
    content_type: "application/json",
    accessToken: data.accessToken,
  });

export const updateUserProfileAPI = (data) =>
  apiPatchRequest({
    apiUrl: `${API_URL}/users/edit-user/${data.user_key}`,
    content_type: "application/json",
    data: {
      owner_legal_name: data?.owner_legal_name,
      email: data?.email,
      role: data?.role,
      address: data?.address,
      // password:data?.password,
      avatar: data?.avatar,
      status: data?.status,
      vehicle_model: data?.vehicle_model,
      vehicle_manufacturer: data?.vehicle_manufacturer,
      vehicle_registration_number: data?.vehicle_registration_number,
      business_name: data?.business_name || null,
      adhar_back_pic: data?.adhar_back_pic,
      adhar_front_pic: data?.adhar_front_pic,
      pan_pic: data?.pan_pic,
      adhar_no: data?.adhar_no,
      pan_no: data?.pan_no,
      gstin_number: data?.gstin_number,
      gstin_image: data?.gstin_image,
      tan_no: data?.tan_no,
      tan_pic: data?.tan_pic,
      mobile_number: data?.mobile_number,
      vendor_type: data?.vendor_type,
    },
    accessToken: data.accessToken,
  });

export const getAllSupportIssuesAPI = (data) =>
  apiGetRequest({
    apiUrl: `${API_URL}/support`,
    content_type: "application/json",
    accessToken: data.accessToken,
  });


export const approveStationAPI = (data) =>
  apiPatchRequest({
    apiUrl: `${API_URL}/charging-stations/approve/${data.station_id}`,
    content_type: "application/json",
    accessToken: data.accessToken,
  });
  
export const rejectStationAPI = (data) =>
  apiPatchRequest({
    apiUrl: `${API_URL}/charging-stations/reject/${data.station_id}`,
    content_type: "application/json",
    accessToken: data.accessToken,
  });

export const approveVendorProfileAPI = (data) =>
  apiPostRequest({
    apiUrl: `${API_URL}/users/approve-account/${data.user_key}`,
    content_type: "application/json",
    accessToken: data.accessToken,
    data: { status: data.status },
  });

export const createUserAPI = (data) =>
  apiPostRequest({
    apiUrl: `${API_URL}/users/create-user`,
    content_type: "application/json",
    accessToken: data.accessToken,
    data: data.data,
  });

export const addStationByAdminAPI = (data) =>
  apiPostRequest({
    apiUrl: `${API_URL}/charging-stations/create-station-by-admin`,
    content_type: "application/json",
    accessToken: data.accessToken,
    data: data.data,
  });
export const getEntityCountAPI = (data) =>
    apiGetRequest({
    apiUrl: `${API_URL}/users/get-all-count`,
    content_type: "application/json",
    accessToken: data.accessToken,
  });