import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundView() {
  return (
    <div className="text-center p-10">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4">The page you are looking for does not exist.</p>
      <Link to="/" className="text-blue-500 mt-4 block">
        Go back to Home
      </Link>
    </div>
  );
};
