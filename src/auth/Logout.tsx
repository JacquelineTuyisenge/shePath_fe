import React from "react";

const LogoutButton = () => {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    return (
        <button 
            onClick={handleLogout} 
            className="p-2 m-2 bg-dark-secondary text-white rounded-md hover:bg-red-600 transition"
        >
            Logout
        </button>
    );
};

export default LogoutButton;
