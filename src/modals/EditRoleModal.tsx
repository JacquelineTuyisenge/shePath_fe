import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AppDispatch, RootState } from "../store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { updateRole, clearMessage } from "../features/roleSlice";
import Toaster from "../components/Toaster";

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: any;
  onRoleUpdated?: (updatedRole: { id: string; name: string }) => void;
}

const EditRoleModal = ({ isOpen, onClose, role, onRoleUpdated }: EditRoleModalProps) => {
  const { register, handleSubmit, reset } = useForm<{ name: string }>({
    defaultValues: { name: role?.name },
  });
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
  const [toaster, setToaster] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const { message, error } = useAppSelector((state) => state.roles);
  const dispatch = useAppDispatch();

  // Track whether the form was submitted to control toaster display
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = async (data: { name: string }) => {
    setIsSubmitted(true); // Mark as submitted to allow toaster
    if (onRoleUpdated) {
      onRoleUpdated({ id: role.id, name: data.name }); // Optimistic update
    }

    const result = await dispatch(updateRole({ id: role.id, name: data.name }));
    if (updateRole.fulfilled.match(result)) {
      setToaster({ message: "Role updated successfully!", type: "success" });
      reset();
      setTimeout(() => {
        dispatch(clearMessage());
        onClose();
      }, 2000);
    } else {
      setToaster({ message: result.payload as string || "Failed to update role", type: "error" });
    }
  };

  // Clear stale messages when modal opens and reset submission state
  useEffect(() => {
    if (isOpen) {
      dispatch(clearMessage()); // Clear any existing message/error on open
      setToaster(null); // Reset toaster
      setIsSubmitted(false); // Reset submission state
    }
  }, [isOpen, dispatch]);

  // Only show toaster for new feedback after submission
  useEffect(() => {
    if (isSubmitted) {
      if (message) {
        setToaster({ message, type: "success" });
      } else if (error) {
        setToaster({ message: error, type: "error" });
      }
    }
  }, [message, error, isSubmitted]);

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
          Edit Role
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
              className="px-4 py-2 text-sm text-white font-medium bg-light-primary rounded-md hover:bg-accent focus:outline-none"
            >
              Edit Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoleModal;