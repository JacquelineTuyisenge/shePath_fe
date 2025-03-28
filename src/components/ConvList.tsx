import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { getChats } from '../features/chatSlice';
import { useEffect } from 'react';

interface ConversationsListProps {
  onSelectPartner: (partnerId: string) => void;
}

const ConversationsList = ({ onSelectPartner }: ConversationsListProps) => {
  const dispatch = useDispatch<AppDispatch>();  
  const { chats, status } = useSelector((state: RootState) => state.chats);
  const { currentUser  } = useSelector((state: RootState) => state.users);
  console.log("current user in mentor dash:  ", currentUser);

  useEffect(() => {
    if (currentUser ) {
      dispatch(getChats(currentUser.id)); // Fetch chats for the current user
    }
  }, [dispatch, currentUser ]);

  console.log("Real Chatssss",  chats);
  // Ensure chats is an array.
  const chatsArray = Array.isArray(chats) ? chats : [];
  console.log('Chataaaaasss', chatsArray);

  // Filter partners where the receiverId matches the currentUser 's ID

//   const chatExists = Array.isArray(chats)
//   ? chats.some((chat) => chat.receiver && chat.receiver.id === mentor.id)
//   : false;

  const partners = chatsArray
    .filter(chat => chat.receiver && chat.receiver.id === currentUser?.id) // Check if the current user is the receiver
    .map(chat => chat.sender); // Get the sender as the partner

    console.log("Partnerrrrrrssssss", partners);

    const uniquePartners = partners.filter((partner, index, self) =>
        index === self.findIndex((p) => p.id === partner.id)
      );
    console.log("Unique Partnerrrrrrssssss", uniquePartners);

  return (
    <div className="conversations-list">
      {status === 'loading' && <p>Loading conversations...</p>}
      {uniquePartners.length === 0 && <p>No conversations found.</p>}
      {uniquePartners.map((partner: any) => (
        <div
          key={partner.id}
          className="conversation-item hover:text-white border p-2 my-1 rounded cursor-pointer hover:bg-light-secondary"
          onClick={() => onSelectPartner(partner.id)}
        >
          <p className="font-bold">{partner.firstName} {partner.lastName}</p>
        </div>
      ))}
    </div>
  );
};

export default ConversationsList;