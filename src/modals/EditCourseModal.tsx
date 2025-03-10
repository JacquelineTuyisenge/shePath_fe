import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { Editor } from "@tinymce/tinymce-react";
import { updateCourse, clearMessage } from "../features/courseSlice";
import { AppDispatch, RootState } from "../store";

interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: any;
}

const EditCourseModal = ({ isOpen, onClose, course }: EditCourseModalProps) => {
  const { register, handleSubmit, reset, setValue } = useForm<{ 
    title: string; 
    description: string; 
    content: string; 
  }>({
    defaultValues: { 
      title: course?.title, 
      description: course?.description, 
      content: course?.content
    }
  });

  const useAppDispatch = () => useDispatch<AppDispatch>();
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
  const { message, error } = useAppSelector((state) => state.courses);
  const dispatch = useAppDispatch();

  const onSubmit = async (data: { title: string; description: string; content: string }) => {
    try {
        await dispatch(updateCourse({
            id: course.id,
            title: data.title,
            description: data.description,
            content: data.content,
        }));
        reset();  // Reset form after successful update
    } catch (err) {
        // Handle any errors during the update
    }

  };

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        dispatch(clearMessage());
        onClose();
      }, 2000);
    }
  }, [message, dispatch, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="dark:bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Course</h2>
        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("title", { required: true })}
            placeholder="Course Title"
            className="w-full p-2 border rounded mb-4 text-black"
          />
          <input
            {...register("description", { required: true })}
            placeholder="Course Description"
            className="w-full p-2 border rounded mb-4 text-black"
          />
          <Editor
            apiKey="t8uuywazitnms1i0ekktzks3xhzj16udserdmpfvqnxajsq2"
            initialValue={course?.content}
            init={{
              height: 300,
              menubar: false,
              plugins: ["lists link image code"]
            }}
            onEditorChange={(content: string) => setValue("content", content)}
          />
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="bg-gray-300 p-2 rounded">
              Cancel
            </button>
            <button type="submit" className="bg-light-primary text-white p-2 rounded">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourseModal;
