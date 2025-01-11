import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { products, categories } from '../../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../common/LoadingSpinner';

const ProductManagement = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    stockQuantity: '',
    subcategory: '',
  });
  const [selectedCategory, setSelectedCategory] = useState('');
  const queryClient = useQueryClient();

  const { data: categoriesList, isLoading: loadingCategories } = useQuery('categories', async () => {
    const response = await categories.getAll();
    return response.data;
  });

  const { data: subcategories, isLoading: loadingSubcategories } = useQuery(
    ['subcategories', selectedCategory],
    async () => {
      const response = await categories.getSubcategories(selectedCategory);
      return response.data;
    },
    {
      enabled: !!selectedCategory,
    }
  );

  const { data: productsList, isLoading: loadingProducts } = useQuery('products', async () => {
    const response = await products.getAll();
    return response.data;
  });

  const createProduct = useMutation(
    async (data) => {
      const response = await products.create(data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
        toast.success('Product created successfully');
        setFormData({
          name: '',
          description: '',
          price: '',
          imageUrl: '',
          stockQuantity: '',
          subcategory: '',
        });
      },
    }
  );

  const deleteProduct = useMutation(
    async (productId) => {
      await products.delete(productId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
        toast.success('Product deleted successfully');
      },
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subcategory) {
      toast.error('Please select a subcategory');
      return;
    }
    await createProduct.mutateAsync(formData);
  };

  if (loadingCategories || loadingProducts) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-6 sm:col-span-3">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select Category</option>
              {categoriesList?.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-6 sm:col-span-3">
            <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
              Subcategory
            </label>
            <select
              id="subcategory"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select Subcategory</option>
              {subcategories?.map((subcategory) => (
                <option key={subcategory._id} value={subcategory._id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div className="col-span-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              required
              value={formData.description}
              onChange={handleChange}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div className="col-span-6 sm:col-span-3">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              name="price"
              id="price"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div className="col-span-6 sm:col-span-3">
            <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700">
              Stock Quantity
            </label>
            <input
              type="number"
              name="stockQuantity"
              id="stockQuantity"
              required
              min="0"
              value={formData.stockQuantity}
              onChange={handleChange}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div className="col-span-6">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              id="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="mt-5">
          <button
            type="submit"
            disabled={createProduct.isLoading}
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {createProduct.isLoading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Products List</h3>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {productsList?.products?.map((product) => (
              <li key={product._id} className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={product.imageUrl || 'https://via.placeholder.com/100'}
                      alt={product.name}
                      className="h-16 w-16 object-cover rounded"
                    />
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">{product.name}</h4>
                      <p className="text-sm text-gray-500">{product.description}</p>
                      <p className="text-sm font-medium text-gray-900">Price: ₹{product.price}</p>
                      <p className="text-sm text-gray-500">Stock: {product.stockQuantity}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteProduct.mutate(product._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement; 