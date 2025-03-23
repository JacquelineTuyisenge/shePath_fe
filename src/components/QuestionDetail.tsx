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
    // Check if the topic is defined
    if (!topic) {
        console.error("Topic not found");
        return; // Exit the function if topic is undefined
    }

    // Store the current topic ID before the action
    localStorage.setItem('currentTopicId', topic.id);

    // Determine if the topic is currently liked
    const isCurrentlyLiked = likedTopics.includes(topicId);
    
    // Optimistically update the like count in the UI
    const updatedLikesCount = isCurrentlyLiked ? topic.likes.length - 1 : topic.likes.length + 1;

    // Dispatch the local toggle action first to update the UI immediately
    dispatch(toggleLikeLocal(topicId));

    // Update the topic's likes count optimistically
    const updatedTopic = {
        ...topic,
        likes: updatedLikesCount,
    };

    // Then dispatch the async thunk to update the server
    dispatch(toggleLike({ topicId })).then((result) => {
        if (toggleLike.fulfilled.match(result)) {
            // Optionally handle success
            console.log("Like status updated successfully");
            window.location.reload(); // Reload the page
        } else {
            // Revert the optimistic update if the server call fails
            dispatch(toggleLikeLocal(topicId)); // Revert the optimistic update
            console.error("Failed to update like status:", result.error);
        }
    });
};

  const isLiked = likedTopics.includes(topicId); 

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="p-4 bg-light-background dark:bg-dark-background shadow-md rounded-lg">
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
                    <FaRegHeart className="text-2xl hover:text-3xl transform"/> {topic?.likes.length}
                  </button>
                </div>
                {topic?.comments?.length > 0 ? (
                  topic.comments.map((comment: any) => (
                    <div key={comment.id} className="bg-light-gray dark:bg-dark-gray text-light-text dark:text-light-gray p-4 mt-5 rounded-lg mb-2">
                      <p className="">{comment.content}</p>
                    </div>
                  ))
                ) : (
                  <p>No comments yet.</p>
                )}
              </div>
            </>
          ) : (
            <div className="bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text flex flex-col items-center justify-center h-full p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">No Topic Selected</h2>
            <p className="text-gray-500 mb-2">Please choose a topic to view its details.</p>
            <p className="mb-4">Explore the topics on the left sidebar.</p>
            <div className="flex flex-col items-center">
              <FaCommentDots className="text-4xl text-light-secondary mb-2" />
              <p className="text-gray-600">Ask a Question</p>
            </div>
            <div className="flex flex-col items-center mt-4">
              <FaRegHeart className="text-4xl text-light-secondary mb-2" />
              <p className="">Like a Topic</p>
            </div>
          </div>    
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