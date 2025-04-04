import axios from "axios";

export const apiPatchRequest = async (request) => {
    try {
        const headers = {
            "accept": "*/*",
            "content-type": request.content_type,
        };

        const response = await axios.patch(request.apiUrl, request.data, { headers });

        return response;
    } catch (error) {
        return Promise.reject(error.response ? error.response.data : error.message);
    }
};
