import React from 'react';
import { useQuery } from 'react-query';
import { orders } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { format } from 'date-fns';

const OrderHistory = () => {
  const { data: ordersList, isLoading, error } = useQuery(
    'myOrders',
    orders.getMyOrders,
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error('Error fetching orders:', error);
      }
    }
  );

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading orders: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Order History</h3>
      </div>
      <div className="border-t border-gray-200">
        {ordersList?.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {ordersList.map((order) => (
              <li key={order._id} className="px-4 py-4">
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-500">Order ID: </span>
                  <span className="text-sm text-gray-900">{order._id}</span>
                </div>
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-500">Date: </span>
                  <span className="text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-500">Status: </span>
                  <span className="text-sm text-gray-900">{order.status}</span>
                </div>
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-500">Total: </span>
                  <span className="text-sm text-gray-900">₹{order.total}</span>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500">Items:</h4>
                  <ul className="mt-2 divide-y divide-gray-200">
                    {order.items.map((item) => (
                      <li key={item._id} className="py-2">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {item.product?.name || 'Product Not Found'}
                            </p>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          </div>
                          <p className="text-sm text-gray-900">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory; 