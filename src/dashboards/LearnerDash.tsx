import { Link } from "react-router-dom";
import { User, BookOpen, MessageSquare, Edit2Icon, HeartIcon, Menu, X, MessageCircleDashed } from "lucide-react";
import { useState, useEffect } from "react";
import LogoutButton from "../auth/Logout";
import ThemeToggle from "../components/Theme";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { getProfile, editProfile } from "../features/userSlice"; 
import { fetchCourses } from "../features/courseSlice";
import { fetchTopics, Topic } from "../features/topicSlice";
import { getChats } from "../features/chatSlice";
import { getMentors } from "../features/mentorSlice";
import MentorList from "../components/Mentor";
import ChatUI from "../components/Chat";
import { RootState } from "../store"; 
import { Course } from "../features/courseSlice"; 
import Loader from "../components/Loader";
import Toaster from "../components/Toaster";

// interface User {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   profile?: string;
//   address?: string;
//   city?: string;
//   country?: string;
// }

const LearnerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [SidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { courses } = useSelector((state: RootState) => state.courses);
  const { topics } = useSelector((state: RootState) => state.topics); 
  // const { mentors, status, error } = useSelector((state: RootState) => state.mentors);
  // const { chats } = useSelector((state: RootState) => state.chats);
  
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]); 
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  // const [selectedUser , setSelectedUser ] = useState<User | null>(null);
  // const [messageContent, setMessageContent] = useState("");
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
  const [toaster, setToaster] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);
  const { currentUser , loading } = useSelector((state: RootState) => state.users); 

  console.log("Current", currentUser);

  useEffect(() => {
    if (currentUser ) {
      dispatch(fetchCourses());
      dispatch(fetchTopics());
      dispatch(getMentors());
    }
  }, [dispatch, currentUser ]);

  const handleSelectMentor = (mentorId: string) => {
    setSelectedMentorId(mentorId);
    dispatch(getChats(mentorId));
  };

  // const handleChatSelect = (chat: any) => {
  //   setSelectedUser (chat.receiver);
  //   setMessageContent("");
  // };
  
  // const handleSendChat = () => {
  //   if (messageContent.trim() && selectedUser ) {
  //     const chatData = {
  //       senderId: currentUser!.id,
  //       receiverId: selectedUser .id,
  //       content: messageContent,
  //     };
  //     dispatch(sendChat(chatData));
  //     setMessageContent("");
  //   }
  // };
  
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
    if (currentUser ) {
      setFormData({
        firstName: currentUser .firstName,
        lastName: currentUser .lastName,
        email: currentUser .email,
        phoneNumber: currentUser .phoneNumber || '',
        gender: currentUser .gender || '',
        birthDate: currentUser .birthDate ? currentUser .birthDate.split('T')[0] : '',
        country: currentUser .country || 'Rwanda',
        city: currentUser .city || 'Kigali',
        address: currentUser .address || 'Rwanda',
      });
    }
  }, [currentUser ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const showToaster = (message: string, type: 'success' | 'error') => {
    setToaster({ message, type });
    setTimeout(() => setToaster(null), 3000);
  };  

  useEffect(() => {
    if (currentUser ) {
      const myCourses = courses.filter((course: Course) => {
        const progress = parseInt(localStorage.getItem(`course-${course.id}-user-${currentUser .id}-progress`) || "0", 10);
        return progress > 0; 
      });
      setFilteredCourses(myCourses);
    }
  }, [currentUser , courses]);  

  useEffect(() => {
    if (currentUser ) {
      const myLikedTopics = topics.filter(topic => 
        topic.likes.some((like: { userId: any; }) => like.userId === currentUser .id)
      );
      setFilteredTopics(myLikedTopics);
    }
  }, [currentUser , topics]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedImage(file);
    } else {
      alert("No file selected.");
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
            src={currentUser ?.profile || "/square.jpg"} 
            alt="Profile" 
            className="w-12 h-12 rounded-full mr-2" 
          />
          <span className="text-lg font-semibold text-light-text dark:text-dark-text">{currentUser ?.firstName} {currentUser ?.lastName}</span>
        </div>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${
                    activeTab === "overview" ? "bg-light-primary text-white" : "hover:bg-light-secondary"
                }`}
            >
              <User  /> Overview
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
              <MessageSquare /> <HeartIcon />
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
        
        {activeTab === "overview" && (
          <section className="w-full justify-center items-center mt-12 p-6 text-justify dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-4 text-center">Welcome, {loading ? <Loader /> : currentUser ?.firstName}!</h1>
            {currentUser  && (
              <div className="flex flex-col justify-center items-center text-center">
                <div className="flex flex-col mx-auto items-center">
                  <img 
                    src={currentUser .profile || "/square.jpg"} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full" 
                  />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="hidden" 
                    id="imageUpload" 
                  />
                  <label htmlFor="imageUpload">
                    <Edit2Icon className="m-2 text-light-primary cursor-pointer" />
                  </label>
                </div>
                <div className="mt-9 p-4 w-full lg:w-1/2 dark:border border-dark-gray space-y-4 shadow-lg">
                  <form onSubmit={handleEditProfile} className="flex flex-col m-auto space-y-4">
                    <label className="p-3">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="text-light-text bg-light-gray dark:bg-dark-gray dark:text-dark-text p-3"
                      value={formData.email}
                      onChange={handleChange}
                      readOnly
                    />

                    <label className="p-3">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      className="text-light-text bg-light-gray dark:bg-dark-gray dark:text-dark-text p-3"
                      value={formData.firstName}
                      onChange={handleChange}
                    />

                    <label className="p-3">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      className="text-light-text bg-light-gray dark:bg-dark-gray dark:text-dark-text p-3"
                      value={formData.lastName}
                      onChange={handleChange}
                    />

                    <label className="p-3">Gender</label>
                    <input
                      type="text"
                      name="gender"
                      className="text-light-text bg-light-gray dark:bg-dark-gray dark:text-dark-text p-3"
                      value={formData.gender}
                      onChange={handleChange}
                    />

                    <label className="p-3">Birth Date</label>
                    <input
                      type="date"
                      name="birthDate"
                      className="text-light-text bg-light-gray dark:bg-dark-gray dark:text-dark-text p-3"
                      value={formData.birthDate}
                      onChange={handleChange}
                    />

                    <label className="p-3">Country</label>
                    <input
                      type="text"
                      name="country"
                      className="text-light-text bg-light-gray dark:bg-dark-gray dark:text-dark-text p-3"
                      value={formData.country}
                      onChange={handleChange}
                    />

                    <label className="p-3">City</label>
                    <input
                      type="text"
                      name="city"
                      className="text-light-text bg-light-gray dark:bg-dark-gray dark:text-dark-text p-3"
                      value={formData.city}
                      onChange={handleChange}
                    />

                    <label className="p-3">Address</label>
                    <input
                      type="text"
                      name="address"
                      className="text-light-text bg-light-gray dark:bg-dark-gray dark:text-dark-text p-3"
                      value={formData.address}
                      onChange={handleChange}
                    />

                    <label className="p-3">Phone</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      className="text-light-text bg-light-gray dark:bg-dark-gray dark:text-dark-text p-3"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                    <button
                      type="submit"
                      className="p-2 bg-light-primary mx-auto cursor-pointer hover:bg-orange-600 transform"
                    >
                      Save
                    </button>
                  </form>
                </div>
              </div>
            )}
            <p className="text-center text-gray-600 dark:text-gray-300 mt-5">
              Continue your journey and achieve your learning goals.
            </p>
          </section>
        )}
        {activeTab === "courses" && (
          <section className="text-justify dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-4 text-center">My Courses</h1>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course: Course) => (
                <div key={course.id} className="mb-4 p-4 border rounded shadow">
                  <h2 className="text-lg font-semibold">{course.title}</h2>
                  <p>Progress: {localStorage.getItem(`course-${course.id}-user-${currentUser ?.id}-progress`) || "0"}%</p>
                  <Link to={`/courses/${course.id}`} className="text-orange-500">View Course</Link>
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-300">No courses with progress found.</p>
            )}
          </section>
        )}
        {activeTab === "mentors" && (
          <section className="w-full mt-12 p-6 dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-4 text-center">Mentors</h1>
            <div className="flex flex-col sm:flex-row">
              {/* Left column: Mentor List */}
              <div className="w-full ms:w-1/2 border-r pr-4">
                <MentorList onSelectMentor={handleSelectMentor} selectedMentorId={selectedMentorId} />
              </div>
              {/* Right column: Chat area */}
              {selectedMentorId ? (
                <div className="w-full sm:w-1/2">
                  <ChatUI mentorId={selectedMentorId} />
                </div>
              ): (
                <div className="flex h-96 items-center justify-center border rounded">
                  <p className="text-center text-gray-500">
                    No conversation selected. 
                  </p>
                </div>
              )}
              {/* <div className="w-2/3 pl-4">
                {selectedMentorId ? (
                  <ChatUI mentorId={selectedMentorId} />
                ) : (
                  <div className="flex h-96 items-center justify-center border rounded">
                    <p className="text-center text-gray-500">
                      No conversation selected. 
                    </p>
                  </div>
                )}
              </div> */}
            </div>
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
      </main>
    </div>
  );
};

export default LearnerDashboard;