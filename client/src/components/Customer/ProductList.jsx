import React from 'react';
import { useQuery } from 'react-query';
import { products } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { useCart } from '../../context/CartContext';

const ProductList = () => {
  const { data: productsList, isLoading } = useQuery('products', async () => {
    const response = await products.getAll();
    return response.data;
  });

  const { addToCart } = useCart();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {productsList?.products?.map((product) => (
        <div key={product._id} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-4">
            <div className="aspect-w-3 aspect-h-2 mb-4">
              <img
                src={product.imageUrl || 'https://via.placeholder.com/300'}
                alt={product.name}
                className="object-cover rounded-lg"
              />
            </div>
            <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{product.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-lg font-medium text-gray-900">₹{product.price}</p>
              <button
                onClick={() => addToCart(product)}
                disabled={product.stockQuantity === 0}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400"
              >
                {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList; 