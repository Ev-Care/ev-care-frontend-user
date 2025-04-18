import { apiGetRequest } from "../../../redux/api/get";
import { apiPatchRequest } from "../../../redux/api/patch";

const API_URL = process.env.APP_BACKEND_API || "http://89.116.34.17:3010";

export const getAllStationsByLocationAPI = (data) =>
  apiGetRequest({
    apiUrl: `${API_URL}/charging-stations/get-all-stations-by-location?latitude=${data.coords.latitude}&longitude=${data.coords.longitude}&radius=${data.radius}`,
    content_type: "application/json",
    accessToken: data.accessToken,
  });

export const updateUserProfileAPI = (data) =>
  apiPatchRequest({
    apiUrl: `${API_URL}/users/${data.user_key}`,
    content_type: "application/json",
    data: {
      owner_legal_name: data.owner_legal_name,
      email: data.email,
      avatar: data.avatar,
    },
    accessToken: data.accessToken,
  });

export const getUserByKeyAPI = (data) =>
  apiGetRequest({
    apiUrl: `${API_URL}/users/get-user/${data.user_key}`,
    content_type: "application/json",
    accessToken: data.accessToken,
  });
