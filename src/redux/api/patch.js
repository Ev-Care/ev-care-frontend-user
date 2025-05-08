import axios from "axios";

export const apiPatchRequest = async (request) => {
    try {
        const headers = {
            "accept": "*/*",
            "content-type": request.content_type,
            Authorization: `Bearer ${request.accessToken}`, // Add Bearer token here

        };
        console.log("request in apiPatchRequest", JSON.stringify(request, null, 2));

        const response = await axios.patch(request.apiUrl, request.data, { headers });
        console.log("response in apiPatchRequest", response.data);
        return response;
    } catch (error) {
        console.error("Error in apiPatchRequest", error);
        return Promise.reject(error.response ? error.response.data : error.message);
    }
};
