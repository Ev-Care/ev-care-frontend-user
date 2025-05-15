import {apiGetRequest } from "../../../redux/api/get";
import {apiPostRequest } from "../../../redux/api/post";
import {apiPatchRequest } from "../../../redux/api/patch";
import { apiDeleteRequest } from "../../../redux/api/delete";

const API_URL = process.env.APP_BACKEND_API || "http://89.116.34.17:3010";

// API CALLS
export const postStationAPI = (data) =>
    apiPostRequest({
    apiUrl: `${API_URL}/charging-stations/create-station`,
    content_type: "application/json",
    data: data.stationData,
    accessToken: data.accessToken,
  });
export const getAllStationsAPI = (data) =>
    apiGetRequest({
    apiUrl: `${API_URL}/charging-stations?owner_id=${data.owner_id}`,
    content_type: "application/json",
    accessToken: data.accessToken,
  });
export const getStationByIdAPI = (data) =>
    apiGetRequest({
    apiUrl: `${API_URL}/charging-stations/${data.station_id}`,
    content_type: "application/json",
    accessToken: data.accessToken,
  });

export const updateStationsChargersConnectorsStatusAPI = (data) =>
    apiPatchRequest({
    apiUrl: `${API_URL}/charging-stations/change-status/${data.station_id}`,
    content_type: "application/json",
    data: {statusType : data.statusType, status: data.status, 
      charger_id:data.charger_id, connector_id:data.connector_id},
    accessToken: data.accessToken,
  });

export const deleteStationAPI = (data) =>
    apiDeleteRequest({
    apiUrl: `${API_URL}/charging-stations/${data.station_id}`,
    content_type: "application/json",
    accessToken: data.accessToken,
  });


export const updateAllStationStatusAPI = (data) =>
    apiPostRequest({
    apiUrl: `${API_URL}/charging-stations/update-station-by-vendor`,
    content_type: "application/json",
    data: {status: data.status, statusType: data.statusType},
    accessToken: data.accessToken,
  });
export const updateStationAPI = (data) =>
    apiPatchRequest({
    apiUrl: `${API_URL}/charging-stations/update-station/${data.stationDetails.station_id}`,
    content_type: "application/json",
    data: data.stationDetails,
    accessToken: data.accessToken,
  });

