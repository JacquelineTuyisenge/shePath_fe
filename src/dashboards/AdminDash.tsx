// AdminDashboard.tsx
import { useEffect, useState } from "react";
import Card from "../components/Card";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { User, BookOpen, MessageCircle, Settings, Users, Menu, X, Edit, Trash, Key, BookIcon, Edit2Icon } from "lucide-react";
import ThemeToggle from "../components/Theme"; // Using your existing ThemeToggle
import { AppDispatch, RootState } from "../store";
import AddRoleModal from "../modals/AddRole";
import AddCourseModal from "../modals/AddCourse";
import AddCategoryModel from "../modals/AddCategory";
import EditCourseModal from "../modals/EditCourseModal";
import EditCatModel from "../modals/EditCategory";
import { getUsers } from "../features/userSlice";
import { getMessages } from "../features/messageSlice";
import { deleteCourse, fetchCourses } from "../features/courseSlice";
import { deleteCourseCategory, fetchCourseCategories } from "../features/courceCategorySlice";
import { getRoles, deleteRole } from "../features/roleSlice";
import EditRoleModal from "../modals/EditRoleModal";
import AssignRoleModal from "../modals/AssignRole";
import LogoutButton from "../auth/Logout";
import UserExpansionTrend from "../features/UserChart";
import { getProfile, editProfile } from "../features/userSlice";
import { Link } from "react-router-dom";
import Toaster from "../components/Toaster";
import Loader from "../components/Loader";
import careerDevImg from "../assets/career.jpg";

const ITEMS_PER_PAGE = 6; // Consistent items per page for all sections

