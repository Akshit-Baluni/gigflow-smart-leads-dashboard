import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6">
        <AlertCircle className="h-10 w-10" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 mb-2">404 - Page Not Found</h1>
      <p className="text-slate-500 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20"
      >
        <Home className="h-5 w-5 mr-2" />
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
