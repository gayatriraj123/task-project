import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { orders } from '../../services/api';
import { toast } from 'react-toastify';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shippingAddress: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      setLoading(true);
      const orderData = {
        items: cart.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: formData.shippingAddress,
        city: formData.city,
        postalCode: formData.postalCode,
        phone: formData.phone,
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
      };

      console.log('Sending order data:', orderData);
      const response = await orders.create(orderData);
      console.log('Order response:', response);

      clearCart();
      toast.success('Order placed successfully!');
      navigate('/customer/orders');
    } catch (error) {
      console.error('Order creation error:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Checkout</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Shipping Address
                </label>
                <textarea
                  name="shippingAddress"
                  rows={3}
                  required
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-lg font-medium text-gray-900">Order Summary</h4>
                <ul className="mt-4 space-y-3">
                  {cart.map(item => (
                    <li key={item._id} className="flex justify-between">
                      <div>
                        <span className="text-gray-900">{item.name}</span>
                        <span className="text-gray-500 ml-2">x {item.quantity}</span>
                      </div>
                      <span className="text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-between border-t border-gray-200 pt-4">
                  <span className="text-lg font-medium text-gray-900">Total</span>
                  <span className="text-lg font-medium text-gray-900">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading || cart.length === 0}
                className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 