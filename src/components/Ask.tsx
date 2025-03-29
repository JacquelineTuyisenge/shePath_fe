import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { createTopic, fetchTopics } from '../features/topicSlice';
import { useState } from "react";
import { isAuthenticated } from "../utils/utils";
import Toaster from "./Toaster";

interface AskQuestionProps {
  setIsAskQuestionOpen: (isOpen: boolean) => void;
}

const AskQuestion = ({ setIsAskQuestionOpen }: AskQuestionProps) => {
  const [content, setContent] = useState("");
  const [imageUrl, setImage] = useState<File | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [toaster, setToaster] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      setToaster({ message: "Please log in to create a topic", type: "error" });
      return;
    }
    dispatch(createTopic({ content, imageUrl })).then(() => {
      dispatch(fetchTopics());
      setContent("");
      setImage(null);
      setIsAskQuestionOpen(false);
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImage(e.target.files[0]);
  };

  return (
    <div className="bg-light-background dark:bg-dark-background p-4 sm:p-6 rounded-lg shadow-lg w-full">
      {toaster && <Toaster message={toaster.message} type={toaster.type} />}
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Ask a Question</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          placeholder="Describe your question..."
          className="w-full p-2 border-b-2 border-orange-500 rounded bg-light-gray dark:bg-dark-gray"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={500}
        />
        <input
          type="file"
          className="w-full p-2 border-b-2 border-orange-500 rounded bg-light-gray dark:bg-dark-gray"
          onChange={handleImageChange}
        />
        <div className="flex gap-4">
          <button type="submit" className="bg-light-primary text-white px-4 py-2 rounded">Submit</button>
          <button 
            type="button" 
            className="bg-light-gray dark:bg-dark-gray text-light-text dark:text-dark-text px-4 py-2 rounded" 
            onClick={() => setIsAskQuestionOpen(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AskQuestion;
