import { Link } from "react-router-dom";
import { User, BookOpen, MessageSquare, Edit2Icon, Menu, X, MessageCircleDashed, MessageCircle, Heart, MessageSquare as MessageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import LogoutButton from "../auth/Logout";
import ThemeToggle from "../components/Theme";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { getProfile, editProfile } from "../features/userSlice"; 
import { fetchCourses, fetchCourseProgress } from "../features/courseSlice";
import { fetchTopics, Topic } from "../features/topicSlice";
import { getChats } from "../features/chatSlice";
import { getMentors } from "../features/mentorSlice";
import MentorList from "../components/Mentor";
import ChatUI from "../components/Chat";
import { Course } from "../features/courseSlice"; 
import Loader from "../components/Loader";
import Toaster from "../components/Toaster";

const LearnerDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [SidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { courses, progress: courseProgressMap } = useSelector((state: RootState) => state.courses);
  const { topics } = useSelector((state: RootState) => state.topics); 
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]); 
  const [myQuestions, setMyQuestions] = useState<Topic[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
  const [isMentorListOpen, setIsMentorListOpen] = useState(false); 
  const [toaster, setToaster] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const { currentUser, loading } = useSelector((state: RootState) => state.users); 

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchCourses());
      dispatch(fetchTopics());
      dispatch(getMentors());
      // Fetch progress for all courses
      courses.forEach((course) => {
        if (!courseProgressMap[course.id]) {
          dispatch(fetchCourseProgress(course.id));
        }
      });
    }
  }, [dispatch, currentUser, courses.length]);

  const handleSelectMentor = (mentorId: string) => {
    setSelectedMentorId(mentorId);
    dispatch(getChats(mentorId));
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    birthDate: '',
    country: '',
    city: '',
    address: '',
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        phoneNumber: currentUser.phoneNumber || '',
        gender: currentUser.gender || '',
        birthDate: currentUser.birthDate ? currentUser.birthDate.split('T')[0] : '',
        country: currentUser.country || 'Rwanda',
        city: currentUser.city || 'Kigali',
        address: currentUser.address || 'Rwanda',
      });
    }
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const showToaster = (message: string, type: 'success' | 'error') => {
    setToaster({ message, type });
    setTimeout(() => setToaster(null), 3000);
  };  

  useEffect(() => {
    if (currentUser) {
      const myCourses = courses.filter((course: Course) => {
        const progress = courseProgressMap[course.id]?.progress || 0;
        return progress > 0; 
      });
      setFilteredCourses(myCourses);

      const myLikedTopics = topics.filter(topic => 
        topic.likes.some((like: { userId: any; }) => like.userId === currentUser.id)
      );
      setFilteredTopics(myLikedTopics);

      const userQuestions = topics.filter(topic => topic.userId === currentUser.id);
      setMyQuestions(userQuestions); 
    }
  }, [currentUser, courses, topics, courseProgressMap]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedImage(files[0]);
    } else {
      showToaster("No file selected.", "error");
    }
  };

  const handleEditProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('firstName', formData.firstName);
    formDataToSend.append('lastName', formData.lastName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phoneNumber', formData.phoneNumber);
    formDataToSend.append('gender', formData.gender);
    formDataToSend.append('birthDate', formData.birthDate);
    formDataToSend.append('country', formData.country);
    formDataToSend.append('city', formData.city);
    formDataToSend.append('address', formData.address);
    if (selectedImage) {
      formDataToSend.append('profile', selectedImage);
    }
  
    try {
      const response = await dispatch(editProfile(formDataToSend));
      if (response.meta.requestStatus === 'fulfilled') {
        showToaster('Profile updated successfully!', 'success');
      } else {
        showToaster('Failed to update profile.', 'error');
      }
    } catch (error) {
      showToaster('An error occurred while updating the profile.', 'error');
    }
  };

  return (
    <div className="flex min-h-screen bg-light-background dark:bg-dark-background">
      {/* Mobile Sidebar */}
      <button
        className="p-3 md:hidden fixed top-4 left-4 bg-light-gray dark:bg-dark-gray rounded-full z-50"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="w-6 h-6 dark:text-dark-text" />
      </button>

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 w-64 bg-light-gray dark:bg-dark-gray p-6 transition-transform transform md:relative md:translate-x-0 z-40 ${
          SidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="p-2 absolute top-4 right-4 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-6 h-6 dark:text-dark-text" />
        </button>
        
        <h2 className="text-xl font-bold text-light-primary mb-6">ShePath</h2>
        <div className="flex items-center mb-6">
          <img 
            src={currentUser?.profile || "/square.jpg"} 
            alt="Profile" 
            className="w-12 h-12 rounded-full mr-2 border-2 border-light-primary" 
          />
          <span className="text-lg font-semibold text-light-text dark:text-dark-text">{currentUser?.firstName} {currentUser?.lastName}</span>
        </div>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${
                activeTab === "profile" ? "bg-light-primary text-white" : "hover:bg-light-secondary"
              }`}
            >
              <User /> Profile
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
              onClick={() => setActiveTab("mentors")}
              className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${
                activeTab === "mentors" ? "bg-light-primary text-white" : "hover:bg-light-secondary"
              }`}
            >
              <MessageCircleDashed /> Mentors
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("community")}
              className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${
                activeTab === "community" ? "bg-light-primary text-white" : "hover:bg-light-secondary"
              }`}
            >
              <MessageSquare /> Community
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("myQuestions")}
              className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${
                activeTab === "myQuestions" ? "bg-light-primary text-white" : "hover:bg-light-secondary"
              }`}
            >
              <MessageCircle /> My Questions
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
        {toaster && <Toaster message={toaster.message} type={toaster.type} />}
        
        {activeTab === "profile" && (
          <section className="w-full max-w-4xl mx-auto mt-12 p-6 bg-light-gray dark:bg-dark-gray rounded-lg shadow-lg dark:text-dark-text">
            <h1 className="text-3xl font-bold mb-6 text-center text-light-primary">Your Profile</h1>
            {loading ? (
              <Loader />
            ) : currentUser ? (
              <div className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <img 
                      src={currentUser.profile || "/square.jpg"} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-full border-4 border-light-primary object-cover" 
                    />
                    <label htmlFor="imageUpload" className="absolute bottom-0 right-0 bg-light-primary p-2 rounded-full cursor-pointer">
                      <Edit2Icon className="w-5 h-5 text-white" />
                    </label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                      className="hidden" 
                      id="imageUpload" 
                    />
                  </div>
                  <h2 className="text-2xl font-semibold mt-4">{currentUser.firstName} {currentUser.lastName}</h2>
                  <p className="text-gray-600 dark:text-gray-300">{currentUser.email}</p>
                </div>
                <form onSubmit={handleEditProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      className="w-full p-3 rounded bg-white dark:bg-dark-background text-light-text dark:text-dark-text border border-gray-300 dark:border-gray-600"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      className="w-full p-3 rounded bg-white dark:bg-dark-background text-light-text dark:text-dark-text border border-gray-300 dark:border-gray-600"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="w-full p-3 rounded bg-gray-200 dark:bg-gray-700 text-light-text dark:text-dark-text border border-gray-300 dark:border-gray-600 cursor-not-allowed"
                      value={formData.email}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      className="w-full p-3 rounded bg-white dark:bg-dark-background text-light-text dark:text-dark-text border border-gray-300 dark:border-gray-600"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Gender</label>
                    <input
                      type="text"
                      name="gender"
                      className="w-full p-3 rounded bg-white dark:bg-dark-background text-light-text dark:text-dark-text border border-gray-300 dark:border-gray-600"
                      value={formData.gender}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Birth Date</label>
                    <input
                      type="date"
                      name="birthDate"
                      className="w-full p-3 rounded bg-white dark:bg-dark-background text-light-text dark:text-dark-text border border-gray-300 dark:border-gray-600"
                      value={formData.birthDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <input
                      type="text"
                      name="country"
                      className="w-full p-3 rounded bg-white dark:bg-dark-background text-light-text dark:text-dark-text border border-gray-300 dark:border-gray-600"
                      value={formData.country}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      className="w-full p-3 rounded bg-white dark:bg-dark-background text-light-text dark:text-dark-text border border-gray-300 dark:border-gray-600"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <input
                      type="text"
                      name="address"
                      className="w-full p-3 rounded bg-white dark:bg-dark-background text-light-text dark:text-dark-text border border-gray-300 dark:border-gray-600"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-center">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-light-primary text-white rounded-lg hover:bg-orange-600 transition"
                    >
                      Save Profile
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-300">Unable to load profile data.</p>
            )}
          </section>
        )}

        {activeTab === "courses" && (
          <section className="w-full max-w-5xl mx-auto mt-12 dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-6 text-center text-light-primary">My Courses</h1>
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course: Course) => {
                  const progress = courseProgressMap[course.id]?.progress || 0;
                  return (
                    <div
                      key={course.id}
                      className="bg-light-gray dark:bg-dark-gray rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
                    >
                      <img
                        src={course.image || "/default-course.jpg"}
                        alt={course.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4 flex flex-col space-y-2">
                        <h2 className="text-lg font-semibold text-light-text dark:text-dark-text truncate">{course.title}</h2>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-12 h-12">
                              <svg height="100%" width="100%">
                                <circle stroke="#e6e6e6" fill="transparent" strokeWidth="6" r="18" cx="24" cy="24" />
                                <circle
                                  stroke="#4caf50"
                                  fill="transparent"
                                  strokeWidth="6"
                                  r="18"
                                  cx="24"
                                  cy="24"
                                  strokeDasharray="113 113"
                                  strokeDashoffset={113 - (progress / 100) * 113}
                                  style={{ transition: "stroke-dashoffset 0.5s ease" }}
                                />
                                <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="12" fill="currentColor">
                                  {Math.round(progress)}%
                                </text>
                              </svg>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-300">Progress</span>
                          </div>
                          <Link
                            to={`/courses/${course.id}`}
                            className="px-4 py-2 bg-light-primary text-white rounded-lg hover:bg-orange-600 transition"
                          >
                            Continue
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-300 text-center">No courses with progress found.</p>
            )}
          </section>
        )}

        {activeTab === "mentors" && (
          <section className="w-full dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-6 text-center text-light-primary">Mentors</h1>
            <div className="flex flex-col gap-6">
              {/* Mobile Toggle Button */}
              <button
                className="lg:hidden mb-4 px-4 py-2 bg-light-primary text-white rounded-lg hover:bg-orange-600 transition"
                onClick={() => setIsMentorListOpen(!isMentorListOpen)}
              >
                {isMentorListOpen ? "Hide Mentors" : "Show Mentors"}
              </button>

              <div className="flex flex-col lg:flex-row flex-1 md:gap-6">
                {/* Mentor List */}
                <div
                  className={`${
                    isMentorListOpen ? "block" : "hidden"
                  } lg:block lg:w-1/3 w-full bg-light-gray dark:bg-dark-gray rounded-lg shadow-md overflow-hidden`}
                >
                  <MentorList onSelectMentor={handleSelectMentor} selectedMentorId={selectedMentorId} />
                </div>

                {/* Chat UI */}
                <div className="lg:w-2/3 w-full flex-1">
                  {selectedMentorId ? (
                    <ChatUI mentorId={selectedMentorId} />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-light-gray dark:bg-dark-gray rounded-lg shadow-md">
                      <p className="text-center text-gray-500 dark:text-gray-300 text-lg">
                        Select a mentor to start chatting
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "community" && (
          <section className="w-full max-w-5xl mx-auto mt-12 dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-6 text-center text-light-secondary">Liked on Community Page</h1>
            {filteredTopics.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTopics.map((topic: Topic) => (
                  <div
                    key={topic.id}
                    className="bg-light-gray dark:bg-dark-gray rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
                  >
                    {topic.imageUrl && (
                      <img
                        src={topic.imageUrl}
                        alt={topic.content}
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <div className="p-4 flex flex-col space-y-2">
                      <h2 className="text-lg font-semibold text-light-text dark:text-dark-text truncate">{topic.content}</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Posted by: {topic.user.userName}</p>
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Heart className="w-4 h-4 mr-1 text-red-500" /> {topic.likes.length}
                        </span>
                        <span className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <MessageIcon className="w-4 h-4 mr-1" /> {topic.comments.length}
                        </span>
                      </div>
                      <Link
                        to={`/community/${topic.id}`} // Adjust to link directly to topic
                        className="px-4 py-2 bg-light-primary text-white rounded-lg hover:bg-orange-600 transition text-center mt-2"
                      >
                        View Topic
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-300 text-center">No liked topics found.</p>
            )}
          </section>
        )}

        {activeTab === "myQuestions" && (
          <section className="w-full max-w-5xl mx-auto mt-12 dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-6 text-center text-light-primary">My Questions</h1>
            {myQuestions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myQuestions.map((topic: Topic) => (
                  <div
                    key={topic.id}
                    className="bg-light-gray dark:bg-dark-gray rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
                  >
                    {topic.imageUrl && (
                      <img
                        src={topic.imageUrl}
                        alt={topic.content}
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <div className="p-4 flex flex-col space-y-2">
                      <h2 className="text-lg font-semibold text-light-text dark:text-dark-text truncate">{topic.content}</h2>
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Heart className="w-4 h-4 mr-1 text-red-500" /> {topic.likes.length}
                        </span>
                        <span className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <MessageIcon className="w-4 h-4 mr-1" /> {topic.comments.length}
                        </span>
                      </div>
                      <Link
                        to={`/community/${topic.id}`} // Adjust to link directly to topic
                        className="px-4 py-2 bg-light-primary text-white rounded-lg hover:bg-orange-600 transition text-center mt-2"
                      >
                        View Question
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-300 text-center">You haven’t posted any questions yet.</p>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default LearnerDashboard;