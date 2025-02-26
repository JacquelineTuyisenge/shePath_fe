import react, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {AppDispatch, RootState} from "../store";
import {addRole, clearMessage} from "../features/roleSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { on } from "events";

interface AddRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddRoleModal = ({isOpen, onClose}: AddRoleModalProps) => {
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
    <div className="fixed inset-0 bg-opacity-90 flex justify-center items-center">
      <div className="dark:bg-dark-gray border border-light-primary p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add New Role</h2>
        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("name", { required: true })}
            placeholder="Enter role name"
            className="w-full p-2 border rounded mb-4 text-black border-none"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="bg-gray-300 p-2 rounded">
              Cancel
            </button>
            <button type="submit" className="bg-dark-secondary text-white p-2 rounded">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoleModal;
