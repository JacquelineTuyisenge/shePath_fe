import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { getChats } from "../features/chatSlice";
import { useEffect, useRef, useCallback } from "react";

interface ConversationsListProps {
  onSelectPartner: (partnerId: string) => void;
  selectedPartnerId?: string | null; // Optional prop for highlighting
}

const ConversationsList = ({ onSelectPartner, selectedPartnerId }: ConversationsListProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { chats, status } = useSelector((state: RootState) => state.chats);
  const { currentUser } = useSelector((state: RootState) => state.users);
  const convListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentUser) {
      dispatch(getChats(currentUser.id));
    }
  }, [dispatch]);

  const scrollToPartner = useCallback(() => {
    if (selectedPartnerId && convListRef.current) {
      const selectedElement = convListRef.current.querySelector(`[data-partner-id="${selectedPartnerId}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [selectedPartnerId]);

  useEffect(() => {
    scrollToPartner();
  }, [selectedPartnerId, scrollToPartner]);

  const chatsArray = Array.isArray(chats) ? chats : [];
  const partners = chatsArray
    .filter((chat) => chat.receiver?.id === currentUser?.id)
    .map((chat) => chat.sender);
  const uniquePartners = [...new Map(partners.map((partner) => [partner.id, partner])).values()];

  return (
    <div
      ref={convListRef}
      className="conversations-list p-4 h-full overflow-y-auto bg-light-background dark:bg-dark-background"
    >
      {status === "loading" && ''}
      {uniquePartners.length === 0 && (
        <p className="text-gray-600 dark:text-gray-300 text-center mt-4">No conversations found.</p>
      )}
      {uniquePartners.map((partner) => {
        const isSelected = selectedPartnerId === partner.id;
        return (
          <div
            key={partner.id}
            data-partner-id={partner.id}
            className={`flex items-center p-4 rounded-lg shadow-md cursor-pointer transition transform hover:-translate-y-1 ${
              isSelected
                ? "bg-light-primary text-white"
                : "bg-light-gray dark:bg-dark-gray hover:bg-light-secondary dark:hover:bg-gray-700"
            }`}
            onClick={() => onSelectPartner(partner.id)}
          >
            <img
              src={partner.profile || "/square.png"}
              alt={`${partner.firstName} ${partner.lastName}`}
              className="w-12 h-12 rounded-full object-cover border-2 border-light-primary mr-4"
            />
            <div className="flex-1">
              <p className="text-lg font-semibold">{partner.firstName} {partner.lastName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Ongoing Chat</p>
            </div>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                isSelected ? "bg-white text-light-primary hover:bg-gray-100" : "bg-light-primary text-white hover:bg-orange-600"
              }`}
            >
              Open Chat
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationsList;