import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { getChats, sendChat } from "../features/chatSlice";
import { getProfile } from "../features/userSlice";
import dayjs from "dayjs";
import Loader from "./Loader";

const ChatUI = ({ mentorId }: { mentorId: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { chats, status, error } = useSelector((state: RootState) => state.chats);
  const { currentUser } = useSelector((state: RootState) => state.users);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (mentorId) {
      dispatch(getChats(mentorId));
      // Polling for real-time updates (every 5 seconds)
      const interval = setInterval(() => {
        dispatch(getChats(mentorId));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [mentorId, dispatch]);

  useEffect(() => {
    // Scroll to the bottom when chats update
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;

    const chatData = {
      senderId: currentUser.id,
      receiverId: mentorId,
      content: newMessage,
    };

    const tempMessage = {
      id: `temp-${Date.now()}`,
      sender: { id: currentUser.id, firstName: currentUser.firstName, lastName: currentUser.lastName },
      receiver: { id: mentorId, firstName: "", lastName: "" },
      content: newMessage,
      createdAt: new Date().toISOString(), // Use createdAt as per your structure
    };
    dispatch({ type: "chats/addChat", payload: tempMessage });

    setNewMessage("");
    const response = await dispatch(sendChat(chatData));
    if (sendChat.rejected.match(response)) {
      dispatch({ type: "chats/removeChat", payload: tempMessage.id });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const chatsArray = Array.isArray(chats) ? chats : [];
  const groupedMessages = chatsArray.reduce((acc, message) => {
    const date = dayjs(message.createdAt).format("MMM D, YYYY"); // Use createdAt
    if (!acc[date]) acc[date] = [];
    acc[date].push(message);
    return acc;
  }, {} as Record<string, typeof chatsArray>);

  return (
    <div className="flex flex-col h-full bg-light-gray dark:bg-dark-gray rounded-lg shadow-md p-4">
      {status === "loading" && chatsArray.length === 0 && <Loader />}
      {error && <p className="text-red-500 text-center">Error: {error}</p>}

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto max-h-[400px] p-4 bg-white dark:bg-dark-background rounded-t-lg" // Adjusted height
      >
        {Object.keys(groupedMessages).length > 0 ? (
          Object.keys(groupedMessages).map((date) => (
            <div key={date} className="mb-4">
              <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                <span className="bg-light-gray dark:bg-dark-gray px-2 py-1 rounded">{date}</span>
              </div>
              {groupedMessages[date]
                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) // Sort by createdAt
                .map((message) =>
                  message && message.id ? (
                    <div
                      key={message.id}
                      className={`flex mb-3 ${
                        message.sender.id === currentUser?.id ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
                          message.sender.id === currentUser?.id
                            ? "bg-light-primary text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-black dark:text-dark-text"
                        }`}
                      >
                        <p className="text-sm font-semibold">{message.sender.firstName}</p>
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs text-gray-300 dark:text-gray-400 mt-1">
                          {dayjs(message.createdAt).format("h:mm A")}
                        </p>
                      </div>
                    </div>
                  ) : null
                )}
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-300 text-center mt-4">No messages yet. Start the conversation!</p>
        )}
      </div>

      <div className="flex items-center mt-4 p-2 bg-white dark:bg-dark-background rounded-b-lg">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-dark-gray dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-primary"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 px-4 py-2 bg-light-primary text-white rounded-lg hover:bg-orange-600 transition"
          disabled={!newMessage.trim() || status === "loading"}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatUI;