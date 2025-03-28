import Sidebar from "./Sidebar";
import QuestionDetail from "./QuestionDetail";
import AskQuestion from "./Ask";
import { Nav } from "./CommunityNav";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const TopicList = () => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAskQuestionOpen, setIsAskQuestionOpen] = useState(false);

  const topics = useSelector((state: RootState) => state.topics.topics);

  const filteredTopics = topics.filter(topic =>
    topic.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Background Content */}
      <div className="min-h-screen bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text p-6">
      <div
        className={`bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text flex-1 p-6 ${isAskQuestionOpen ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <Nav searchTerm={searchTerm} setSearchTerm={setSearchTerm} setIsAskQuestionOpen={setIsAskQuestionOpen} />
      </div>

      {isAskQuestionOpen && <AskQuestion setIsAskQuestionOpen={setIsAskQuestionOpen} />}

      <div className={`bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text flex flex-col h-screen w-full ${isAskQuestionOpen ? 'blur-md opacity-50 pointer-events-none' : ''}`}>
        <div className="flex flex-col md:flex-row h-screen w-full">
          <Sidebar setSelectedTopicId={setSelectedTopicId} filteredTopics={filteredTopics} />

          <div className={`flex-1 p-6 ${isAskQuestionOpen ? 'opacity-50 pointer-events-none' : ''}`}>
            {<QuestionDetail topicId={selectedTopicId} />}
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default TopicList;