import axios from 'axios';

export const apiPostRequest = async ({ apiUrl, content_type, data, accessToken }) => {
  try {
    const headers = {
      'Content-Type': content_type,
      'Accept': '*/*',
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    // console.log(`POST Request: ${apiUrl}`);
    // console.log('Headers:', headers);
    // console.log('Body:', data);

    const response = await axios.post(apiUrl, data, { headers });
    // console.log('raw api response = ', response.data);
    return response; // axios parses JSON by default
  } catch (error) {
    console.error('Error in apiPostRequest:', error?.response?.data || error.message);
    throw error;
  }
};
