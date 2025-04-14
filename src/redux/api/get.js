import axios from "axios";

export const apiGetRequest = async (request) => {
    try {
        console.log("Calling API:", request.apiUrl);
        console.log("Headers:", { Authorization: `Bearer ${request.accessToken}` });

        const response = await axios.get(request.apiUrl, {
            headers: {
                "accept": "*/*",
                "content-type": request.content_type,
                Authorization: `Bearer ${request.accessToken}`, // Add Bearer token here
            },
        });

        // Log the raw response for debugging
        // console.log("Raw API Response:", response);

        return response.data; // Axios automatically parses JSON
    } catch (error) {
        console.log("Error in apiGetRequest:", error?.response?.data || error.message);
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