import Sidebar from "./Sidebar";
import QuestionDetail from "./QuestionDetail";
import AskQuestion from "./Ask";
import { Nav } from "./CommunityNav";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Toaster from "./Toaster";
import { isAuthenticated } from "../utils/utils";
import { FaBars } from "react-icons/fa"; // For hamburger menu

const TopicList = () => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAskQuestionOpen, setIsAskQuestionOpen] = useState(false);
  const [toaster, setToaster] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle state

  const topics = useSelector((state: RootState) => state.topics.topics);
  const filteredTopics = topics.filter(topic =>
    topic.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text">
      <Nav 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        setIsAskQuestionOpen={(value) => {
          if (!isAuthenticated()) {
            setToaster({ message: "Please log in to ask a question", type: "error" });
            return;
          }
          setIsAskQuestionOpen(value);  
        }} 
      />
      {toaster && <Toaster message={toaster.message} type={toaster.type} />}

      {isAskQuestionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg mx-4">
            <AskQuestion setIsAskQuestionOpen={setIsAskQuestionOpen} />
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row w-full">
        {/* Toggle Button for Small Screens */}
        <button 
          className="lg:hidden p-4 text-orange-500" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <FaBars className="text-2xl" />
        </button>

        {/* Sidebar - Collapsible on small screens */}
        <div className={`lg:w-1/4 w-full ${isSidebarOpen ? "block" : "hidden"} lg:block`}>
          <Sidebar setSelectedTopicId={setSelectedTopicId} filteredTopics={filteredTopics} />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6">
          <QuestionDetail topicId={selectedTopicId} />
        </div>
      </div>
    </div>
  );
};

export default TopicList;