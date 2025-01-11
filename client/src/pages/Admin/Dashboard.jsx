import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import CategoryManagement from '../../components/Admin/CategoryManagement';
import ProductManagement from '../../components/Admin/ProductManagement';
import OrderManagement from '../../components/Admin/OrderManagement';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
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
          <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
              <Tab
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                  ${selected
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                  }`
                }
              >
                Categories
              </Tab>
              <Tab
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                  ${selected
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                  }`
                }
              >
                Products
              </Tab>
              <Tab
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                  ${selected
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                  }`
                }
              >
                Orders
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-2">
              <Tab.Panel>
                <CategoryManagement />
              </Tab.Panel>
              <Tab.Panel>
                <ProductManagement />
              </Tab.Panel>
              <Tab.Panel>
                <OrderManagement />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 