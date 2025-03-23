import { useEffect, useState } from "react";
import Card from "../components/Card";

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { User, BookOpen, MessageCircle, Settings, Users, Menu, X, Edit, Trash, Key, BookIcon, Edit2Icon} from "lucide-react";
import ThemeToggle from "../components/Theme";
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
import { getRoles} from "../features/roleSlice";
import { deleteRole } from "../features/roleSlice";
import EditRoleModal from "../modals/EditRoleModal";
import AssignRoleModal from "../modals/AssignRole";
import LogoutButton from "../auth/Logout";
import UserExpansionTrend from "../features/UserChart";
import { getProfile, editProfile } from "../features/userSlice"; 
import { Link } from "react-router-dom";
import Toaster from "../components/Toaster";
import Loader from "../components/Loader";


const AdminDashboard = () => {
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const { users, loading, error } = useAppSelector((state: any) => state.users);
  const { currentUser , loading: userLoading } = useSelector((state: RootState) => state.users); 
  const {courses} = useAppSelector((state: any) => state.courses);
  const { messages } = useAppSelector((state: RootState) => state.sms);
  const {categories = [], loading: categoryLoading} = useAppSelector((state: any) => state.categories);
  const { roles, loading: roleLoading, error: roleError } = useAppSelector((state: any) => state.roles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [isEditCourseCategoryModalOpen, setIsEditCourseCategoryModalOpen] = useState(false);
  const [selectedCourse, setselectedCourse] = useState(null);
  const [selectedCourseCategory, setselectedCourseCategory] = useState(null);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isAddCourseCategoryModalOpen, setIsAddCourseCategoryModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [toaster, setToaster] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

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
    dispatch(getRoles());
    dispatch(getUsers());
    dispatch(getMessages());
    dispatch(fetchCourseCategories());
    dispatch(fetchCourses());
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
          birthDate: currentUser .birthDate || '',
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

  const handleDelete = (id: string) => {
    dispatch(deleteRole(id));
  };

  const handleDeleteCourse = (id:string) => {
    dispatch(deleteCourse(id));
  };

  const handleDeleteCourseCategory = (id: string) => {
    dispatch(deleteCourseCategory(id));
  };

  const [activeTab, setActiveTab] = useState("overview");
  const [SidebarOpen, setSidebarOpen] = useState(false);

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
        className={`fixed inset-y-0 left-0 w-64 bg-light-gray dark:bg-dark-gray p-6 transition-transform transform md:relative md:translate-x-0 ${SidebarOpen ? "translate-x-0 z-50" : "-translate-x-full"}`}
      >
        <button
          className="p-2 absolute top-4 right-4 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-6 h-6 dark:text-dark-text" />
        </button>

        <h2 className="text-2xl font-bold text-light-primary mb-6">Admin Dashboard</h2>
        <ul className="space-y-4">
          <li>
            <button
            onClick={() => setActiveTab("profile")}
            >
              <img 
                src={currentUser ?.profile || "/square.jpg"} 
                alt="Profile" 
                className="w-12 h-12 rounded-full mr-2" 
            />
              <span className="text-lg font-semibold text-light-text dark:text-dark-text">{currentUser ?.firstName} {currentUser ?.lastName}</span>
            </button>
          </li>          
          <li>
              <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${activeTab === "overview" ? "bg-light-primary text-white" : "hover:bg-light-secondary"}`}
              >
                  <User  /> Overview
              </button>
          </li>
          <li>
              <button
                  onClick={() => setActiveTab("users")}
                  className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${activeTab === "users" ? "bg-light-primary text-white" : "hover:bg-light-secondary"}`}
              >
                  <Users /> Users
              </button>
          </li>
          <li>
              <button
                  onClick={() => setActiveTab("roles")}
                  className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${activeTab === "roles" ? "bg-light-primary text-white" : "hover:bg-light-secondary"}`}
              >
                  <Key /> Roles
              </button>
          </li>
          <li>
              <button
                  onClick={() => setActiveTab("courseCategories")}
                  className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${activeTab === "courseCategories" ? "bg-light-primary text-white" : "hover:bg-light-secondary"}`}
              >
                  <BookIcon /> Course Categories
              </button>
          </li>
          <li>
              <button
                  onClick={() => setActiveTab("courses")}
                  className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${activeTab === "courses" ? "bg-light-primary text-white" : "hover:bg-light-secondary"}`}
              >
                  <BookOpen /> Courses
              </button>
          </li>
          <li>
              <button
                  onClick={() => setActiveTab("sms")}
                  className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${activeTab === "sms" ? "bg-light-primary text-white" : "hover:bg-light-secondary"}`}
              >
                  <BookOpen /> Messages
              </button>
          </li>
          <li>
              <button
                  onClick={() => setActiveTab("settings")}
                  className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${activeTab === "settings" ? "bg-light-primary text-white" : "hover:bg-light-secondary"}`}
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
        {/* profile tabl */}

        {activeTab === "profile" &&(
          <section className="w-full justify-center items-center mt-12 p-6 text-justify dark:text-dark-text">
            {toaster && <Toaster message={toaster.message} type={toaster.type} />}
            
          <h1 className="text-2xl font-bold mb-4 text-center">Welcome, {userLoading ? <Loader /> : currentUser ?.firstName}!</h1>
          {currentUser  && (
            <div className="text-center">
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
              <div className="border border-light-secondary mt-9 p-5 space-y-6">
                <form onSubmit={handleEditProfile} className="flex flex-col space-y-4">
                  <label className="p-3">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="text-light-text p-3"
                    value={formData.email}
                    onChange={handleChange}
                    readOnly
                  />

                  <label className="p-3">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    className="text-light-text p-3"
                    value={formData.firstName}
                    onChange={handleChange}
                  />

                  <label className="p-3">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    className="text-light-text p-3"
                    value={formData.lastName}
                    onChange={handleChange}
                  />

                  <label className="p-3">Gender</label>
                  <input
                    type="text"
                    name="gender"
                    className="text-light-text p-3"
                    value={formData.gender}
                    onChange={handleChange}
                  />

                  <label className="p-3">Birth Date</label>
                  <input
                    type="date"
                    name="birthDate"
                    className="text-light-text p-3"
                    value={formData.birthDate}
                    onChange={handleChange}
                  />

                  <label className="p-3">Country</label>
                  <input
                    type="text"
                    name="country"
                    className="text-light-text p-3"
                    value={formData.country}
                    onChange={handleChange}
                  />

                  <label className="p-3">City</label>
                  <input
                    type="text"
                    name="city"
                    className="text-light-text p-3"
                    value={formData.city}
                    onChange={handleChange}
                  />

                  <label className="p-3">Address</label>
                  <input
                    type="text"
                    name="address"
                    className="text-light-text p-3"
                    value={formData.address}
                    onChange={handleChange}
                  />

                  <label className="p-3">Phone</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    className="text-light-text p-3"
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
          <p className="text-gray-600 dark:text-gray-300 mt-5">
            Continue your journey and achieve your learning goals.
          </p>
          </section>          
        )}

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <section className="text-justify dark:text-dark-text">
            <h1 className="text-2xl font-bold m-5 text-center">Admin Dashboard Overview</h1>
            <div className="m-4 flex flex-col sm:flex-row justify-around items-center gap-4">
              <Card title="Users" value={users.length} icon={<Users />} />
              <Card title="Courses" value={courses.length} icon={<BookOpen />} />
              <Card title="Messages" value={messages? messages.length: 0} icon={<MessageCircle />} />
            </div>
            <div className="mt-10 text-center">
              <UserExpansionTrend />
            </div>
          </section>
        )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <section className="text-justify dark:text-dark-text">
          <div className="flex flex-col sm:flex-row justify-around items-center">
            <h1 className="text-2xl font-bold mb-4 text-center">Manage Users</h1>
            <form onSubmit={(e) => e.preventDefault()}>
              <input 
                type="text" 
                className="m-2 p-2 rounded border border-orange-500 bg-light-gray focus:border-orange-600 focus:ring-0" 
                placeholder="Search by email" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
          </form>
          </div>
          {loading ? (
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          ) : error ? (
            <p className="text-red-600 dark:text-red-700">{error}</p>
          ) : (
            <table className="w-full table-auto border-collapse text-sm">
              <thead>
                <tr className="text-left bg-light-primary dark:bg-dark-primary text-white">
                  <th className="p-3">ID</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">First Name</th>
                  <th className="p-3">Last Name</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter((user: { email: string; }) => user.email.toLowerCase().includes(searchTerm.toLowerCase())) // Filter users by email
                  .map((item: any) => (
                    <tr key={item.id} className="border-b hover:bg-light-gray dark:hover:bg-dark-gray">
                      <td className="p-3">{item.id}</td>
                      <td className="p-3">{item.email}</td>
                      <td className="p-3">{item.firstName}</td>
                      <td className="p-3">{item.lastName}</td>
                      <td className="p-3">{item.role}</td>
                      <td className="p-3">{item.status ? "Active" : "Inactive"}</td>
                      <td className="p-3">
                        <button 
                          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
                          onClick={() => {
                            setSelectedUser (item);
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {/* Assign Role Modal */}
          {isModalOpen && selectedUser  && (
            <AssignRoleModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              user={selectedUser }
            />
          )}
        </section>
      )}

        {/* Roles Tab */}
        {activeTab === "roles" && (
          <section className="text-justify dark:text-dark-text">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold mb-4 text-center">Manage Roles</h1>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-dark-secondary text-white p-2 rounded-md hover:bg-pink-400 transition">Add Role</button>
            </div>

            {roleLoading ? (
              <p className="text-gray-600 dark:text-gray-300">Loading...</p>
            ) : roleError ? (
              <p className="text-red-600 dark:text-red-700">{roleError}</p>
            ): (
              <table className="w-full table-auto border-collapse text-sm">
              <thead>
                <tr className="text-left bg-light-primary dark:bg-dark-primary text-white">
                  <th className="p-3">ID</th>
                  <th className="p-3">Role Name</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role: any) => (
                  <tr key={role.id} className="border-b hover:bg-light-gray dark:hover:bg-dark-gray">
                    <td className="p-3">{role.id}</td>
                    <td className="p-3">{role.name}</td>
                    <td className="p-3 flex gap-2">
                      <button 
                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
                        onClick={() => {
                          setSelectedRole(role); 
                          setIsEditModalOpen(true);
                        }}
                        >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition"
                        onClick={() => handleDelete(role.id)}
                        >
                        <Trash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}

            {/* Add Role Modal */}
            <AddRoleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Edit Role Modal */}
            
            {isEditModalOpen && <EditRoleModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} role={selectedRole} />}
          </section>
        )}

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <section className="text-justify dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-4 text-center">Manage Courses</h1>
            <button
              onClick={() => setIsAddCourseModalOpen(true)}
              className="bg-dark-secondary text-white p-2 mb-2 rounded-md hover:bg-green-600 transition"
            >
              + Add
            </button>
            <table className="w-full table-auto border-collapse text-sm">
              <thead>
                <tr className="text-left bg-light-primary dark:bg-dark-primary text-white">
                  <th className="p-3">ID</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">description</th>
                  <th className="p-3">Content</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course: any) => (
                  <tr key={course.id} className="border-b hover:bg-light-gray dark:hover:bg-dark-gray">
                    <td className="p-3">{course.id}</td>
                    <td className="p-3">{course.title}</td>
                    <td className="p-3">{course.description}</td>
                    <td className="p-3">{course.content}</td>
                    <td className="p-3">{course.categoryId}</td>
                    <td className="p-3 flex gap-2">
                    <button 
                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
                        onClick={() => {
                          setselectedCourse(course); 
                          setIsEditCourseModalOpen(true);
                        }}
                        >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition"
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <AddCourseModal isOpen={isAddCourseModalOpen} onClose={() => setIsAddCourseModalOpen(false)} />
            {isEditCourseModalOpen && (
            <EditCourseModal
              isOpen={isEditCourseModalOpen}
              onClose={() => setIsEditCourseModalOpen(false)}
              course={selectedCourse} 
            />
            )}

            {/* {isEditCourseModalOpen && <EditCourseModal isOpen={isEditCourseModalOpen} onClose={() => setIsEditCourseModalOpen(false)} course={selectedCourse} />} */}

          </section>
        )}

        {/* CourseCategories Tab */}
        {activeTab === "courseCategories" && (
          <section className="text-justify dark:text-dark-text">
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold mb-4 text-center">Course Categories</h1>
              <button
                onClick={() => setIsAddCourseCategoryModalOpen(true)}
                className="bg-dark-secondary text-white p-2 mb-2 rounded-md hover:bg-green-600 transition"
              >
                + Add
              </button>
            </div>

            {/* Loading Spinner */}
            {categoryLoading ? (
              <div className="flex justify-center items-center py-6">
                <div className="animate-spin border-t-4 border-green-500 border-solid w-12 h-12 rounded-full"></div>
              </div>
            ) : (
              <table className="w-full table-auto border-collapse text-sm">
                <thead>
                  <tr className="text-left bg-light-primary dark:bg-dark-primary text-white">
                    <th className="p-3">ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category: any) => (
                    <tr key={category.id} className="border-b hover:bg-light-gray dark:hover:bg-dark-gray">
                      <td className="p-3">{category.id}</td>
                      <td className="p-3">{category.name}</td>
                      <td className="p-3">{category.description}</td>
                      <td className="p-3 flex gap-2">
                        <button 
                          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
                          onClick={() => {
                            setselectedCourseCategory(category.id); 
                            setIsEditCourseCategoryModalOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition"
                          onClick={() => handleDeleteCourseCategory(category.id)}
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Modals */}
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

        {/* Programs Tab */}
        {activeTab === "sms" && (
          <section className="text-justify dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-4 text-center">Messages</h1>
            <table className="w-full table-auto border-collapse text-sm">
              <thead>
                <tr className="text-left bg-light-primary dark:bg-dark-primary text-white">
                  <th className="p-3">ID</th>
                  <th className="p-3">Sender</th>
                  <th className="p-3">Message</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message: any) => (
                  <tr key={message.id} className="border-b hover:bg-light-gray dark:hover:bg-dark-gray">
                    <td className="p-3">{message.id}</td>
                    <td className="p-3">{message.email}</td>
                    <td className="p-3">{message.message}</td>
                    <td className="p-3 flex gap-2">
                      <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition">
                        <Trash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <section className="text-justify dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-4 text-center">Admin Settings</h1>
            <div className="space-y-4">
              <div>
                <label htmlFor="theme" className="block text-sm">Theme</label>
                <select id="theme" className="w-full p-2 border rounded-md dark:bg-dark-background">
                  <option value="light">Light Mode</option>
                  <option value="dark">Dark Mode</option>
                </select>
              </div>
              <div>
                <label htmlFor="user-settings" className="block text-sm">User Settings</label>
                <select id="user-settings" className="w-full p-2 border rounded-md dark:bg-dark-background">
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
