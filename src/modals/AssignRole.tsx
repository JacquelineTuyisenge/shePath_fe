import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AppDispatch, RootState } from "../store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { assignRole, getRoles, clearMessage } from "../features/roleSlice";
import Toaster from "../components/Toaster";

interface AssignRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onRoleAssigned?: (userId: string, role: string) => void; // Optional, but not needed if thunk updates state
}

const AssignRoleModal = ({ isOpen, onClose, user }: AssignRoleModalProps) => {
  const { handleSubmit, reset } = useForm();
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
  const [toaster, setToaster] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const dispatch = useAppDispatch();
  const roles = useAppSelector((state) => state.roles.roles);
  const { message, error } = useAppSelector((state) => state.roles);

  const [selectedRole, setSelectedRole] = useState(user?.role || "");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    dispatch(getRoles());
  }, [dispatch]);

  const onSubmit = async () => {
    if (selectedRole) {
      setIsSubmitted(true);
      const result = await dispatch(assignRole({ userId: user.id, role: selectedRole }));
      if (assignRole.fulfilled.match(result)) {
        setToaster({ message: "Role assigned successfully!", type: "success" });
        reset();
        setTimeout(() => {
          dispatch(clearMessage());
          onClose();
        }, 2000);
      } else {
        setToaster({ message: result.payload as string || "Failed to assign role", type: "error" });
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      dispatch(clearMessage());
      setToaster(null);
      setIsSubmitted(false);
      setSelectedRole(user?.role || ""); // Reset to current role
    }
  }, [isOpen, dispatch, user]);

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
        <h2 className="text-2xl font-semibold text-primary dark:text-dark-text mb-4">
          Assign Role
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="form-group">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            >
              <option value="" disabled>
                Select a role
              </option>
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
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
              Assign Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignRoleModal;