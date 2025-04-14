import axios from "axios";

export const apiPatchRequest = async (request) => {
    try {
        const headers = {
            "accept": "*/*",
            "content-type": request.content_type,
            Authorization: `Bearer ${request.accessToken}`, // Add Bearer token here

        };
        console.log("request in apiPatchRequest", headers);

        const response = await axios.patch(request.apiUrl, request.data, { headers });

        return response;
    } catch (error) {
        return Promise.reject(error.response ? error.response.data : error.message);
    }
};
