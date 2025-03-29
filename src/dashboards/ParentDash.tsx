import { useState, useEffect } from "react";
import {
  BookOpen,
  Users,
  MessageSquare,
  Menu,
  X,
  Edit2Icon,
  User,
  MessageCircle,
  Heart,
  Settings,
} from "lucide-react";
import ThemeToggle from "../components/Theme";
import LogoutButton from "../auth/Logout";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { getProfile, editProfile } from "../features/userSlice";
import { fetchTopics, Topic } from "../features/topicSlice"; // For "My Questions"
import Loader from "../components/Loader";
import Toaster from "../components/Toaster";

const ParentDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser, loading } = useSelector(
    (state: RootState) => state.users
  );
  const { topics } = useSelector((state: RootState) => state.topics);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    birthDate: "",
    country: "",
    city: "",
    address: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [toaster, setToaster] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [myQuestions, setMyQuestions] = useState<Topic[]>([]);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  useEffect(() => {
    dispatch(getProfile());
    dispatch(fetchTopics()); // Fetch topics for "My Questions"
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        phoneNumber: currentUser.phoneNumber || "",
        gender: currentUser.gender || "",
        birthDate: currentUser.birthDate
          ? currentUser.birthDate.split("T")[0]
          : "",
        country: currentUser.country || "Rwanda",
        city: currentUser.city || "Kigali",
        address: currentUser.address || "Rwanda",
      });
      const userQuestions = topics.filter(
        (topic) => topic.userId === currentUser.id
      );
      setMyQuestions(userQuestions);
    }
  }, [currentUser, topics]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const showToaster = (message: string, type: "success" | "error") => {
    setToaster({ message, type });
    setTimeout(() => setToaster(null), 3000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) setSelectedImage(files[0]);
    else showToaster("No file selected.", "error");
  };

  const handleEditProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      formDataToSend.append(key, value)
    );
    if (selectedImage) formDataToSend.append("profile", selectedImage);

    try {
      const response = await dispatch(editProfile(formDataToSend));
      if (response.meta.requestStatus === "fulfilled")
        showToaster("Profile updated successfully!", "success");
      else showToaster("Failed to update profile.", "error");
    } catch (error) {
      showToaster("An error occurred while updating the profile.", "error");
    }
  };

  return (
    <div className="flex min-h-screen bg-light-background dark:bg-dark-background">
      {/* Mobile Sidebar Button */}
      <button
        className="p-3 md:hidden fixed top-4 left-4 bg-light-gray dark:bg-dark-gray rounded-full z-50"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="w-6 h-6 dark:text-dark-text" />
      </button>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-light-gray dark:bg-dark-gray p-6 transition-transform transform md:relative md:translate-x-0 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="p-2 absolute top-4 right-4 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-6 h-6 dark:text-dark-text" />
        </button>
        <h2 className="text-xl font-bold text-light-primary mb-6">
          Parent Space
        </h2>
        <div className="flex items-center mb-6">
          <img
            src={currentUser?.profile || "/square.jpg"}
            alt="Profile"
            className="w-12 h-12 rounded-full mr-2 border-2 border-light-primary"
          />
          <span className="text-lg font-semibold text-light-text dark:text-dark-text">
            {currentUser?.firstName} {currentUser?.lastName}
          </span>
        </div>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${
                activeTab === "profile"
                  ? "bg-light-primary text-white"
                  : "hover:bg-light-secondary"
              }`}
            >
              <User /> Profile
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("awareness")}
              className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${
                activeTab === "awareness"
                  ? "bg-light-primary text-white"
                  : "hover:bg-light-secondary"
              }`}
            >
              <BookOpen /> Awareness
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("support")}
              className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${
                activeTab === "support"
                  ? "bg-light-primary text-white"
                  : "hover:bg-light-secondary"
              }`}
            >
              <Users /> Support
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("community")}
              className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${
                activeTab === "community"
                  ? "bg-light-primary text-white"
                  : "hover:bg-light-secondary"
              }`}
            >
              <MessageSquare /> Community
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("myQuestions")}
              className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${
                activeTab === "myQuestions"
                  ? "bg-light-primary text-white"
                  : "hover:bg-light-secondary"
              }`}
            >
              <MessageCircle /> My Questions
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${
                activeTab === "settings"
                  ? "bg-light-primary text-white"
                  : "hover:bg-light-secondary"
              }`}
            >
              <Settings /> Settings
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {toaster && <Toaster message={toaster.message} type={toaster.type} />}

        {activeTab === "profile" && (
          <section className="w-full max-w-4xl mx-auto mt-12 p-6 bg-light-gray dark:bg-dark-gray rounded-lg shadow-lg dark:text-dark-text">
            <h1 className="text-3xl font-bold mb-6 text-center text-light-primary">
              Your Profile
            </h1>
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
                    <label
                      htmlFor="imageUpload"
                      className="absolute bottom-0 right-0 bg-light-primary p-2 rounded-full cursor-pointer"
                    >
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
                  <h2 className="text-2xl font-semibold mt-4">
                    {currentUser.firstName} {currentUser.lastName}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {currentUser.email}
                  </p>
                </div>
                <form
                  onSubmit={handleEditProfile}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      className="w-full p-3 rounded bg-white dark:bg-dark-background text-light-text dark:text-dark-text border border-gray-300 dark:border-gray-600"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      className="w-full p-3 rounded bg-white dark:bg-dark-background text-light-text dark:text-dark-text border border-gray-300 dark:border-gray-600"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="w-full p-3 rounded bg-gray-200 dark:bg-gray-700 text-light-text dark:text-dark-text border border-gray-300 dark:border-gray-600 cursor-not-allowed"
                      value={formData.email}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      className="w-full p-3 rounded bg-white dark:bg-dark-background text-light-text dark:text-dark-text border border-gray-300 dark:border-gray-600"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Gender
                    </label>
                    <input
                      type="text"
                      name="gender"
                      className="w-full p-3 rounded bg-white dark:bg-dark-background text-light-text dark:text-dark-text border border-gray-300 dark:border-gray-600"
                      value={formData.gender}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Birth Date
                    </label>
                    <input
                      type="date"
                      name="birthDate"
                      className="w-full p-3 rounded bg-white dark:bg-dark-background text-light-text dark:text-dark-text border border-gray-300 dark:border-gray-600"
                      value={formData.birthDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      className="w-full p-3 rounded bg-white dark:bg-dark-background text-light-text dark:text-dark-text border border-gray-300 dark:border-gray-600"
                      value={formData.country}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      className="w-full p-3 rounded bg-white dark:bg-dark-background text-light-text dark:text-dark-text border border-gray-300 dark:border-gray-600"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Address
                    </label>
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
              <p className="text-center text-gray-600 dark:text-gray-300">
                Unable to load profile data.
              </p>
            )}
          </section>
        )}

        {activeTab === "awareness" && (
          <section className="w-full max-w-4xl mx-auto mt-12 p-6 dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-6 text-center text-light-primary">
              Education Awareness
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Many children, especially girls, miss out on education due to
              parental decisions or circumstances. Understanding these barriers
              is the first step to change.
            </p>
            <div className="space-y-6">
              <div className="bg-light-gray dark:bg-dark-gray p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">
                  Common Barriers
                </h2>
                <ul className="list-disc list-inside mt-2 text-gray-600 dark:text-gray-300">
                  <li>
                    <strong>Financial Constraints:</strong> Parents often
                    prioritize boys’ education when resources are limited,
                    viewing girls as future homemakers (UNESCO, 2022).
                  </li>
                  <li>
                    <strong>Cultural Norms:</strong> Early marriage are in many
                    communities, girls are expected to marry young, halting
                    their education (UNICEF, 2021).
                  </li>
                  <li>
                    <strong>Household Responsibilities:</strong> Girls are often
                    kept home to help with chores or care for siblings, seen as
                    their primary role (World Bank, 2020).
                  </li>
                  <li>
                    <strong>Lack of Awareness:</strong> Some parents don’t see
                    the value of education for girls, believing it won’t benefit
                    the family economically.
                  </li>
                </ul>
              </div>
              <div className="bg-light-gray dark:bg-dark-gray p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">
                  Why It Matters
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Educating girls reduces poverty by 50% per additional year of
                  schooling (World Bank), lowers child mortality rates, and
                  boosts economic growth. Every child deserves this chance.
                </p>
              </div>
              <div className="bg-light-gray dark:bg-dark-gray p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">
                  FAQs
                </h2>
                {[
                  {
                    q: "Why should I prioritize my daughter’s education over household duties?",
                    a: "Education equips her with skills for independence and better decision-making. It’s an investment in her future and your family’s well-being, not a loss of help at home.",
                  },
                  {
                    q: "What if we can’t afford school for all our children?",
                    a: "Girls’ education has a higher return on investment—studies show it leads to healthier families and communities. Look for local programs or scholarships; every step counts.",
                  },
                  {
                    q: "Won’t she just get married and leave us?",
                    a: "An educated girl is more likely to marry later, have fewer children, and contribute financially to the family, breaking the cycle of poverty.",
                  },
                ].map((faq, index) => (
                  <div
                    key={index}
                    className="p-2 cursor-pointer border-b border-gray-300 dark:border-gray-600"
                    onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                  >
                    <h3 className="font-medium">{faq.q}</h3>
                    {faqOpen === index && (
                      <p className="mt-1 text-gray-500 dark:text-gray-300">
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === "support" && (
          <section className="w-full max-w-4xl mx-auto mt-12 p-6 dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-6 text-center text-light-primary">
              Parenting Support
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Your role can overcome barriers to your child’s education. Here’s
              how:
            </p>
            <div className="space-y-6">
              <div className="bg-light-gray dark:bg-dark-gray p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">
                  Practical Tips
                </h2>
                <ul className="list-disc list-inside mt-2 text-gray-600 dark:text-gray-300">
                  <li>
                    <strong>Share Responsibilities:</strong> Distribute chores
                    among all children to free up time for your daughter’s
                    studies.
                  </li>
                  <li>
                    <strong>Advocate for Her:</strong> Talk to community leaders
                    or schools about support options—many offer free or
                    subsidized education for girls.
                  </li>
                  <li>
                    <strong>Set an Example:</strong> Show that you value
                    learning by discussing its benefits with her regularly.
                  </li>
                  <li>
                    <strong>Delay Marriage:</strong> Encourage her to finish
                    school first; early marriage often ends education (UNICEF).
                  </li>
                </ul>
              </div>
              <div className="bg-light-gray dark:bg-dark-gray p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">
                  Addressing Mindsets
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Challenge the belief that education is only for boys. Educated
                  girls lift entire families—data shows they reinvest 90% of
                  their income into their households (UN Women).
                </p>
              </div>
            </div>
          </section>
        )}

        {activeTab === "community" && (
          <section className="w-full max-w-4xl mx-auto mt-12 p-6 dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-6 text-center text-light-primary">
              Parent Community
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Connect with other parents to share challenges and solutions. Your
              voice can inspire change.
            </p>
            <div className="bg-light-gray dark:bg-dark-gray p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">
                Join the Discussion
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Topics like “How do you balance education costs?” or “Overcoming
                cultural pressures” are waiting for your input.{" "}
                <Link
                  to="/community"
                  className="text-light-primary underline hover:text-orange-600"
                >
                  Click here to join the community.
                </Link>
              </p>
            </div>
          </section>
        )}

        {activeTab === "myQuestions" && (
          <section className="w-full max-w-5xl mx-auto mt-12 dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-6 text-center text-light-primary">
              My Questions
            </h1>
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
                      <h2 className="text-lg font-semibold text-light-text dark:text-dark-text truncate">
                        {topic.content}
                      </h2>
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Heart className="w-4 h-4 mr-1 text-red-500" />{" "}
                          {topic.likes.length}
                        </span>
                        <span className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <MessageSquare className="w-4 h-4 mr-1" />{" "}
                          {topic.comments.length}
                        </span>
                      </div>
                      <Link
                        to={`/community/`}
                        className="px-4 py-2 bg-light-primary text-white rounded-lg hover:bg-orange-600 transition text-center mt-2"
                      >
                        View Question
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-300 text-center">
                You haven’t posted any questions yet.
              </p>
            )}
          </section>
        )}
        {activeTab === "settings" && (
          <section className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md mx-auto">
              <h1 className="text-3xl font-bold mb-8 text-center text-light-secondary dark:text-dark-secondary">
                Settings
              </h1>
              <div className="bg-light-gray dark:bg-dark-gray p-6 rounded-xl shadow-lg space-y-8">
                {/* Theme Section */}
                <div className="border-b border-gray-300 dark:border-gray-600 pb-4">
                  <h2 className="text-lg font-semibold text-light-text dark:text-dark-text mb-3">
                    Theme
                  </h2>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Toggle between light and dark mode
                    </span>
                    <ThemeToggle />
                  </div>
                </div>

                {/* Session Section */}
                <div className="border-b border-gray-300 dark:border-gray-600 pb-4">
                  <h2 className="text-lg font-semibold text-light-text dark:text-dark-text mb-3">
                    Session
                  </h2>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      End your current session
                    </span>
                    <LogoutButton />
                  </div>
                </div>

                {/* Navigation Section */}
                <div>
                  <h2 className="text-lg font-semibold text-light-text dark:text-dark-text mb-3">
                    Navigation
                  </h2>
                  <Link
                    to="/"
                    className="block w-full text-md font-medium text-light-primary dark:text-dark-primary hover:text-light-accent dark:hover:text-dark-accent bg-light-background dark:bg-dark-background py-2 px-4 rounded-lg hover:bg-light-accent/10 dark:hover:bg-dark-accent/20 transition-colors duration-200"
                  >
                    Exit Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ParentDashboard;
