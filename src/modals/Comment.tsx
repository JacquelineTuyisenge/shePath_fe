import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { createComment } from '../features/commentSlice';

interface CommentModalProps {
  topicId: string;
  onClose: () => void;
}

const CommentModal: React.FC<CommentModalProps> = ({ topicId, onClose }) => {
  const [content, setContent] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createComment({ topicId, content }));
    setContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl mb-4">Add Comment</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full p-2 border rounded mt-2"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your comment here..."
            required
          />
          <div className="flex justify-end mt-4">
            <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded mr-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="bg-light-primary text-white px-4 py-2 rounded">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentModal;