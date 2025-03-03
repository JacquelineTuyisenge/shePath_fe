import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { addCourse, fetchCourses } from "../features/courseSlice";
import { fetchCourseCategories } from "../features/courceCategorySlice";

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Category {
  id: string | number;
  name: string;
}

const AddCourseModal: React.FC<AddCourseModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories = [] } = useSelector((state: RootState) => state.categories);
  
  console.log("Categories:", categories); // Debugging

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    dispatch(fetchCourseCategories());
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addCourse({ title, description, content, categoryId }));
        dispatch(fetchCourses());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text p-6 rounded-md w-96 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Add Course</h2>
        <form onSubmit={handleSubmit}>
        <select
            className="w-full border p-2 mb-2 bg-light-gray dark:bg-dark-gray text-light-text dark:text-dark-text"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.length > 0 ? (
              categories.map((category: Category) => (
                <option key={category.id} value={String(category.id)}>
                  {category.name}
                </option>
              ))
            ) : (
              <option disabled>No categories available</option>
            )}
          </select>
          <input
            type="text"
            placeholder="Title"
            className="w-full border p-2 mb-2 bg-light-gray dark:bg-dark-gray text-light-text dark:text-dark-text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            className="w-full border p-2 mb-2 bg-light-gray dark:bg-dark-gray text-light-text dark:text-dark-text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <textarea
            placeholder="Content"
            className="w-full border p-2 mb-2 bg-light-gray dark:bg-dark-gray text-light-text dark:text-dark-text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="bg-light-gray dark:bg-dark-gray text-light-text dark:text-dark-text p-2 rounded-md"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-light-primary dark:bg-dark-primary text-white p-2 rounded-md"
            >
              Add Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );

};

export default AddCourseModal;
