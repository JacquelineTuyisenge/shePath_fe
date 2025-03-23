import { Link } from "react-router-dom";
import { FaHeart, FaPlus } from "react-icons/fa";

interface NavProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setIsAskQuestionOpen: (isOpen: boolean) => void;
}

export function Nav({ searchTerm, setSearchTerm, setIsAskQuestionOpen }: NavProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-between bg-light-gray p-6 items-center">
      <div className="text-light-secondary text-3xl font-bold">Community Page</div>
      <Link to="/" className="text-xl hover:text-light-primary">Home</Link>

      <div className="space-y-2 sm:space-y-0 flex sm:flex-row items-center gap-4">
        <button className="flex gap-2 justify-center rounded p-2 items-center text-xl hover:bg-gray-400 hover:text-white">
          <FaHeart className="text-orange-500 text-xl" />
        </button>
        <button
          className="flex gap-2 justify-center border border-orange-500 rounded p-2 items-center text-xl hover:bg-gray-400 hover:text-white"
          onClick={() => setIsAskQuestionOpen(true)}
        >
          <FaPlus className="text-orange-500 text-xl" />
        </button>

        <input
          type="text"
          className="p-3 rounded border border-orange-500 bg-light-gray focus:border-orange-600 focus:ring-0 w-full sm:w-64"
          placeholder="Search topics"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
}