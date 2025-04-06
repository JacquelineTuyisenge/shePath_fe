// utils/auth.ts
import Cookies from "js-cookie";
export const isAuthenticated = () => {
    return !! Cookies.get('token');
    // return !!localStorage.getItem('token');
  };