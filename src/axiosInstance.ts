import axios from "axios";

// const API = 'https://shepath-be.onrender.com'; // render
const API = 'https://shepathbe-production.up.railway.app/'; // railway
// const API = 'http://localhost:5000';

const axiosInstance = axios.create({
    baseURL: API,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Attach token to each request
// axiosInstance.interceptors.request.use((config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   });

export default axiosInstance;