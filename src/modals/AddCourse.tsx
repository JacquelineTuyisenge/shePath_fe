import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { addCourse, fetchCourses } from "../features/courseSlice";
import { fetchCourseCategories } from "../features/courceCategorySlice";
import { Editor } from "@tinymce/tinymce-react";

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="dark:bg-gray-800 bg-gray-600 border border-gray-700 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add Course</h2>
        <form onSubmit={handleSubmit}>
          <select
            className="w-full p-2 border rounded mb-4 text-black"
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
            className="w-full p-2 border rounded mb-4 text-black"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Description"
            className="w-full p-2 border rounded mb-4 text-black"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Editor
            apiKey="t8uuywazitnms1i0ekktzks3xhzj16udserdmpfvqnxajsq2"
            initialValue={content}
            init={{
              height: 300,
              menubar: false,
              plugins: ["lists link image code"]
            }}
            onEditorChange={(newContent: string) => setContent(newContent)}
          />
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="bg-gray-300 p-2 rounded">
              Cancel
            </button>
            <button type="submit" className="bg-light-primary text-white p-2 rounded">
              Add Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourseModal;
