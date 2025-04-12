import axios from "axios";

export const apiPostFileRequest = async (request) => {
    try {
        // console.log("Calling API:", request.apiUrl);
        // console.log("Headers:", { "content-type": request.content_type, Authorization: `Bearer ${request.accessToken}` });
        // console.log("Request Body:", request.file);

        const response = await axios.post(request.apiUrl, request.file, {
            headers: {
                "accept": "*/*",
                "content-type": request.content_type,
                Authorization: `Bearer ${request.accessToken}`, // Add Bearer token here
            },
        });

        return response; // Axios automatically parses JSON
    } catch (error) {
        console.log("Error in apiPostRequest:", error?.response?.data || error.message);
        throw error;
    }
};