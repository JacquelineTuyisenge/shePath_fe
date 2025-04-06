import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { useEffect, useState } from "react";
import { fetchSingleTopic, updateTopic, deleteTopic } from "../features/topicSlice";
import { getProfile } from "../features/userSlice";
import Loader from "./Loader";
import Toaster from "./Toaster";
import { FaCommentDots, FaRegHeart, FaHeart } from "react-icons/fa";
import { isAuthenticated } from "../utils/utils";
import CommentModal from "../modals/Comment";
import { toggleLike, toggleLikeLocal } from "../features/likeSlice";

const Modal = ({ onClose, onConfirm, message }: { onClose: () => void; onConfirm: () => void; message: string }) => (
  <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50 z-50">
    <div className="bg-white dark:bg-dark-background p-6 rounded-lg shadow-lg">
      <h2 className="text-xl mb-4 text-light-text dark:text-dark-text">{message}</h2>
      <button onClick={onConfirm} className="bg-red-500 text-white px-4 py-2 rounded">Confirm</button>
      <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded ml-2">Cancel</button>
    </div>
  </div>
);

const QuestionDetail = ({ topicId }: { topicId: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { topics, loading } = useSelector((state: RootState) => state.topics);
  const { currentUser } = useSelector((state: RootState) => state.users);
  const { likedTopics } = useSelector((state: RootState) => state.likes);
  const [isCommentModalOpen, setCommentModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [isEditing, setEditing] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [showAllComments, setShowAllComments] = useState(false);
  const [toaster, setToaster] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isAuth, setIsAuth] = useState<boolean | null>(null); // Add auth state

  const topic = topics.find((t) => t.id === topicId);

  useEffect(() => {
    if (topicId) {
      dispatch(fetchSingleTopic(topicId));
      dispatch(getProfile());
    }
  }, [dispatch, topicId]);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await isAuthenticated();
      setIsAuth(authStatus);
    };
    checkAuth();
  }, []);

  const handleEdit = () => {
    if (topic) {
      setEditing(true);
      setEditContent(topic.content);
      setNewImage(null);
    }
  };

  const handleDelete = () => setDeleteModalOpen(true);

  const confirmDelete = () => {
    dispatch(deleteTopic(topicId)).then((result) => {
      if (deleteTopic.fulfilled.match(result)) {
        setToaster({ message: "Topic deleted successfully!", type: "success" });
        setDeleteModalOpen(false);
        // Optionally, redirect or clear the topic view after a delay
        setTimeout(() => {
          // e.g., window.location.href = "/community";
        }, 2000);
      } else {
        setToaster({ message: "Failed to delete topic", type: "error" });
        setDeleteModalOpen(false);
      }
    });
  };

  const handleUpdate = () => {
    if (topic) {
      dispatch(updateTopic({ id: topic.id, content: editContent, imageUrl: newImage }));
      setEditing(false);
      setNewImage(null);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setNewImage(e.target.files[0]);
  };

  const handleToggleComments = () => setShowAllComments(!showAllComments);

  const handleToggleLike = async () => {
    if (isAuth === null) {
      setToaster({ message: "Checking authentication, please wait...", type: "error" });
      return;
    }
    if (!isAuth) {
      setToaster({ message: "Please log in to like topics", type: "error" });
      return;
    }
    if (!topic) return;

    const isCurrentlyLiked = likedTopics.includes(topicId);
    dispatch(toggleLikeLocal(topicId)); // Optimistic update

    try {
      const result = await dispatch(toggleLike({ topicId })).unwrap();
      if (result) {
        console.log('liked')
      };
      dispatch(fetchSingleTopic(topicId));
      setToaster({ message: isCurrentlyLiked ? "Unliked!" : "Liked!", type: "success" });
    } catch (error) {
      dispatch(toggleLikeLocal(topicId)); // Revert optimistic update on failure
      setToaster({ message: "Failed to update like", type: "error" });
    }
  };

  const handleOpenCommentModal = () => {
    if (isAuth === null) {
      setToaster({ message: "Checking authentication, please wait...", type: "error" });
      return;
    }
    if (!isAuth) {
      setToaster({ message: "Please log in to comment", type: "error" });
      return;
    }
    setCommentModalOpen(true);
  };

  const addComment = (newComment: any) => {
    if (topic) {
      const updatedComments = [...topic.comments, newComment];
      dispatch(updateTopic({ id: topicId, content: topic.content, comments: updatedComments } as any));
    }
    dispatch(fetchSingleTopic(topicId));
  };

  const isLiked = likedTopics.includes(topicId);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen p-4 bg-light-background dark:bg-dark-background shadow-md rounded-lg">
          {toaster && (
            <Toaster
              message={toaster.message}
              type={toaster.type}
              onClose={() => setToaster(null)}
            />
          )}
          {topic ? (
            <>
              <h1 className="text-2xl font-semibold text-light-text dark:text-dark-text">{topic.content}</h1>
              <div className="flex justify-between items-center mt-4">
                <p className="text-gray-600 dark:text-gray-400">Written by: {topic?.user?.userName || "Default"}</p>
                {currentUser?.id === topic.userId && (
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
                  <img src={topic.imageUrl} alt="Topic Image" className="w-full h-auto max-h-96 object-cover rounded-lg" />
                </div>
              )}
              {isEditing && (
                <div className="mt-4">
                  <textarea
                    className="w-full p-2 border rounded mt-2 bg-light-gray dark:bg-dark-gray text-light-text dark:text-dark-text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    maxLength={500}
                    placeholder="Edit your content here..."
                  />
                  <input
                    type="file"
                    className="w-full p-2 border rounded mt-2 bg-light-gray dark:bg-dark-gray text-light-text dark:text-dark-text"
                    onChange={handleImageChange}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleUpdate}
                      className="bg-light-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-opacity-90 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Like and Comment Section */}
              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={handleOpenCommentModal}
                  className="flex items-center gap-2 text-light-secondary dark:text-dark-text hover:text-orange-500 transition-colors"
                  disabled={isAuth === null} // Disable while auth is being checked
                >
                  <FaCommentDots className="text-2xl" />
                  <span className="font-semibold">{topic.comments.length}</span>
                </button>
                <button
                  onClick={handleToggleLike}
                  className={`flex items-center gap-2 transition-colors ${
                    isLiked ? "text-red-500" : "text-light-secondary dark:text-dark-text"
                  } hover:text-red-400`}
                  disabled={isAuth === null} // Disable while auth is being checked
                >
                  {isLiked ? <FaHeart className="text-2xl" /> : <FaRegHeart className="text-2xl" />}
                  <span className="font-semibold">{topic.likes.length}</span>
                </button>
              </div>

              {/* Comments Display */}
              <div className="mt-4 bg-light-gray dark:bg-dark-gray p-4 rounded-lg">
                {topic.comments.length > 0 ? (
                  <>
                    {topic.comments
                      .slice(0, showAllComments ? topic.comments.length : 3)
                      .map((comment: any) => (
                        <div
                          key={comment.id}
                          className="mb-2 border-b border-gray-300 dark:border-gray-600 pb-2"
                        >
                          <p className="text-light-text dark:text-dark-text">{comment.content}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            By: {comment.user?.userName || (currentUser?.id === comment.userId ? currentUser?.firstName : "Anonymous")}
                          </p>
                        </div>
                      ))}
                    {topic.comments.length > 3 && (
                      <button onClick={handleToggleComments} className="text-orange-500 hover:underline mt-2">
                        {showAllComments ? "Show Less" : "Show More"}
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No comments yet.</p>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-light-text dark:text-dark-text">
              <h2 className="text-xl font-semibold mb-4">No Topic Selected</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-2">Please choose a topic to view its details.</p>
              <p className="mb-4">Explore the topics on the left sidebar.</p>
              <div className="flex flex-col items-center">
                <FaCommentDots className="text-4xl text-light-secondary dark:text-dark-text mb-2" />
                <p className="text-gray-600 dark:text-gray-400">Ask a Question</p>
              </div>
              <div className="flex flex-col items-center mt-4">
                <FaRegHeart className="text-4xl text-light-secondary dark:text-dark-text mb-2" />
                <p className="text-gray-600 dark:text-gray-400">Like a Topic</p>
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
        <CommentModal topicId={topicId} onClose={() => setCommentModalOpen(false)} onCommentAdded={addComment} />
      )}
    </>
  );
};

export default QuestionDetail;