const AdminDashboard = () => {
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState(""); // For user search
  const { users, loading, error } = useAppSelector((state: any) => state.users);
  const { currentUser, loading: userLoading } = useSelector((state: RootState) => state.users);
  const { courses } = useAppSelector((state: any) => state.courses);
  const { messages: initialMessages } = useAppSelector((state: RootState) => state.sms); // Renamed to avoid confusion
  const { categories = [], loading: categoryLoading } = useAppSelector((state: any) => state.categories);
  const { roles, loading: roleLoading, error: roleError } = useAppSelector((state: any) => state.roles);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toaster, setToaster] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Added: Local state for messages to manage frontend-only deletion
  const [messages, setMessages] = useState(initialMessages);

  // Pagination states for each tab
  const [usersPage, setUsersPage] = useState(1);
  const [rolesPage, setRolesPage] = useState(1);
  const [categoriesPage, setCategoriesPage] = useState(1);
  const [coursesPage, setCoursesPage] = useState(1);
  const [messagesPage, setMessagesPage] = useState(1);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [isEditCourseCategoryModalOpen, setIsEditCourseCategoryModalOpen] = useState(false);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isAddCourseCategoryModalOpen, setIsAddCourseCategoryModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedCourseCategory, setSelectedCourseCategory] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Profile form data
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phoneNumber: "", gender: "", birthDate: "", country: "", city: "", address: "",
  });

  // Fetch data on mount
  useEffect(() => {
    dispatch(getRoles());
    dispatch(getUsers());
    dispatch(getMessages());
    dispatch(fetchCourseCategories());
    dispatch(fetchCourses());
    dispatch(getProfile());
  }, [dispatch]);

  // Added: Sync local messages state with Redux state when it changes
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Sync form data with currentUser
  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
        phoneNumber: currentUser.phoneNumber || "",
        gender: currentUser.gender || "",
        birthDate: currentUser.birthDate ? currentUser.birthDate.split("T")[0] : "",
        country: currentUser.country || "Rwanda",
        city: currentUser.city || "Kigali",
        address: currentUser.address || "Rwanda",
      });
    }
  }, [currentUser]);

  // Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const showToaster = (message: string, type: "success" | "error") => {
    setToaster({ message, type });
    setTimeout(() => setToaster(null), 3000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setSelectedImage(e.target.files[0]);
  };

  const handleEditProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => formDataToSend.append(key, value));
    if (selectedImage) formDataToSend.append("profile", selectedImage);

    try {
      const response = await dispatch(editProfile(formDataToSend));
      showToaster(response.meta.requestStatus === "fulfilled" ? "Profile updated successfully!" : "Failed to update profile.", response.meta.requestStatus === "fulfilled" ? "success" : "error");
    } catch (error) {
      showToaster("An error occurred while updating the profile.", "error");
    }
  };

  // Delete handlers
  const handleDelete = (id: string) => dispatch(deleteRole(id));
  const handleDeleteCourse = (id: string) => dispatch(deleteCourse(id));
  const handleDeleteCourseCategory = (id: string) => dispatch(deleteCourseCategory(id));
  
  // Added: Frontend-only delete for messages
  const handleDeleteMessage = (id: string) => {
    setMessages((prevMessages: any[]) => prevMessages.filter((message) => message.id !== id));
    showToaster("Message deleted successfully!", "success");
  };

  // Sorting and Pagination Logic
  const sortByCreatedAt = (items: any[]) => items.slice().sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  const paginateItems = (items: any[], page: number) => {
    const indexOfLast = page * ITEMS_PER_PAGE;
    const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
    return items.slice(indexOfFirst, indexOfLast);
  };

  // Sorted and filtered data
  const sortedUsers = sortByCreatedAt(users.filter((user: any) => user.email.toLowerCase().includes(searchTerm.toLowerCase())));
  const sortedRoles = sortByCreatedAt(roles);
  const sortedCategories = sortByCreatedAt(categories);
  const sortedCourses = sortByCreatedAt(courses);
  const sortedMessages = sortByCreatedAt(messages); // Uses local state

  // Paginated data
  const currentUsers = paginateItems(sortedUsers, usersPage);
  const currentRoles = paginateItems(sortedRoles, rolesPage);
  const currentCategories = paginateItems(sortedCategories, categoriesPage);
  const currentCourses = paginateItems(sortedCourses, coursesPage);
  const currentMessages = paginateItems(sortedMessages, messagesPage);

  // Total pages
  const totalUsersPages = Math.ceil(sortedUsers.length / ITEMS_PER_PAGE);
  const totalRolesPages = Math.ceil(sortedRoles.length / ITEMS_PER_PAGE);
  const totalCategoriesPages = Math.ceil(sortedCategories.length / ITEMS_PER_PAGE);
  const totalCoursesPages = Math.ceil(sortedCourses.length / ITEMS_PER_PAGE);
  const totalMessagesPages = Math.ceil(sortedMessages.length / ITEMS_PER_PAGE);

  // Pagination Component
  const Pagination = ({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) => (
    <div className="mt-6 flex justify-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-full transition ${currentPage === page ? "bg-light-primary text-white" : "bg-light-gray dark:bg-dark-gray text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent"}`}
        >
          {page}
        </button>
      ))}
    </div>
  );

  return (
    <div className="w-full min-h-screen flex bg-light-background dark:bg-dark-background font-sans text-light-text dark:text-dark-text">
      {/* Mobile Sidebar */}
      <button className="p-3 md:hidden fixed top-4 left-4 bg-light-gray dark:bg-dark-gray rounded-full z-50" onClick={() => setSidebarOpen(true)}>
        <Menu className="w-6 h-6 text-light-text dark:text-dark-text" />
      </button>

      {/* Sidebar Navigation */}
      {/* Updated: Added whitespace-nowrap to "Course Categories" to keep it on one line */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-light-gray dark:bg-dark-gray p-6 transition-transform transform md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0 z-50" : "-translate-x-full"}`}>
        <button className="p-2 absolute top-4 right-4 md:hidden" onClick={() => setSidebarOpen(false)}>
          <X className="w-6 h-6 text-light-text dark:text-dark-text" />
        </button>
        <h2 className="text-2xl font-bold text-light-primary dark:text-dark-primary mb-6">Admin Dashboard</h2>
        <ul className="space-y-3">
          <li>
            <button onClick={() => setActiveTab("profile")} className="flex items-center gap-3 p-3 rounded-lg hover:bg-light-accent dark:hover:bg-dark-accent transition">
              <img src={currentUser?.profile || "/square.jpg"} alt="Profile" className="w-10 h-10 rounded-full" />
              <span className="text-lg font-semibold">{currentUser?.lastName || "User"}</span>
            </button>
          </li>
          {[
            { tab: "overview", icon: <User />, label: "Overview" },
            { tab: "users", icon: <Users />, label: "Users" },
            { tab: "roles", icon: <Key />, label: "Roles" },
            { tab: "courseCategories", icon: <BookIcon />, label: "Course Categories" }, // Will stay on one line
            { tab: "courses", icon: <BookOpen />, label: "Courses" },
            { tab: "sms", icon: <MessageCircle />, label: "Messages" },
            { tab: "settings", icon: <Settings />, label: "Settings" },
          ].map(({ tab, icon, label }) => (
            <li key={tab}>
              <button
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-3 p-3 w-full rounded-lg transition whitespace-nowrap ${activeTab === tab ? "bg-light-primary dark:bg-dark-primary text-white" : "hover:bg-light-accent dark:hover:bg-dark-accent"}`}
              >
                {icon} {label}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <ThemeToggle />
        </div>
        <div className="mt-4"><LogoutButton /></div>
        <div className="p-2 mb-4">
          <Link to="/" className="text-md font-bold text-light-primary hover:text-light-accent dark:text-dark-primary dark:hover:text-dark-accent">Exit Dashboard</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 w-full">
        {toaster && <Toaster message={toaster.message} type={toaster.type} />}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <section className="w-full max-w-2xl mx-auto mt-12">
            <h1 className="text-3xl font-bold mb-6 text-center text-light-secondary dark:text-dark-secondary">
              Welcome, {userLoading ? <Loader /> : currentUser?.firstName || "User"}!
            </h1>
            {currentUser && (
              <div className="bg-light-gray dark:bg-dark-gray p-6 rounded-xl shadow-lg">
                <div className="flex flex-col items-center mb-6">
                  <img src={currentUser.profile || "/square.jpg"} alt="Profile" className="w-24 h-24 rounded-full mb-3 border-4 border-light-primary dark:border-dark-primary" />
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="imageUpload" />
                  <label htmlFor="imageUpload"><Edit2Icon className="text-light-primary dark:text-dark-primary cursor-pointer hover:text-light-accent dark:hover:text-dark-accent" size={20} /></label>
                </div>
                <form onSubmit={handleEditProfile} className="grid gap-4 sm:grid-cols-2">
                  {Object.entries(formData).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <label className="text-sm font-medium mb-1 capitalize">{key.replace(/([A-Z])/g, " $1")}</label>
                      <input
                        type={key === "email" ? "email" : key === "birthDate" ? "date" : "text"}
                        name={key}
                        value={value}
                        onChange={handleChange}
                        className="p-2 rounded-lg bg-white dark:bg-black border border-light-gray dark:border-dark-gray focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
                      />
                    </div>
                  ))}
                  <button type="submit" className="sm:col-span-2 mt-4 p-3 bg-light-primary dark:bg-dark-primary text-white rounded-lg hover:bg-light-accent dark:hover:bg-dark-accent transition">Save Profile</button>
                </form>
              </div>
            )}
            <p className="text-gray-600 dark:text-gray-300 mt-6 text-center">Continue your journey and achieve your learning goals.</p>
          </section>
        )}

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <section className="min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-center text-light-secondary dark:text-dark-secondary">Dashboard Overview</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              <Card title="Users" value={users.length} icon={<Users />} />
              <Card title="Courses" value={courses.length} icon={<BookOpen />} />
              <Card title="Messages" value={messages ? messages.length : 0} icon={<MessageCircle />} />
            </div>
            <div className="bg-light-gray dark:bg-dark-gray p-6 rounded-xl shadow-lg"><UserExpansionTrend /></div>
          </section>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <section>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
              <h1 className="text-3xl font-bold mb-4 sm:mb-0 text-light-secondary dark:text-dark-secondary">Manage Users</h1>
              <input
                type="text"
                className="w-full sm:w-64 p-3 rounded-lg bg-white dark:bg-black border border-light-primary dark:border-dark-primary focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
                placeholder="Search by email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {loading ? <Loader /> : error ? (
              <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentUsers.map((user: any) => (
                    <div key={user.id} className="bg-light-gray dark:bg-dark-gray p-4 rounded-xl shadow-md hover:shadow-lg transition">
                      <h3 className="text-lg font-semibold truncate">{user.email}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Role: {user.role || "N/A"}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Status: {user.status ? "Active" : "Inactive"}</p>
                      <button
                        className="mt-3 bg-light-primary dark:bg-dark-primary text-white p-2 rounded-lg hover:bg-light-accent dark:hover:bg-dark-accent transition w-full flex items-center justify-center gap-2"
                        onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}
                      >
                        <Edit size={16} /> Assign Role
                      </button>
                    </div>
                  ))}
                </div>
                <Pagination currentPage={usersPage} totalPages={totalUsersPages} onPageChange={setUsersPage} />
              </>
            )}
            {isModalOpen && selectedUser && <AssignRoleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} user={selectedUser} />}
          </section>
        )}

        {/* Roles Tab */}
        {activeTab === "roles" && (
          <section className="min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
              <h1 className="text-3xl font-bold mb-4 sm:mb-0 text-light-secondary dark:text-dark-secondary">Manage Roles</h1>
              <button onClick={() => setIsModalOpen(true)} className="bg-light-primary dark:bg-dark-primary text-white p-3 rounded-lg hover:bg-light-accent dark:hover:bg-dark-accent transition">+ Add Role</button>
            </div>
            {roleLoading ? <Loader /> : roleError ? (
              <p className="text-red-600 dark:text-red-400 text-center">{roleError}</p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentRoles.map((role: any) => (
                    <div key={role.id} className="bg-light-gray dark:bg-dark-gray p-4 rounded-xl shadow-md hover:shadow-lg transition">
                      <h3 className="text-lg font-semibold">{role.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">ID: {role.id}</p>
                      <div className="mt-3 flex gap-2">
                        <button
                          className="flex-1 bg-light-primary dark:bg-dark-primary text-white p-2 rounded-lg hover:bg-light-accent dark:hover:bg-dark-accent transition flex items-center justify-center gap-2"
                          onClick={() => { setSelectedRole(role); setIsEditModalOpen(true); }}
                        >
                          <Edit size={16} /> Edit
                        </button>
                        <button
                          className="flex-1 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2"
                          onClick={() => handleDelete(role.id)}
                        >
                          <Trash size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination currentPage={rolesPage} totalPages={totalRolesPages} onPageChange={setRolesPage} />
              </>
            )}
            <AddRoleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            {isEditModalOpen && <EditRoleModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} role={selectedRole} />}
          </section>
        )}

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <section>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
              <h1 className="text-3xl font-bold mb-4 sm:mb-0 text-light-secondary dark:text-dark-secondary">Manage Courses</h1>
              <button onClick={() => setIsAddCourseModalOpen(true)} className="bg-light-primary dark:bg-dark-primary text-white p-3 rounded-lg hover:bg-light-accent dark:hover:bg-dark-accent transition">+ Add Course</button>
            </div>
            {courses.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-300">No courses available.</p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentCourses.map((course: any) => (
                    <div key={course.id} className="bg-light-gray dark:bg-dark-gray rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                      <img src={course.image || careerDevImg} alt={course.title} className="w-full h-40 object-cover" />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold truncate">{course.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">category: {course.categoryId}</p>
                        <div className="mt-4 flex gap-2">
                          <button
                            className="flex-1 bg-light-primary dark:bg-dark-primary text-white p-2 rounded-lg hover:bg-light-accent dark:hover:bg-dark-accent transition flex items-center justify-center gap-2"
                            onClick={() => { setSelectedCourse(course); setIsEditCourseModalOpen(true); }}
                          >
                            <Edit size={16} /> Edit
                          </button>
                          <button
                            className="flex-1 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2"
                            onClick={() => handleDeleteCourse(course.id)}
                          >
                            <Trash size={16} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination currentPage={coursesPage} totalPages={totalCoursesPages} onPageChange={setCoursesPage} />
              </>
            )}
            <AddCourseModal isOpen={isAddCourseModalOpen} onClose={() => setIsAddCourseModalOpen(false)} />
            {isEditCourseModalOpen && <EditCourseModal isOpen={isEditCourseModalOpen} onClose={() => setIsEditCourseModalOpen(false)} course={selectedCourse} />}
          </section>
        )}

        {/* Course Categories Tab */}
        {activeTab === "courseCategories" && (
          <section>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
              <h1 className="text-3xl font-bold mb-4 sm:mb-0 text-light-secondary dark:text-dark-secondary">Course Categories</h1>
              <button onClick={() => setIsAddCourseCategoryModalOpen(true)} className="bg-light-primary dark:bg-dark-primary text-white p-3 rounded-lg hover:bg-light-accent dark:hover:bg-dark-accent transition">+ Add Category</button>
            </div>
            {categoryLoading ? <Loader /> : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentCategories.map((category: any) => (
                    <div key={category.id} className="bg-light-gray dark:bg-dark-gray p-4 rounded-xl shadow-md hover:shadow-lg transition">
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{category.description}</p>
                      <div className="mt-3 flex gap-2">
                        <button
                          className="flex-1 bg-light-primary dark:bg-dark-primary text-white p-2 rounded-lg hover:bg-light-accent dark:hover:bg-dark-accent transition flex items-center justify-center gap-2"
                          onClick={() => { setSelectedCourseCategory(category.id); setIsEditCourseCategoryModalOpen(true); }}
                        >
                          <Edit size={16} /> Edit
                        </button>
                        <button
                          className="flex-1 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2"
                          onClick={() => handleDeleteCourseCategory(category.id)}
                        >
                          <Trash size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination currentPage={categoriesPage} totalPages={totalCategoriesPages} onPageChange={setCategoriesPage} />
              </>
            )}
            {isAddCourseCategoryModalOpen && <AddCategoryModel isOpen={isAddCourseCategoryModalOpen} onClose={() => setIsAddCourseCategoryModalOpen(false)} />}
            {isEditCourseCategoryModalOpen && <EditCatModel isOpen={isEditCourseCategoryModalOpen} onClose={() => setIsEditCourseCategoryModalOpen(false)} categoryId={selectedCourseCategory} />}
          </section>
        )}

        {/* Messages Tab */}
        {/* Updated: Removed Edit button, implemented frontend-only delete */}
        {activeTab === "sms" && (
          <section>
            <h1 className="text-3xl font-bold mb-8 text-center text-light-secondary dark:text-dark-secondary">Messages</h1>
            {messages.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-300">No messages available.</p>
            ) : (
              <>
                <div className="space-y-6">
                  {currentMessages.map((message: any) => (
                    <div key={message.id} className="bg-light-gray dark:bg-dark-gray p-4 rounded-xl shadow-md hover:shadow-lg transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">ID: {message.id}</p>
                        <p className="text-lg font-semibold">{message.email}</p>
                        <p className="text-gray-600 dark:text-gray-300 line-clamp-2">{message.message}</p>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          className="flex-1 sm:flex-none bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2"
                          onClick={() => handleDeleteMessage(message.id)}
                        >
                          <Trash size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination currentPage={messagesPage} totalPages={totalMessagesPages} onPageChange={setMessagesPage} />
              </>
            )}
          </section>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <section>
            <h1 className="text-3xl font-bold mb-8 text-center text-light-secondary dark:text-dark-secondary">Admin Settings</h1>
            <div className="max-w-md mx-auto bg-light-gray dark:bg-dark-gray p-6 rounded-xl shadow-lg space-y-6">
              <div>
                <label htmlFor="theme" className="block text-sm font-medium mb-2">Theme</label>
                <select
                  id="theme"
                  className="w-full p-3 rounded-lg bg-white dark:bg-black border border-light-gray dark:border-dark-gray focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
                >
                  <option value="light">Light Mode</option>
                  <option value="dark">Dark Mode</option>
                </select>
              </div>
              <div>
                <label htmlFor="user-settings" className="block text-sm font-medium mb-2">User Settings</label>
                <select
                  id="user-settings"
                  className="w-full p-3 rounded-lg bg-white dark:bg-black border border-light-gray dark:border-dark-gray focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
                >
                  <option value="change-password">Change Password</option>
                  <option value="reset-account">Reset Account</option>
                </select>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;