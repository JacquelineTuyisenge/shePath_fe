import Cookies
 from "js-cookie";
const LogoutButton = () => {
    const handleLogout = () => {
        // localStorage.removeItem("token");
        Cookies.remove("token");
        localStorage.removeItem("role");
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
