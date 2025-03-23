import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { useEffect, useState } from 'react';
import { fetchSingleTopic, updateTopic, deleteTopic } from '../features/topicSlice';
import { getProfile } from "../features/userSlice";
import Loader from "./Loader";
import { FaCommentDots, FaRegHeart } from "react-icons/fa";
import CommentModal from "../modals/Comment";
import { toggleLike, toggleLikeLocal } from "../features/likeSlice";

// Modal Component
const Modal = ({ onClose, onConfirm, message }: { onClose: () => void, onConfirm: () => void, message: string }) => (
  <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl mb-4">{message}</h2>
      <button onClick={onConfirm} className="bg-red-500 text-white px-4 py-2 rounded">Confirm</button>
      <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded ml-2">Cancel</button>
    </div>
  </div>
);

const QuestionDetail = ({ topicId }: { topicId: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { topics, loading } = useSelector((state: RootState) => state.topics);
  const { currentUser  } = useSelector((state: RootState) => state.users);
  const [isCommentModalOpen, setCommentModalOpen] = useState(false);  
  const { likedTopics } = useSelector((state: RootState) => state.likes); 
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isEditing, setEditing] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);

  const topic = topics.find(t => t.id === topicId);

  useEffect(() => {
    if (topicId) {
      dispatch(fetchSingleTopic(topicId));
      dispatch(getProfile()); 
    }
  }, [dispatch, topicId]);

  const handleEdit = () => {
    if (topic) {
      setEditing(true);
      setEditContent(topic.content);
      setNewImage(null); // Reset new image when editing starts
    }
  };

  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    dispatch(deleteTopic(topicId)).then(() => {
      window.location.reload(); // Reload the page to reflect changes
    });
    setDeleteModalOpen(false);
  };
  
  const handleUpdate = () => {
    if (topic) {
      dispatch(updateTopic({ id: topic.id, content: editContent, imageUrl: newImage })); // Pass newImage here
      setEditing(false);
      setNewImage(null); // Reset new image after update
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleToggleLike = () => {
    // Dispatch the local toggle action first to update the UI immediately
    dispatch(toggleLikeLocal(topicId));
    
    // Then dispatch the async thunk to update the server
    dispatch(toggleLike({ topicId }));
  };

  const isLiked = likedTopics.includes(topicId); 

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="p-4 bg-white shadow-md rounded-lg">
          {topic ? (
            <>
              <h1 className="text-2xl font-semibold">{topic.content}</h1>
              <div className="flex justify-between items-center mt-4">
                <p className="text-gray-600">Written by: {topic?.user?.userName || 'Default'}</p>
                {currentUser ?.id === topic.userId && (
                  <div>
                    <button onClick={handleEdit} className="mr-2 text-blue-500 hover:underline">
                      Edit
                    </button>
                    <button onClick={handleDelete} className="text-red-500 hover:underline">
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {topic.imageUrl && (
                <div className="mt-4">
                  <img src={topic.imageUrl} alt="Topic Image" className="w-full max-h-96 rounded-lg" />
                </div>
              )}

              {isEditing && (
                <div className="mt-4">
                  <textarea
                    className="w-full p-2 border rounded mt-2"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    maxLength={500}
                    placeholder="Edit your content here..."
                  />
                  <input
                    type="file"
                    className="w-full p-2 border rounded mt-2"
                    onChange={handleImageChange}
                  />
                  <button
                    onClick={handleUpdate}
                    className="bg-light-primary text-white px-4 py-2 rounded mt-2"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded mt-2 ml-2"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Comments Section */}
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => setCommentModalOpen(true)}
                    className="font-semibold flex gap-2">
                    <FaCommentDots className="text-2xl text-light-secondary"/> {topic?.comments.length}
                  </button>
                  <button 
                    onClick={handleToggleLike} 
                    className={`font-semibold flex gap-2 ${isLiked ? 'text-red-500' : 'text-light-secondary'}`}>
                    <FaRegHeart className="text-2xl transform"/> {topic?.likes.length}
                  </button>
                </div>
                {topic?.comments?.length > 0 ? (
                  topic.comments.map((comment: any) => (
                    <div key={comment.id} className="bg-gray-100 p-4 rounded-lg mb-2">
                      <p className="text-gray-600">{comment.content}</p>
                    </div>
                  ))
                ) : (
                  <p>No comments yet.</p>
                )}
              </div>
            </>
          ) : (
            <p>Topic not found</p>
          )}
        </div>
      )}

      {isDeleteModalOpen && (
        <Modal
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          message="Are you sure you want to delete this topic?"
        />
      )}
      {isCommentModalOpen && (
        <CommentModal topicId={topicId} onClose={() => setCommentModalOpen(false)} />
      )}
    </>
  );
};

export default QuestionDetail;