import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate(-1)} 
      className="mb-4 px-4 py-2 bg-light-secondary text-white rounded-md shadow-md hover:bg-opacity-90"
    >
      ← Back
    </button>
  );
};

export default BackButton;
