import axios from "axios";

export const apiDeleteRequest = async (request) => {
    try {
        // console.log("Calling delete API:", request);
        // console.log("Headers:", { Authorization: `Bearer ${request.accessToken}` });

        const response = await axios.delete(request.apiUrl, {
            headers: {
                "accept": "*/*",
                "content-type": request.content_type,
                Authorization: `Bearer ${request.accessToken}`, // Add Bearer token here
            },
        });

        // Log the raw response for debugging
        // console.log("Raw Delete API Response:", response.data);

        return response; // Axios automatically parses JSON
    } catch (error) {
        // console.log("Error in apiGetRequest:", error?.response?.data || error.message);
        throw error;
    }
};

const apiResponseHandler = async (res) => {
    if (!res.ok) {
        const error = await res.json().catch(() => res.status);
        return Promise.reject(error);
    } else {
        return res.json();
    }
};