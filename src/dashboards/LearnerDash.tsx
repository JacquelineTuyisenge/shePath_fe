import { Link } from "react-router-dom";
import { User, BookOpen, MessageSquare, HeartIcon, Settings, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import LogoutButton from "../auth/Logout";
import ThemeToggle from "../components/Theme";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { getProfile } from "../features/userSlice"; 
import { fetchCourses } from "../features/courseSlice";
import { fetchTopics, Topic } from "../features/topicSlice";
import { RootState } from "../store"; 
import { Course } from "../features/courseSlice"; // Import the Course type

const LearnerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [SidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser , loading } = useSelector((state: RootState) => state.users); 
  const { courses } = useSelector((state: RootState) => state.courses);
  const { topics } = useSelector((state: RootState) => state.topics); 
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]); // Specify Course[] type
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]); // topics

console.log("curentttttt", currentUser);

  useEffect(() => {
    dispatch(getProfile()); // Fetch the user profile when the component mounts
    dispatch(fetchCourses()); // Fetch all courses
    dispatch(fetchTopics());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser ) {
      // Filter courses based on progress stored in local storage
      const myCourses = courses.filter((course: Course) => {
        const progress = parseInt(localStorage.getItem(`course-${course.id}-user-${currentUser .id}-progress`) || "0", 10);
        return progress > 0; 
      });
      setFilteredCourses(myCourses);
    }
  }, [currentUser , courses]);  

  useEffect(() => {
    if (currentUser ) {
      // Filter topics based on likes by the current user
      const myLikedTopics = topics.filter(topic => 
        topic.likes.some((like: { userId: any; }) => like.userId === currentUser .id)
      );
      setFilteredTopics(myLikedTopics);
    }
  }, [currentUser , topics]); //

  return (
    <div className="flex min-h-screen bg-light-background dark:bg-dark-background">
      {/* Mobile Sidebar */}
      <button
        className="p-3 md:hidden fixed top-4 left-4 bg-light-gray dark:bg-dark-gray rounded-full"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="w-6 h-6 dark:text-dark-text" />
      </button>

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 w-64 bg-light-gray dark:bg-dark-gray p-6 transition-transform transform md:relative md:translate-x-0 ${
            SidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Close Button */}
        <button
          className="p-2 absolute top-4 right-4 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-6 h-6 dark:text-dark-text" />
        </button>
        
        <h2 className="text-xl font-bold text-light-primary mb-6">ShePath</h2>
        <div className="flex items-center mb-4">
          <img 
            src={currentUser ?.profileImage || "/square.jpg"} 
            alt="Profile" 
            className="w-12 h-12 rounded-full mr-2" 
          />
          <span className="text-lg font-semibold">{currentUser ?.firstName} {currentUser ?.lastName}</span>
        </div>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${
                    activeTab === "overview" ? "bg-light-primary text-white" : "hover:bg-light-secondary"
                }`}
            >
              <User  /> Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("courses")}
              className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${
                    activeTab === "courses" ? "bg-light-primary text-white" : "hover:bg-light-secondary"
                }`}
            >
              <BookOpen /> My Courses
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("community")}
              className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${
                    activeTab === "community" ? "bg-light-primary text-white" : "hover:bg-light-secondary"
                }`}
            >
              <MessageSquare /> <HeartIcon /> ...
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${
                    activeTab === "settings" ? "bg-light-primary text-white" : "hover:bg-light-secondary"
                }`}
            >
              <Settings /> Settings
            </button>
          </li>
        </ul>
        <div className="mt-6 dark:text-dark-text">
          <ThemeToggle />
        </div>
        <div>
          <LogoutButton />
        </div>
        <div className="p-2 mt-4">
          <Link to="/" className="text-md font-bold text-light-primary mt-6 dark:text-dark-text dark:hover:text-light-secondary">Exit Dashboard</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {activeTab === "overview" && (
          <section className="text-justify dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-4 text-center">Welcome, {loading ? "Loading..." : currentUser ?.firstName}!</h1>
            {currentUser  && (
              <div className="text-center">
                <img 
                  src={currentUser .profileImage || "/square.jpg"} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full mx-auto mb-4" 
                />
                <p className="text-gray-600 dark:text-gray-300">Email: {currentUser .email}</p>
                <p className="text-gray-600 dark:text-gray-300">Full Name: {currentUser .firstName} {currentUser .lastName}</p>
                <p className="text-gray-600 dark:text-gray-300">Phone: {currentUser .phoneNumber || "N/A"}</p>
                <p className="text-gray-600 dark:text-gray-300">Location: {currentUser .city}, {currentUser .country || "N/A"}</p>
              </div>
            )}
            <p className="text-gray-600 dark:text-gray-300">
              Continue your journey and achieve your learning goals.
            </p>
          </section>
        )}
        {activeTab === "courses" && (
          <section className="text-justify dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-4 text-center">My Courses</h1>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course: any) => (
                <div key={course.id} className="mb-4 p-4 border rounded shadow">
                  <h2 className="text-lg font-semibold">{course.title}</h2>
                  <p>Progress: {localStorage.getItem(`course-${course.id}-user-${currentUser?.id}-progress`) || "0"}%</p>
                  <Link to={`/courses/${course.id}`} className="text-orange-500">View Course</Link>
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-300">No courses with progress found.</p>
            )}
          </section>
        )}
        {activeTab === "community" && (
          <section className="text-justify dark:text-dark-text">
          <h1 className="text-2xl font-bold mb-4 text-center text-light-secondary">Liked on Community Page</h1>
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic: Topic) => (
              <div key={topic.id} className="mb-4 p-4 border rounded shadow">
                <h2 className="text-lg font-semibold">{topic.content}</h2>
                <p>Posted by: {topic.user.userName}</p>
                <p>Likes: {topic.likes.length}</p>
                <Link to={`/community`} className="text-orange-500">View Topic</Link>
              </div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-300">No liked topics found.</p>
          )}
          </section>
        )}
        {activeTab === "settings" && (
          <section className="text-justify dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-4 text-center">Settings</h1>
            <p className="text-gray-600 dark:text-gray-300">Update your preferences.</p>
          </section>
        )}
      </main>
    </div>
  );
};

export default LearnerDashboard;