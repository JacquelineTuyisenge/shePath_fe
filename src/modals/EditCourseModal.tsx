import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { updateCourse, clearMessage } from "../features/courseSlice";
import { fetchCourseCategories } from "../features/courceCategorySlice";
import { AppDispatch, RootState } from "../store";
import Loader from "../components/Loader";
import Toaster from "../components/Toaster";

interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: any;
}

interface Category {
  id: string | number;
  name: string;
}

const EditCourseModal = ({ isOpen, onClose, course }: EditCourseModalProps) => {
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
  const dispatch = useAppDispatch();
  const { message, error, loading } = useAppSelector((state) => state.courses);
  const { categories = [] } = useAppSelector((state: RootState) => state.categories);

  const [title, setTitle] = useState(course?.title || "");
  const [description, setDescription] = useState(course?.description || "");
  const [content, setContent] = useState(course?.content || "");
  const [categoryId, setCategoryId] = useState(course?.categoryId || "");
  const [image, setImage] = useState<File | null>(null);
  const [toaster, setToaster] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    dispatch(fetchCourseCategories());
  }, [dispatch]);

  useEffect(() => {
    setTitle(course?.title || "");
    setDescription(course?.description || "");
    setContent(course?.content || "");
    setCategoryId(course?.categoryId || "");
    setImage(null);
  }, [course]);

  useEffect(() => {
    if (message) {
      console.log("Success message received:", message); // Debug log
      setToaster({ message, type: "success" });
    } else if (error) {
      console.log("Error received:", error); // Debug log
      setToaster({ message: error, type: "error" });
    }
  }, [message, error]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id", course.id);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("content", content);
    formData.append("categoryId", categoryId);
    if (image) {
      formData.append("image", image);
    }

    dispatch(updateCourse(formData));
  };

  const handleToasterClose = () => {
    console.log("Toaster closed"); // Debug log
    setToaster(null);
    if (message) {
      dispatch(clearMessage());
      onClose();
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="relative bg-light-gray dark:bg-dark-gray border border-light-gray dark:border-dark-gray p-6 rounded-lg shadow-lg w-full max-w-2xl text-light-text dark:text-dark-text overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Course</h2>

        {/* Loader centered */}
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-40">
            <Loader />
          </div>
        )}

        {/* Toaster rendered without extra positioning */}
        {toaster && (
          <Toaster
            message={toaster.message}
            type={toaster.type}
            onClose={handleToasterClose}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            className="w-full p-3 border rounded bg-white dark:bg-black text-light-text dark:text-dark-text border-light-gray dark:border-dark-gray focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
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
            placeholder="Course Title"
            className="w-full p-3 border rounded bg-white dark:bg-black text-light-text dark:text-dark-text border-light-gray dark:border-dark-gray focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Description"
            className="w-full p-3 border rounded bg-white dark:bg-black text-light-text dark:text-dark-text border-light-gray dark:border-dark-gray focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={loading}
          />
          <div className="min-h-[300px]">
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={quillModules}
              formats={quillFormats}
              className="bg-white dark:bg-black text-light-text dark:text-dark-text border-light-gray dark:border-dark-gray h-full"
              readOnly={loading}
            />
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              className="w-full p-3 border rounded bg-white dark:bg-black text-light-text dark:text-dark-text border-light-gray dark:border-dark-gray focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
              onChange={handleImageChange}
              disabled={loading}
            />
            {image ? (
              <img src={URL.createObjectURL(image)} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
            ) : course?.image ? (
              <img src={course.image} alt="Current" className="mt-2 w-32 h-32 object-cover rounded" />
            ) : null}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-light-gray dark:bg-dark-gray p-3 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-light-primary dark:bg-dark-primary text-white p-3 rounded hover:bg-light-accent dark:hover:bg-dark-accent transition"
              disabled={loading}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourseModal;