import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen m-3 text-center">
      <h1 className="text-4xl font-bold text-dark-primary">404 - Page Not Found</h1>
      <p className="mt-4 text-gray-600">Oops! The page you are looking for doesn't exist.</p>
      <Link to="/" className="mt-4 px-4 py-2 bg-dark-gray text-white rounded">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
