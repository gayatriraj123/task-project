import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { categories } from '../../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../common/LoadingSpinner';

const SubcategoryManagement = ({ categoryId }) => {
  const [name, setName] = useState('');
  const queryClient = useQueryClient();

  const { data: subcategories, isLoading } = useQuery(
    ['subcategories', categoryId],
    async () => {
      const response = await categories.getSubcategories(categoryId);
      return response.data;
    },
    {
      enabled: !!categoryId,
    }
  );

  const createSubcategory = useMutation(
    async (name) => {
      const response = await categories.createSubcategory(categoryId, { name });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['subcategories', categoryId]);
        toast.success('Subcategory created successfully');
        setName('');
      },
    }
  );

  const deleteSubcategory = useMutation(
    async (subcategoryId) => {
      await categories.deleteSubcategory(categoryId, subcategoryId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['subcategories', categoryId]);
        toast.success('Subcategory deleted successfully');
      },
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Subcategory name is required');
      return;
    }
    await createSubcategory.mutateAsync(name);
  };

  if (!categoryId) return <div>Please select a category first</div>;
  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit} className="mb-6">
        <div>
          <label htmlFor="subcategoryName" className="block text-sm font-medium text-gray-700">
            Add Subcategory
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              name="subcategoryName"
              id="subcategoryName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter subcategory name"
            />
            <button
              type="submit"
              disabled={createSubcategory.isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {createSubcategory.isLoading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>
      </form>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {Array.isArray(subcategories) && subcategories.length > 0 ? (
            subcategories.map((subcategory) => (
              <li key={subcategory._id}>
                <div className="px-4 py-4 flex items-center justify-between">
                  <div className="text-sm font-medium text-indigo-600">{subcategory.name}</div>
                  <button
                    onClick={() => deleteSubcategory.mutate(subcategory._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-4 text-center text-gray-500">No subcategories found</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SubcategoryManagement; 