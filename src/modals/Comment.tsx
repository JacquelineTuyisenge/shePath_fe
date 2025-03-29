import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { createComment } from '../features/commentSlice';
import Toaster from '../components/Toaster';
import { isAuthenticated } from '../utils/utils';

interface CommentModalProps {
  topicId: string;
  onClose: () => void;
  onCommentAdded: (comment: any) => void;
}

const CommentModal: React.FC<CommentModalProps> = ({ topicId, onClose, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [toaster, setToaster] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      setToaster({ message: "Please log in to comment", type: "error" });
      return;
    }
    try {
      const result = await dispatch(createComment({ topicId, content })).unwrap();
      onCommentAdded(result); // Pass the new comment back to QuestionDetail
      setContent('');
      onClose();
    } catch (error) {
      setToaster({ message: "Failed to add comment", type: "error" });
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50 z-50">
      <div className="bg-white dark:bg-dark-background p-6 rounded-lg shadow-lg w-full max-w-md">
        {toaster && <Toaster message={toaster.message} type={toaster.type} />}
        <h2 className="text-xl font-semibold mb-4 text-light-text dark:text-dark-text">Add Comment</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded mt-2 bg-light-gray dark:bg-dark-gray text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your comment here..."
            rows={4}
            required
          />
          <div className="flex justify-end mt-4 gap-2">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-light-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentModal;