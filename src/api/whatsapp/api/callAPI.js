// apiCaller.js
import axios from 'axios';

const API_BASE_URL = 'https://graph.facebook.com/v19.0';
const BEARER_TOKEN = "EAAPSIbqiYY0BO9Rnq9FpiPckIzYgSDVYuRvAz3DtX1k62zreG7Nxi57yTZAhaIZCGv7ZBZCHmSvm6Qqg8ebRFZBc3jYkCxLos8Ks5iJe1FbnRjm4wDpIM9HQSZAfFV18G9ZCXAWbY5XyIgS9sPIPBRZClUdLxYP0nlLxko8nHaGlZBZBA37AdmP3eZA1W42DFO5ZCmAEgxgUb16RwQkY5AC8"
// Function to make a GET request to the external API
export const getData = async (url) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${url}`, {
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`
            }
        });
        return { success: true, res: response.data }
    } catch (error) {
        if (error.response) {
            return { success: false, message: error.response.data.error.error_user_msg, data: error.response.data.error }
        }
        return { success: false, message: error.message }
    }
};

// Function to make a POST request to the external API
export const postData = async (postData, url) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/${url}`, postData, {
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        return { success: true, res: response.data }
    } catch (error) {
        if (error.response) {
            console.log(error.response.error_data)
            return { success: false, message: error.response.data.error.error_user_msg, data: error.response.data.error, url }
        }
        return { success: false, message: error.message }
    }
}
