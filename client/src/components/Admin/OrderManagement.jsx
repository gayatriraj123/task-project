import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { orders } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const OrderManagement = () => {
  const queryClient = useQueryClient();
  
  const { data: allOrders, isLoading, error } = useQuery(
    'allOrders',
    orders.getAllOrders,
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      }
    }
  );

  const updateOrderStatus = useMutation(
    async ({ orderId, status }) => {
      const response = await orders.updateStatus(orderId, { status });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('allOrders');
        toast.success('Order status updated successfully');
      },
      onError: (error) => {
        console.error('Update status error:', error);
        toast.error(error.response?.data?.message || 'Failed to update order status');
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
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">All Orders</h3>
        </div>
        <div className="border-t border-gray-200">
          {allOrders?.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {allOrders.map((order) => (
                <li key={order._id} className="px-4 py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Order ID: {order._id}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        Customer: {order.user?.email || 'Unknown'}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        Date: {new Date(order.createdAt).toLocaleString()}
                      </div>
                      <div className="mt-2">
                        <h4 className="text-sm font-medium text-gray-900">Items:</h4>
                        <ul className="mt-1 space-y-1">
                          {order.items.map((item) => (
                            <li key={item._id} className="text-sm text-gray-500">
                              {item.product?.name || 'Product Not Found'} x {item.quantity} - ₹{item.price * item.quantity}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-2 text-sm font-medium text-gray-900">
                        Total: ₹{order.total}
                      </div>
                    </div>
                    <div className="ml-6">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus.mutate({
                            orderId: order._id,
                            status: e.target.value,
                          })
                        }
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
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
    </div>
  );
};

export default OrderManagement; 