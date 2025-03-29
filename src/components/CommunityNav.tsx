import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import ThemeToggle from "./Theme";

interface NavProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setIsAskQuestionOpen: (isOpen: boolean) => void;
}

export function Nav({ searchTerm, setSearchTerm, setIsAskQuestionOpen }: NavProps) {
  return (
    <nav className="bg-light-gray dark:bg-dark-gray p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="text-light-secondary text-2xl sm:text-3xl font-bold">Community Page</div>
      <Link to="/" className="text-lg sm:text-xl hover:text-light-primary">Home</Link>
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <ThemeToggle />
        <button
        className="flex items-center gap-2 border border-orange-500 rounded p-2 text-lg hover:bg-gray-400 hover:text-white"
        onClick={() => setIsAskQuestionOpen(true)}
      >
        <FaPlus className="text-orange-500" />
        <span className="hidden sm:inline">Ask</span>
      </button>
        <input
          type="text"
          className="p-2 rounded border border-orange-500 bg-light-gray dark:bg-dark-gray focus:border-orange-600 focus:ring-0 w-full sm:w-64"
          placeholder="Search topics"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </nav>
  );
}