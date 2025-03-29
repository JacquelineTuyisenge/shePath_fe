import { useEffect, useRef, useCallback } from "react";
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
  const { mentors, status: mentorStatus, error: mentorError } = useSelector((state: RootState) => state.mentors);
  const { chats } = useSelector((state: RootState) => state.chats);
  const mentorListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(getMentors());
  }, [dispatch]);

  const scrollToMentor = useCallback(() => {
    if (selectedMentorId && mentorListRef.current) {
      const selectedElement = mentorListRef.current.querySelector(`[data-mentor-id="${selectedMentorId}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [selectedMentorId]);

  useEffect(() => {
    scrollToMentor();
  }, [selectedMentorId, scrollToMentor]);

  return (
    <div
      ref={mentorListRef}
      className="mentor-list p-4 h-full overflow-y-auto bg-light-background dark:bg-dark-background"
    >
      {mentorStatus === "loading" && <Loader />}
      {mentorError && <p className="text-red-500 text-center">Error: {mentorError}</p>}

      {mentorStatus === "succeeded" && mentors.length > 0 ? (
        <div className="space-y-4">
          {mentors.map((mentor) => {
            const chatExists = Array.isArray(chats) && chats.some((chat) => chat.receiver?.id === mentor.id);
            const isSelected = selectedMentorId === mentor.id;

            return (
              <div
                key={mentor.id}
                data-mentor-id={mentor.id}
                className={`flex flex-col sm:flex-row items-center p-4 rounded-lg shadow-md cursor-pointer transition transform hover:-translate-y-1 ${
                  isSelected
                    ? "bg-light-primary text-white"
                    : "bg-light-gray dark:bg-dark-gray hover:bg-light-secondary dark:hover:bg-gray-700"
                }`}
                onClick={() => onSelectMentor(mentor.id)}
              >
                <img
                  src={mentor.profile || "/square.png"}
                  alt={`${mentor.firstName} ${mentor.lastName}`}
                  className="w-12 h-12 rounded-full object-cover border-2 border-light-primary mr-4"
                />

                <div className="flex-1">
                  <p className="text-lg mb-2 font-semibold">{mentor.firstName} {mentor.lastName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{mentor.address || 'USA'}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{mentor.email || 'USA'}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{mentor.phoneNumber}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {chatExists ? "Ongoing Chat" : "Available"}
                  </p>
                </div>

                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isSelected
                      ? "bg-white text-light-primary hover:bg-gray-100"
                      : "bg-light-primary text-white hover:bg-orange-600"
                  }`}
                >
                  {chatExists ? "Open Chat" : "Start Chat"}
                </button>

              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-300 text-center mt-4">No mentors available.</p>
      )}
    </div>
  );
};

export default MentorList;