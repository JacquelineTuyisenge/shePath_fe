import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { useEffect, useState, useCallback } from "react";
import { fetchTopics } from "../features/topicSlice";
import Loader from "./Loader";

interface SidebarProps {
  setSelectedTopicId: React.Dispatch<React.SetStateAction<string>>;
  filteredTopics: { id: string; content: string }[];
}

const Sidebar: React.FC<SidebarProps> = ({ setSelectedTopicId, filteredTopics }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const { loading } = useSelector((state: RootState) => state.topics); 

  useEffect(() => {
    dispatch(fetchTopics());
  }, [dispatch]);

  const handleTopicClick = useCallback(
    (id: string) => {
      setSelectedTopicId(id);
      setSelectedTopic(id);
    },
    [setSelectedTopicId]
  );

  const getPreviewContent = (content: string) => {
    return content.length > 20 ? content.slice(0, 20) + "..." : content;
  };

  return (
    <div className="bg-light-background text-light-text dark:bg-dark-gray dark:text-dark-text w-full sm:w-64 bg-gray-100 p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Topics</h2>
      {loading ? (
        <Loader /> // Show loader when data is being fetched
      ) : (
        <ul className="flex flex-col space-y-8">
          {filteredTopics.length ? (
            filteredTopics.map((topic) => (
              <li
                key={topic.id}
                onClick={() => handleTopicClick(topic.id)}
                onKeyDown={(e) => e.key === "Enter" && handleTopicClick(topic.id)}
                tabIndex={0}
                className={`cursor-pointer border-b-2 border-orange-500 p-2 transition duration-200 hover:bg-light-secondary focus:ring-2 focus:ring-orange-500 outline-none ${
                  selectedTopic === topic.id ? "bg-orange-300" : ""
                }`}
              >
                {getPreviewContent(topic.content)}
              </li>
            ))
          ) : (
            <p className="text-gray-500">No topics found.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;