import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMentors } from "../features/mentorSlice";
import { AppDispatch, RootState } from "../store";
import Loader from "./Loader";

interface MentorListProps {
  onSelectMentor: (mentorId: string) => void;
  selectedMentorId: string | null;
}

const MentorList = ({ onSelectMentor, selectedMentorId }: MentorListProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { mentors, status: mentorStatus, error: mentorError } = useSelector(
    (state: RootState) => state.mentors
  );
  const { chats, status: chatStatus, error: chatError } = useSelector(
    (state: RootState) => state.chats
  );

  useEffect(() => {
    dispatch(getMentors());
  }, [dispatch]);

  return (
    <div className="mentor-list p-4">
      {mentorStatus === "loading" && <Loader />}
      {mentorError && <p className="text-red-500">Error: {mentorError}</p>}

      {mentorStatus === "succeeded" && mentors.length > 0 ? (
        mentors.map((mentor) => {
          // Ensure chats is an array and check if a chat exists for the mentor.
          const chatExists = Array.isArray(chats)
          ? chats.some((chat) => chat.receiver && chat.receiver.id === mentor.id)
          : false;
        
          const isSelected = selectedMentorId === mentor.id;

          return (
            <div
              key={mentor.id}
              className={`mentor-item border p-4 my-2 rounded-md cursor-pointer ${
                isSelected
                  ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                  : "bg-white dark:bg-gray-800"
              }`}
            >
              <div className="text-center justify-center items-center">
                <p>{mentor.firstName} {mentor.lastName}</p>
                <div className="justify-center items-center"><img 
                    src={mentor.profile || '/square.png'} 
                    className="w-10 h-10 rounded-full"
                /></div>

              </div>
              <button
                className="mt-2 p-2 bg-dark-accent text-white rounded hover:bg-light-primary"
                onClick={() => onSelectMentor(mentor.id)}
              >
                {chatExists ? "Open Chat" : "Start Chat"}
              </button>
            </div>
          );
        })
      ) : (
        <p className="text-gray-600">No mentors available or still loading.</p>
      )}

      {chatStatus === "loading" && <p className="text-gray-600">Loading chats...</p>}
      {chatError && <p className="text-red-500">Error: {chatError}</p>}
    </div>
  );
};

export default MentorList;
