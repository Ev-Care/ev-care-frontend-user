import axios from "axios";

export const apiPostRequest = async (request) => {
    try {
        // console.log("Calling API:", request.apiUrl);
        // console.log("Headers:", { "content-type": request.content_type });
        // console.log("Request Body:", request.data);

        const response = await axios.post(request.apiUrl, request.data, {
            headers: {
                "accept": "*/*",
                "content-type": request.content_type,
            },
        });

        // console.log("Raw API Response:", response);

        return response;  // Axios automatically parses JSON
    } catch (error) {
        console.log("Error in apiPostRequest:", error?.response?.data || error.message);
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
