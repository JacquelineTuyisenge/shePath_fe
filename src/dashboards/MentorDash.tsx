import { useState, useEffect } from "react";
import { MessageSquare, Users, Settings, Menu, X, Edit2Icon } from "lucide-react";
import ThemeToggle from "../components/Theme";
import LogoutButton from "../auth/Logout";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { getProfile, editProfile } from "../features/userSlice"; 
import { RootState } from "../store"; 
import Loader from "../components/Loader";
import Toaster from "../components/Toaster";
import ConversationsList from "../components/ConvList";
import ChatUI from "../components/Chat";

const MentorDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser , loading } = useSelector((state: RootState) => state.users);
  const [selectedConversationPartner, setSelectedConversationPartner] = useState<string | null>(null);

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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [toaster, setToaster] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedImage(file); // Store the selected image
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
      formDataToSend.append('profile', selectedImage); // Append the image file
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
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button className="p-2 absolute top-4 right-4 md:hidden" onClick={() => setSidebarOpen(false)}>
          <X className="w-6 h-6 dark:text-dark-text" />
        </button>

        <h2 className="text-xl font-bold text-light-primary mb-6">ShePath - Mentor</h2>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => setActiveTab("profile")}
              className="flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text">
              <div className="flex items-center mb-4">
                <img 
                  src={currentUser ?.profile || "/square.jpg"} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full mr-2" 
                />
                <span className="text-lg font-semibold text-light-text dark:text-dark-text">{currentUser ?.firstName} {currentUser ?.lastName}</span>
              </div>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("learners")}
              className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${
                activeTab === "learners" ? "bg-light-primary text-white" : "hover:bg-light-secondary"
              }`}
            >
              <Users /> My Learners
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("messages")}
              className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${
                activeTab === "messages" ? "bg-light-primary text-white" : "hover:bg-light-secondary"
              }`}
            >
              <MessageSquare /> Messages
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
      {toaster && <Toaster message={toaster.message} type={toaster.type} />}

        {activeTab === "profile" && (
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
        {activeTab === "learners" && (
          <section className="dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-4 text-center">My Learners</h1>
            <p className="text-gray-600 dark:text-gray-300">View and support learners under your mentorship.</p>
          </section>
        )}
        {activeTab === "messages" && (
          <section className="w-full mt-12 p-6 dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-4 text-center">Messages</h1>
            <div className="flex flex-col sm:flex-row">
              {/* Left column: Conversations list */}
              <div className="w-full ms:w-1/2 border-r border-r">
                <ConversationsList onSelectPartner={(partnerId: string)  => setSelectedConversationPartner(partnerId)} />
              </div>
              {/* Right column: Chat area */}
              <div className="w-full ms:w-1/2 border-l pr-4 pl-4">
                {selectedConversationPartner ? (
                  <ChatUI mentorId={selectedConversationPartner} />
                ) : (
                  <div className="flex h-96 items-center justify-center border rounded">
                    <p className="text-center text-gray-500">
                      No conversation selected. 
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
        {activeTab === "resources" && (
          <section className="dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-4 text-center">Resources</h1>
            <p className="text-gray-600 dark:text-gray-300">Share learning materials and opportunities.</p>
          </section>
        )}
        {activeTab === "progress" && (
          <section className="dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-4 text-center">Progress Reports</h1>
            <p className="text-gray-600 dark:text-gray-300">Track learners' progress and provide feedback.</p>
          </section>
        )}
        {activeTab === "settings" && (
          <section className="dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-4 text-center">Settings</h1>
            <p className="text-gray-600 dark:text-gray-300">Adjust your mentorship preferences.</p>
          </section>
        )}
      </main>
    </div>
  );
};

export default MentorDashboard;
