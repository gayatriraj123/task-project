import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, Outlet } from 'react-router-dom';

const Home = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold">Welcome to Our Store</h1>
              <Link
                to="/customer/products"
                className="text-gray-600 hover:text-gray-900"
              >
                Products
              </Link>
              <Link
                to="/customer/cart"
                className="text-gray-600 hover:text-gray-900"
              >
                Cart
              </Link>
              <Link
                to="/customer/orders"
                className="text-gray-600 hover:text-gray-900"
              >
                Orders
              </Link>
            </div>
            <div className="flex items-center">
              <button
                onClick={logout}
                className="ml-4 px-4 py-2 text-sm text-red-600 hover:text-red-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Home; 