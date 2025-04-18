import { useEffect, useState } from "react";
import Card from "../components/Card";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {
  User,
  BookOpen,
  MessageCircle,
  Settings,
  Users,
  Menu,
  X,
  Edit,
  Trash,
  Key,
  BookIcon,
  Edit2Icon,
} from "lucide-react";
import ThemeToggle from "../components/Theme";
import { AppDispatch, RootState } from "../store";
import AddRoleModal from "../modals/AddRole";
import AddCourseModal from "../modals/AddCourse";
import AddCategoryModel from "../modals/AddCategory";
import EditCourseModal from "../modals/EditCourseModal";
import EditCatModel from "../modals/EditCategory";
import EditRoleModal from "../modals/EditRoleModal";
import AssignRoleModal from "../modals/AssignRole";
import LogoutButton from "../auth/Logout";
import UserExpansionTrend from "../features/UserChart";
import { getUsers, getProfile, editProfile } from "../features/userSlice";
import { getMessages } from "../features/messageSlice";
import { deleteCourse, fetchCourses } from "../features/courseSlice";
import {
  deleteCourseCategory,
  fetchCourseCategories,
} from "../features/courceCategorySlice";
import { getRoles, deleteRole } from "../features/roleSlice";
import { Link } from "react-router-dom";
import Toaster from "../components/Toaster";
import Loader from "../components/Loader";
import careerDevImg from "../assets/career.jpg";

const ITEMS_PER_PAGE = 6;

const AdminDashboard = () => {
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const { users, loading, error } = useAppSelector((state) => state.users);
  const { currentUser } = useAppSelector((state) => state.users);
  const { courses } = useAppSelector((state) => state.courses);
  const { messages: initialMessages } = useAppSelector((state) => state.sms);
  const { categories = [], loading: categoryLoading } = useAppSelector(
    (state) => state.categories
  );
  const {
    roles,
    loading: roleLoading,
    error: roleError,
  } = useAppSelector((state) => state.roles);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toaster, setToaster] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [messages, setMessages] = useState(initialMessages);
  const [usersPage, setUsersPage] = useState(1);
  const [rolesPage, setRolesPage] = useState(1);
  const [categoriesPage, setCategoriesPage] = useState(1);
  const [coursesPage, setCoursesPage] = useState(1);
  const [messagesPage, setMessagesPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [isEditCourseCategoryModalOpen, setIsEditCourseCategoryModalOpen] =
    useState(false);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isAddCourseCategoryModalOpen, setIsAddCourseCategoryModalOpen] =
    useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedCourseCategory, setSelectedCourseCategory] =
    useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

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

  useEffect(() => {
    dispatch(getRoles());
    dispatch(getUsers());
    dispatch(getMessages());
    dispatch(fetchCourseCategories());
    dispatch(fetchCourses());
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
        phoneNumber: currentUser.phoneNumber || "",
        gender: currentUser.gender || "",
        birthDate: currentUser.birthDate
          ? currentUser.birthDate.split("T")[0]
          : "",
        country: currentUser.country || "Rwanda",
        city: currentUser.city || "Kigali",
        address: currentUser.address || "Rwanda",
      });
    }
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const showToaster = (message: string, type: "success" | "error") => {
    setToaster({ message, type });
    setTimeout(() => setToaster(null), 3000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0])
      setSelectedImage(e.target.files[0]);
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
      showToaster(
        response.meta.requestStatus === "fulfilled"
          ? "Profile updated successfully!"
          : "Failed to update profile.",
        response.meta.requestStatus === "fulfilled" ? "success" : "error"
      );
    } catch (error) {
      showToaster("An error occurred while updating the profile.", "error");
    }
  };

  const handleDelete = (id: string) => dispatch(deleteRole(id));
  const handleDeleteCourse = (id: string) => dispatch(deleteCourse(id));
  const handleDeleteCourseCategory = (id: string) =>
    dispatch(deleteCourseCategory(id));
  const handleDeleteMessage = (id: string) => {
    setMessages((prevMessages: any[]) =>
      prevMessages.filter((message) => message.id !== id)
    );
    showToaster("Message deleted successfully!", "success");
  };

  const handleRoleUpdated = (updatedRole: { id: string; name: string }) => {
    const updatedRoles = roles.map((r: any) =>
      r.id === updatedRole.id ? { ...r, name: updatedRole.name } : r
    );
    dispatch({ type: "roles/setRoles", payload: updatedRoles });
  };

  const sortByCreatedAt = (items: any[]) =>
    items
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
  const paginateItems = (items: any[], page: number) => {
    const indexOfLast = page * ITEMS_PER_PAGE;
    const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
    return items.slice(indexOfFirst, indexOfLast);
  };

  const sortedUsers = sortByCreatedAt(
    users.filter((user: any) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  const sortedRoles = sortByCreatedAt(roles);
  const sortedCategories = sortByCreatedAt(categories);
  const sortedCourses = sortByCreatedAt(courses);
  const sortedMessages = sortByCreatedAt(messages);

  const currentUsers = paginateItems(sortedUsers, usersPage);
  const currentRoles = paginateItems(sortedRoles, rolesPage);
  const currentCategories = paginateItems(sortedCategories, categoriesPage);
  const currentCourses = paginateItems(sortedCourses, coursesPage);
  const currentMessages = paginateItems(sortedMessages, messagesPage);

  const totalUsersPages = Math.ceil(sortedUsers.length / ITEMS_PER_PAGE);
  const totalRolesPages = Math.ceil(sortedRoles.length / ITEMS_PER_PAGE);
  const totalCategoriesPages = Math.ceil(
    sortedCategories.length / ITEMS_PER_PAGE
  );
  const totalCoursesPages = Math.ceil(sortedCourses.length / ITEMS_PER_PAGE);
  const totalMessagesPages = Math.ceil(sortedMessages.length / ITEMS_PER_PAGE);

  const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) => (
    <div className="mt-6 flex justify-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-full transition ${
            currentPage === page
              ? "bg-light-primary text-white"
              : "bg-light-gray dark:bg-dark-gray text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );

  return (
    <div className="w-full min-h-screen flex bg-light-background dark:bg-dark-background font-sans text-light-text dark:text-dark-text">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-light-gray dark:bg-dark-gray p-6 transition-transform transform md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0 z-50" : "-translate-x-full"
        }`}
      >
        <button
          className="p-2 absolute top-4 right-4 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-6 h-6 text-light-text dark:text-dark-text" />
        </button>
        <h2 className="text-2xl font-bold text-light-primary dark:text-dark-primary mb-6">
          Admin Dashboard
        </h2>
        <ul className="space-y-3">
          <li>
            <button
              onClick={() => setActiveTab("profile")}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-light-accent dark:hover:bg-dark-accent transition"
            >
              <img
                src={currentUser?.profile || "/square.jpg"}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <span className="text-lg font-semibold">
                {currentUser?.lastName || "User"}
              </span>
            </button>
          </li>
          {[
            { tab: "overview", icon: <User />, label: "Overview" },
            { tab: "users", icon: <Users />, label: "Users" },
            { tab: "roles", icon: <Key />, label: "Roles" },
            {
              tab: "courseCategories",
              icon: <BookIcon />,
              label: "Course Categories",
            },
            { tab: "courses", icon: <BookOpen />, label: "Courses" },
            { tab: "sms", icon: <MessageCircle />, label: "Messages" },
            { tab: "settings", icon: <Settings />, label: "Settings" },
          ].map(({ tab, icon, label }) => (
            <li key={tab}>
              <button
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-3 p-3 w-full rounded-lg transition whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-light-primary dark:bg-dark-primary text-white"
                    : "hover:bg-light-accent dark:hover:bg-dark-accent"
                }`}
              >
                {icon} {label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 w-full">
        {/* Menu Button for Mobile */}
        <button
          className="md:hidden p-2 fixed top-4 left-4 z-50 bg-light-gray dark:bg-dark-gray rounded-full"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-6 h-6 text-light-text dark:text-dark-text" />
        </button>

        {toaster && <Toaster message={toaster.message} type={toaster.type} />}

        {/* Profile Tab */}
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

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <section className="min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-center text-light-secondary dark:text-dark-secondary">
              Dashboard Overview
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              <Card title="Users" value={users.length} icon={<Users />} />
              <Card
                title="Courses"
                value={courses.length}
                icon={<BookOpen />}
              />
              <Card
                title="Messages"
                value={messages ? messages.length : 0}
                icon={<MessageCircle />}
              />
            </div>
            <div className="bg-light-gray dark:bg-dark-gray p-6 rounded-xl shadow-lg">
              <UserExpansionTrend />
            </div>
          </section>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <section>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
              <h1 className="text-3xl font-bold mb-4 sm:mb-0 text-light-secondary dark:text-dark-secondary">
                Manage Users
              </h1>
              <input
                type="text"
                className="w-full sm:w-64 p-3 rounded-lg bg-white dark:bg-black border border-light-primary dark:border-dark-primary focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
                placeholder="Search by email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {loading ? (
              <Loader />
            ) : error ? (
              <p className="text-red-600 dark:text-red-400 text-center">
                {error}
              </p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentUsers.map((user: any) => (
                    <div
                      key={user.id}
                      className="bg-light-gray dark:bg-dark-gray p-4 rounded-xl shadow-md hover:shadow-lg transition"
                    >
                      <h3 className="text-lg font-semibold truncate">
                        {user.email}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Role: {user.roleDetail?.name || user.role || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Status: {user.status ? "Active" : "Inactive"}
                      </p>
                      <button
                        className="mt-3 bg-light-primary dark:bg-dark-primary text-white p-2 rounded-lg hover:bg-light-accent dark:hover:bg-dark-accent transition w-full flex items-center justify-center gap-2"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit size={16} /> Assign Role
                      </button>
                    </div>
                  ))}
                </div>
                <Pagination
                  currentPage={usersPage}
                  totalPages={totalUsersPages}
                  onPageChange={setUsersPage}
                />
              </>
            )}
            {selectedUser && (
              <AssignRoleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={selectedUser}
              />
            )}
          </section>
        )}

        {/* Roles Tab */}
        {activeTab === "roles" && (
          <section className="min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
              <h1 className="text-3xl font-bold mb-4 sm:mb-0 text-light-secondary dark:text-dark-secondary">
                Manage Roles
              </h1>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-light-primary dark:bg-dark-primary text-white p-3 rounded-lg hover:bg-light-accent dark:hover:bg-dark-accent transition"
              >
                + Add Role
              </button>
            </div>
            {roleLoading ? (
              <Loader />
            ) : roleError ? (
              <p className="text-red-600 dark:text-red-400 text-center">
                {roleError}
              </p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentRoles.map((role: any) => (
                    <div
                      key={role.id}
                      className="bg-light-gray dark:bg-dark-gray p-4 rounded-xl shadow-md hover:shadow-lg transition"
                    >
                      <h3 className="text-lg font-semibold">{role.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ID: {role.id}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <button
                          className="flex-1 bg-light-primary dark:bg-dark-primary text-white p-2 rounded-lg hover:bg-light-accent dark:hover:bg-dark-accent transition flex items-center justify-center gap-2"
                          onClick={() => {
                            setSelectedRole(role);
                            setIsEditModalOpen(true);
                          }}
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
                <Pagination
                  currentPage={rolesPage}
                  totalPages={totalRolesPages}
                  onPageChange={setRolesPage}
                />
              </>
            )}
            <AddRoleModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
            {selectedRole && (
              <EditRoleModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                role={selectedRole}
                onRoleUpdated={handleRoleUpdated}
              />
            )}
          </section>
        )}

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <section>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
              <h1 className="text-3xl font-bold mb-4 sm:mb-0 text-light-secondary dark:text-dark-secondary">
                Manage Courses
              </h1>
              <button
                onClick={() => setIsAddCourseModalOpen(true)}
                className="bg-light-primary dark:bg-dark-primary text-white p-3 rounded-lg hover:bg-light-accent dark:hover:bg-dark-accent transition"
              >
                + Add Course
              </button>
            </div>
            {courses.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-300">
                No courses available.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentCourses.map((course: any) => (
                    <div
                      key={course.id}
                      className="bg-light-gray dark:bg-dark-gray rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
                    >
                      <img
                        src={course.image || careerDevImg}
                        alt={course.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold truncate">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          category: {course.categoryId}
                        </p>
                        <div className="mt-4 flex gap-2">
                          <button
                            className="flex-1 bg-light-primary dark:bg-dark-primary text-white p-2 rounded-lg hover:bg-light-accent dark:hover:bg-dark-accent transition flex items-center justify-center gap-2"
                            onClick={() => {
                              setSelectedCourse(course);
                              setIsEditCourseModalOpen(true);
                            }}
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
                <Pagination
                  currentPage={coursesPage}
                  totalPages={totalCoursesPages}
                  onPageChange={setCoursesPage}
                />
              </>
            )}
            <AddCourseModal
              isOpen={isAddCourseModalOpen}
              onClose={() => setIsAddCourseModalOpen(false)}
            />
            {isEditCourseModalOpen && (
              <EditCourseModal
                isOpen={isEditCourseModalOpen}
                onClose={() => setIsEditCourseModalOpen(false)}
                course={selectedCourse}
              />
            )}
          </section>
        )}

        {/* Course Categories Tab */}
        {activeTab === "courseCategories" && (
          <section>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
              <h1 className="text-3xl font-bold mb-4 sm:mb-0 text-light-secondary dark:text-dark-secondary">
                Course Categories
              </h1>
              <button
                onClick={() => setIsAddCourseCategoryModalOpen(true)}
                className="bg-light-primary dark:bg-dark-primary text-white p-3 rounded-lg hover:bg-light-accent dark:hover:bg-dark-accent transition"
              >
                + Add Category
              </button>
            </div>
            {categoryLoading ? (
              <Loader />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentCategories.map((category: any) => (
                    <div
                      key={category.id}
                      className="bg-light-gray dark:bg-dark-gray p-4 rounded-xl shadow-md hover:shadow-lg transition"
                    >
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {category.description}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <button
                          className="flex-1 bg-light-primary dark:bg-dark-primary text-white p-2 rounded-lg hover:bg-light-accent dark:hover:bg-dark-accent transition flex items-center justify-center gap-2"
                          onClick={() => {
                            setSelectedCourseCategory(category.id);
                            setIsEditCourseCategoryModalOpen(true);
                          }}
                        >
                          <Edit size={16} /> Edit
                        </button>
                        <button
                          className="flex-1 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2"
                          onClick={() =>
                            handleDeleteCourseCategory(category.id)
                          }
                        >
                          <Trash size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination
                  currentPage={categoriesPage}
                  totalPages={totalCategoriesPages}
                  onPageChange={setCategoriesPage}
                />
              </>
            )}
            {isAddCourseCategoryModalOpen && (
              <AddCategoryModel
                isOpen={isAddCourseCategoryModalOpen}
                onClose={() => setIsAddCourseCategoryModalOpen(false)}
              />
            )}
            {isEditCourseCategoryModalOpen && (
              <EditCatModel
                isOpen={isEditCourseCategoryModalOpen}
                onClose={() => setIsEditCourseCategoryModalOpen(false)}
                categoryId={selectedCourseCategory}
              />
            )}
          </section>
        )}

        {/* Messages Tab */}
        {activeTab === "sms" && (
          <section>
            <h1 className="text-3xl font-bold mb-8 text-center text-light-secondary dark:text-dark-secondary">
              Messages
            </h1>
            {messages.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-300">
                No messages available.
              </p>
            ) : (
              <>
                <div className="space-y-6">
                  {currentMessages.map((message: any) => (
                    <div
                      key={message.id}
                      className="bg-light-gray dark:bg-dark-gray p-4 rounded-xl shadow-md hover:shadow-lg transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {message.id}
                        </p>
                        <p className="text-lg font-semibold">{message.email}</p>
                        <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                          {message.message}
                        </p>
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
                <Pagination
                  currentPage={messagesPage}
                  totalPages={totalMessagesPages}
                  onPageChange={setMessagesPage}
                />
              </>
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

export default AdminDashboard;
