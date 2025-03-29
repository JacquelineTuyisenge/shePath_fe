import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AppDispatch, RootState } from "../store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { addRole, clearMessage } from "../features/roleSlice";
import Toaster from "../components/Toaster";

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleAdded?: (newRole: { id: string; name: string }) => void; // Callback to update parent state
}

const AddRoleModal = ({ isOpen, onClose, onRoleAdded }: AddRoleModalProps) => {
  const { register, handleSubmit, reset } = useForm<{ name: string }>();
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
  const [toaster, setToaster] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const { message, error } = useAppSelector((state) => state.roles);
  const dispatch = useAppDispatch();

  const onSubmit = async (data: { name: string }) => {
    const tempId = `temp-${Date.now()}`; // Temporary ID for optimistic update
    if (onRoleAdded) {
      onRoleAdded({ id: tempId, name: data.name }); // Optimistically update parent
    }

    const result = await dispatch(addRole(data.name));
    if (addRole.fulfilled.match(result)) {
      setToaster({ message: "Role added successfully!", type: "success" });
      reset();
      setTimeout(() => {
        dispatch(clearMessage());
        onClose();
      }, 2000);
    } else {
      setToaster({ message: result.payload as string || "Failed to add role", type: "error" });
      if (onRoleAdded) {
        // Revert optimistic update if needed (e.g., remove temp role from parent state)
        // This requires a revert callback, omitted here for simplicity
      }
    }
  };

  useEffect(() => {
    if (message && !toaster) {
      setToaster({ message, type: "success" });
    } else if (error && !toaster) {
      setToaster({ message: error, type: "error" });
    }
  }, [message, error, toaster]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 border border-light-primary p-8 rounded-lg shadow-lg max-w-lg w-full">
        {toaster && (
          <Toaster
            message={toaster.message}
            type={toaster.type}
            onClose={() => setToaster(null)}
          />
        )}
        <h2 className="text-2xl font-semibold dark:text-dark-text mb-4">
          Add New Role
        </h2>
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