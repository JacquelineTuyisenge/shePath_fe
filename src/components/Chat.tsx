import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { getChats, sendChat } from '../features/chatSlice';
import { getProfile } from '../features/userSlice';
import dayjs from "dayjs";
import Loader from './Loader';

const formattedDate = (timestamp: string) => dayjs(timestamp).format("MMM D, YYYY");

const ChatUI = ({ mentorId }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { chats, status, error } = useSelector((state: RootState) => state.chats);
  const [newMessage, setNewMessage] = useState('');
  const { currentUser  } = useSelector((state: RootState) => state.users); 

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    // Fetch chat messages when the partner is selected
    dispatch(getChats(mentorId));
  }, [mentorId, dispatch]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
    if (!currentUser ) return;

    const chatData = {
      senderId: currentUser .id,
      receiverId: mentorId,
      content: newMessage,
    };

    const response = await dispatch(sendChat(chatData));
    console.log("Chat Sent Response:", response);
    setNewMessage('');
  };

  // Handle key down event for sending message
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Ensure chats is always an array
  const chatsArray = Array.isArray(chats) ? chats : [];

  // Group messages by date
  const groupedMessages = chatsArray.reduce((acc, message) => {
    const date = formattedDate(message.timestamp);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);
    return acc;
  }, {} as Record<string, typeof chatsArray>);

  return (
    <div className="flex flex-col h-full">
      {status === 'loading' && <Loader />}
      {error && <p className="text-red-500">Error: {error}</p>}
      <div className="overflow-y-auto h-96 border p-4">
        {Object.keys(groupedMessages).map(date => (
          <div key={date} className="mb-4">
            <h3 className="text-light-secondary text-center text-sm mb-2">{date}</h3>
            {groupedMessages[date].map(message => (
              message && message.id ? (
                <div key={message.id} className={`flex ${message.sender.id === currentUser ?.id ? 'justify-end' : 'justify-start'} mb-2`}>
                  <div className={`sm:max-w-[60%] p-3 rounded-lg ${message.sender.id === currentUser ?.id ? 'bg-light-secondary text-white' : 'bg-gray-200 text-black'}`}>
                    <p className="font-semibold">{message.sender.firstName}:</p>
                    <p className='w-full'>{message.content}</p>
                  </div>
                </div>
              ) : null
            ))}
          </div>
        ))}
      </div>
      <div className="flex mt-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown} // Add the key down event handler
          placeholder="Type your message..."
          className="border p-2 w-full rounded-lg dark:bg-dark-gray text"
        />
        <button onClick={handleSendMessage} className="bg-light-primary text-white p-2 rounded-lg ml-2">Send</button>
      </div>
    </div>
  );
};

export default ChatUI;