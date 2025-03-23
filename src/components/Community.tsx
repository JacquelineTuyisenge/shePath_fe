import Sidebar from "./Sidebar";
import QuestionDetail from "./QuestionDetail";
import AskQuestion from "./Ask";
import { Nav } from "./CommunityNav";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const Community = () => {
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
      <div
        className={`flex-1 p-6 ${isAskQuestionOpen ? 'blur-md opacity-50 pointer-events-none' : ''}`}
      >
        <Nav searchTerm={searchTerm} setSearchTerm={setSearchTerm} setIsAskQuestionOpen={setIsAskQuestionOpen} />
      </div>

      {isAskQuestionOpen && <AskQuestion setIsAskQuestionOpen={setIsAskQuestionOpen} />}

      <div className={`flex flex-col h-screen m-4 p-4 w-full ${isAskQuestionOpen ? 'blur-md opacity-50 pointer-events-none' : ''}`}>
        <div className="flex flex-col md:flex-row min-h-screen w-full">
          <Sidebar setSelectedTopicId={setSelectedTopicId} filteredTopics={filteredTopics} />

          <div className={`flex-1 p-6 ${isAskQuestionOpen ? 'opacity-50 pointer-events-none' : ''}`}>
            {selectedTopicId && <QuestionDetail topicId={selectedTopicId} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Community;