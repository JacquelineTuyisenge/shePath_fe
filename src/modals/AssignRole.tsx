import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AppDispatch, RootState } from "../store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { assignRole, getRoles, clearMessage } from "../features/roleSlice";


interface AssignRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
}

const AssignRoleModal = ({ isOpen, onClose, user }: AssignRoleModalProps) => {
    const { handleSubmit, reset } = useForm();
    
    const useAppDispatch = () => useDispatch<AppDispatch>();
    const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
  
    const dispatch = useAppDispatch();
    const roles = useAppSelector((state) => state.roles.roles); //roles from store, and real roles 

    const { message, error } = useAppSelector((state) => state.roles);

  const [selectedRole, setSelectedRole] = useState(user?.role || "");

  useEffect(() => {
    dispatch(getRoles()); // Fetch roles when the modal opens
  }, [dispatch]);

  const onSubmit = async () => {
    if (selectedRole) {
      await dispatch(assignRole({ userId: user.id, role: selectedRole }));
    }
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
    <div className="fixed inset-0 bg-opacity-90 flex justify-center items-center">
      <div className="dark:bg-dark-gray border border-light-primary p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Assign Role</h2>
        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="block mb-2">Select Role</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full p-2 border rounded mb-4 text-black border-none"
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

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="bg-gray-300 p-2 rounded">
              Cancel
            </button>
            <button type="submit" className="bg-dark-secondary text-white p-2 rounded">
              Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignRoleModal;
