import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { createTopic, fetchTopics } from '../features/topicSlice';
import { useState } from "react";

interface AskQuestionProps {
  setIsAskQuestionOpen: (isOpen: boolean) => void;
}

const AskQuestion = ({ setIsAskQuestionOpen }: AskQuestionProps) => {
  const [content, setContent] = useState("");
  const [imageUrl, setImage] = useState<File | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createTopic({ content, imageUrl }));
    dispatch(fetchTopics());
    setContent("");
    setImage(null);
    setIsAskQuestionOpen(false); // Close form after submission
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-lg font-semibold">Ask a Question</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded mt-2"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <textarea
          placeholder="Describe your question..."
          className="w-full p-2 border rounded mt-2"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={500}
        />
        <input
          type="file"
          className="w-full p-2 border rounded mt-2"
          onChange={handleImageChange}
        />
        <div className="flex gap-4 mt-3">
          <button type="submit" className="bg-light-primary text-white px-4 py-2 rounded">Submit</button>
          <button type="button" className="dark:bg-dark-gray bg-light-gray text-light-text px-4 py-2 rounded" onClick={() => setIsAskQuestionOpen(false)}>Cancel</button>
        </div>
      </form>
    </div>  );
};

export default AskQuestion;
