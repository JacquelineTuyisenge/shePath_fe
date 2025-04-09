import axiosInstance from "../axiosInstance";

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post("/api/auth/logout", {});
      if (response.status === 200) {
        console.log("Logged out successfully");
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to log out. Please try again.");
    }
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