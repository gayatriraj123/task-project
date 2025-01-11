import React from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    navigate('/customer/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-medium text-gray-900">Your cart is empty</h2>
        <button
          onClick={() => navigate('/customer/products')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Shopping Cart</h3>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {cart.map((item) => (
            <li key={item._id} className="px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={item.imageUrl || 'https://via.placeholder.com/100'}
                    alt={item.name}
                    className="h-16 w-16 object-cover rounded"
                  />
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500">₹{item.price}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="ml-4 text-red-600 hover:text-red-900"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="px-4 py-4 sm:px-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-gray-900">Total: ₹{total.toFixed(2)}</span>
          <div className="space-x-4">
            <button
              onClick={clearCart}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Clear Cart
            </button>
            <button
              onClick={handleCheckout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 