import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 flex flex-col items-center justify-center">
      <div className="max-w-lg mx-auto text-center px-4">
        <h1 className="text-9xl font-bold text-blue-800">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-6">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center text-white bg-blue-800 px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Return to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;