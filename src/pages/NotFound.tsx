
import React from "react";
import { useLocation, Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FB]">
      <div className="text-center max-w-md px-4">
        <h1 className="text-6xl font-bold text-primary-dark mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <p className="text-gray-500 mb-8">
          We couldn't find the page at {location.pathname}
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center px-5 py-2.5 bg-primary-light text-white rounded-md hover:bg-primary transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
