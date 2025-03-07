import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { updateCourseCategory } from "../features/courceCategorySlice";

interface EditCatModelProps {
  categoryId: any;
  isOpen: boolean;
  onClose: () => void;
}

const EditCatModel: React.FC<EditCatModelProps> = ({ categoryId, isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const category = useSelector((state: RootState) =>
    state.categories.categories.find((category) => category.id === categoryId)
  );

  const [name, setName] = useState<string>(category?.name || "");
  const [description, setDescription] = useState<string>(category?.description || "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description);
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) {
      setError("Both fields are required");
      return;
    }
    dispatch(updateCourseCategory({ id: categoryId, name, description }));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-semibold text-primary mb-4">Edit Category</h2>
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-400 rounded-md hover:bg-gray-500 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-light-primary rounded-md hover:bg-accent focus:outline-none"
            >
              Update Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCatModel;
