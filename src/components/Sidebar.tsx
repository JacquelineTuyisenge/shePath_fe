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

  const handleTopicClick = useCallback((id: string) => {
    setSelectedTopicId(id);
    setSelectedTopic(id);
  }, [setSelectedTopicId]);

  const getPreviewContent = (content: string) => {
    return content.length > 20 ? content.slice(0, 20) + "..." : content;
  };

  return (
    <div className="bg-light-background dark:bg-dark-gray text-light-text dark:text-dark-text p-4 lg:sticky lg:top-0 lg:h-screen w-full">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">Topics</h2>
      {loading ? (
        <Loader />
      ) : (
        <ul className="space-y-4">
          {filteredTopics.length ? (
            filteredTopics.map((topic) => (
              <li
                key={topic.id}
                onClick={() => handleTopicClick(topic.id)}
                onKeyDown={(e) => e.key === "Enter" && handleTopicClick(topic.id)}
                tabIndex={0}
                className={`cursor-pointer p-2 border-b-2 border-orange-500 hover:bg-light-secondary focus:ring-2 focus:ring-orange-500 outline-none ${
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