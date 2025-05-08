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

export const getAllPendingUsersAPI = (data) =>
  apiGetRequest({
    apiUrl: `${API_URL}/users/get-all-pending-users`,
    content_type: "application/json",
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
    data: data,
  });
