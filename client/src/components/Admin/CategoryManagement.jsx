import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { categories } from '../../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../common/LoadingSpinner';
import SubcategoryManagement from './SubcategoryManagement';

const CategoryManagement = () => {
  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const queryClient = useQueryClient();

  // Get categories with proper error handling
  const { data: categoriesList, isLoading, error } = useQuery(
    'categories',
    async () => {
      const response = await categories.getAll();
      return response.data; // Access the data property from the response
    }
  );

  const createCategory = useMutation(
    async (name) => {
      const response = await categories.create({ name });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('categories');
        toast.success('Category created successfully');
        setName('');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create category');
      },
    }
  );

  const deleteCategory = useMutation(
    async (categoryId) => {
      await categories.delete(categoryId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('categories');
        toast.success('Category deleted successfully');
      },
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }
    try {
      await createCategory.mutateAsync(name);
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading categories: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Add New Category
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Create a new category for products
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div className="mt-4">
                <button
                  type="submit"
                  disabled={createCategory.isLoading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {createCategory.isLoading ? 'Creating...' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {Array.isArray(categoriesList) && categoriesList.length > 0 ? (
            categoriesList.map((category) => (
              <li key={category._id}>
                <div className="px-4 py-4 flex items-center justify-between">
                  <div className="text-sm font-medium text-indigo-600">{category.name}</div>
                  <div>
                    <button
                      onClick={() => setSelectedCategory(category._id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Manage Subcategories
                    </button>
                    <button
                      onClick={() => deleteCategory.mutate(category._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-4 text-center text-gray-500">
              No categories found
            </li>
          )}
        </ul>
      </div>

      {selectedCategory && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Manage Subcategories for {categoriesList?.find(c => c._id === selectedCategory)?.name}
          </h3>
          <SubcategoryManagement categoryId={selectedCategory} />
        </div>
      )}
    </div>
  );
};

export default CategoryManagement; 