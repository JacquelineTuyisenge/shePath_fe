import axios from "axios";

const API= 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL: API,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export default axiosInstance;