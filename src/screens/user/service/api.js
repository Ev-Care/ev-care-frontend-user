import { apiGetRequest } from "../../../redux/api/get";
import { apiPatchRequest } from "../../../redux/api/patch";
import { apiPostRequest } from "../../../redux/api/post";

const API_URL = process.env.APP_BACKEND_API || "http://evcareindia.com/api";

export const getAllStationsByLocationAPI = (data) =>
  apiGetRequest({
    apiUrl: `${API_URL}/charging-stations/get-all-stations-by-location?latitude=${data.coords.latitude}&longitude=${data.coords.longitude}&radius=${data.radius}`,
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

export const updatePasswordAPI = (data) =>
  apiPostRequest({
    apiUrl: `${API_URL}/users/reset-password`,
    content_type: "application/json",
    data: data.data,
    accessToken: data.accessToken,
  });

export const getUserByKeyAPI = (data) =>
  apiGetRequest({
    apiUrl: `${API_URL}/users/get-user/${data.user_key}`,
    content_type: "application/json",
    accessToken: data.accessToken,
  });

export const getEnrouteStationsAPI = (data) =>
  apiGetRequest({
    apiUrl: `${API_URL}/charging-stations/get-all-stations-in-route?fromLat=${data.fromLat}&fromLng=${data.fromLng}&maxDistance=${data.maxDistance}&toLng=${data.toLng}&toLat=${data.toLat}`,
    content_type: "application/json",
    accessToken: data.accessToken,
  });
export const postFavoriteStationAPI = (data) =>
  apiPostRequest({
    apiUrl: `${API_URL}/favorite-station/favorite`,
    content_type: "application/json",
    data: {
      stationId: data.stationId,
      userId: data.userId,
    },
    accessToken: data.accessToken,
  });

export const getAllFavoriteStationsAPI = (data) =>
  apiGetRequest({
    apiUrl: `${API_URL}/favorite-station/favorite-list/${data.user_key}`,
    content_type: "application/json",
    accessToken: data.accessToken,
  });

export const unFavoriteStationAPI = (data) =>
  apiPostRequest({
    apiUrl: `${API_URL}/favorite-station/unfavorite`,
    content_type: "application/json",
    data: {
      stationId: data.stationId,
      userId: data.userId,
    },
    accessToken: data.accessToken,
  });

export const sendQuery = (data) =>
  apiPostRequest({
    apiUrl: `${API_URL}/support/send-query`,
    content_type: "application/json",
    data: {
      title: data.title,
      email: data.email,
      description: data?.description,
      contactNumber: data?.contactNumber,
      image: data?.image ? data?.image : "",
    },
    accessToken: data.accessToken,
  });
