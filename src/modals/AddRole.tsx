import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AppDispatch, RootState } from "../store";
import { addRole, clearMessage } from "../features/roleSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddRoleModal = ({ isOpen, onClose }: AddRoleModalProps) => {
  const { register, handleSubmit, reset } = useForm<{ name: string }>();
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
  const { message, error } = useAppSelector((state) => state.roles);
  const dispatch = useAppDispatch();

  const onSubmit = async (data: { name: string }) => {
    await dispatch(addRole(data.name));
    reset();
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 border border-light-primary p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-semibold dark:text-dark-text mb-4">
          Add New Role
        </h2>
        {message && <p className="text-sm text-green-600 mb-4">{message}</p>}
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="form-group">
            <input
              {...register("name", { required: true })}
              placeholder="Enter role name"
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
              Add Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoleModal;
