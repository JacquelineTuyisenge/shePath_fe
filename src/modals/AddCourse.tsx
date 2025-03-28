// AddCourseModal.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { addCourse, fetchCourses } from "../features/courseSlice";
import { fetchCourseCategories } from "../features/courceCategorySlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Loader from "../components/Loader";
import Toaster from "../components/Toaster";

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
  const { loading, error, message } = useSelector((state: RootState) => state.courses);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [toaster, setToaster] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    dispatch(fetchCourseCategories());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      setToaster({ message, type: "success" });
      dispatch(fetchCourses());
      setTimeout(() => {
        setToaster(null);
        onClose();
        setTitle("");
        setDescription("");
        setContent("");
        setCategoryId("");
        setImage(null);
      }, 3000);
    }
    if (error) {
      setToaster({ message: error, type: "error" });
      setTimeout(() => setToaster(null), 3000);
    }
  }, [message, error, dispatch, onClose]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("content", content);
    formData.append("categoryId", categoryId);
    if (image) {
      formData.append("image", image);
    }

    dispatch(addCourse(formData));
  };

  // Quill modules configuration
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"], // Remove formatting
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-light-gray dark:bg-dark-gray border border-light-gray dark:border-dark-gray p-6 rounded-lg shadow-lg w-96 text-light-text dark:text-dark-text" dir="ltr">
        <h2 className="text-xl font-bold mb-4">Add Course</h2>
        {toaster && <Toaster message={toaster.message} type={toaster.type} />}
        {loading && <Loader />}

        <form onSubmit={handleSubmit}>
          <select
            className="w-full p-2 border rounded mb-4 bg-white dark:bg-black text-light-text dark:text-dark-text border-light-gray dark:border-dark-gray focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            disabled={loading}
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
            className="w-full p-2 border rounded mb-4 bg-white dark:bg-black text-light-text dark:text-dark-text border-light-gray dark:border-dark-gray focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Description"
            className="w-full p-2 border rounded mb-4 bg-white dark:bg-black text-light-text dark:text-dark-text border-light-gray dark:border-dark-gray focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={loading}
          />
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={quillModules}
            formats={quillFormats}
            className="mb-4 bg-white dark:bg-black text-light-text dark:text-dark-text border-light-gray dark:border-dark-gray"
            readOnly={loading}
            style={{ direction: "ltr", textAlign: "left" }}
          />
          <div className="mt-4">
            <input
              type="file"
              accept="image/*"
              className="w-full p-2 border rounded mb-4 bg-white dark:bg-black text-light-text dark:text-dark-text border-light-gray dark:border-dark-gray focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
              onChange={handleImageChange}
              disabled={loading}
            />
            {image && <img src={URL.createObjectURL(image)} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-light-gray dark:bg-dark-gray p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-light-primary dark:bg-dark-primary text-white p-2 rounded hover:bg-light-accent dark:hover:bg-dark-accent transition"
              disabled={loading}
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