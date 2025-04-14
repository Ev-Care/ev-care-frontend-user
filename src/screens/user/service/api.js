import { apiGetRequest } from "../../../redux/api/get";

export const getAllStationsByLocationAPI = (data) =>
    apiGetRequest({
    apiUrl: `${API_URL}/charging-stations/get-all-stations-by-location?owner_id=${data.userId}&latitude=${data.latitude}&longitude=${data.longitude}&radius=${radius}`,
    content_type: "application/json",
    accessToken: data.accessToken,
  });