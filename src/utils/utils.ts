// utils/auth.ts
// import Cookies from "js-cookie";
// export const isAuthenticated = () => {
//     return !! Cookies.get('token');
//     // return !!localStorage.getItem('token');
//   };

import axiosInstance from "../axiosInstance";


export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const response = await axiosInstance.get('/api/auth/check', { 
      withCredentials: true 
    });
    return response.data.authenticated;
  } catch (error) {
    return false;
  }
};

// export const isAuthenticatedCookie = (): boolean => {
//   return !!Cookies.get('token');
// };