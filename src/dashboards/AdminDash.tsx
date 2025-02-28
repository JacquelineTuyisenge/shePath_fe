import React, { useEffect, useState } from "react";
import Card from "../components/Card";

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { User, BookOpen, Award, Settings, Users, Menu, X, Edit, Trash, Key, Lock, Car } from "lucide-react";
import ThemeToggle from "../components/Theme";
import { AppDispatch, RootState } from "../store";

import AddRoleModal from "../modals/AddRole";
import { getUsers } from "../features/userSlice";
import { getRoles} from "../features/roleSlice";
import { deleteRole } from "../features/roleSlice";
import EditRoleModal from "../modals/EditRoleModal";
import AssignRoleModal from "../modals/AssignRole";

import LogoutButton from "../auth/Logout";
import UserExpansionTrend from "../features/UserChart";
import { Link } from "react-router-dom";


const AdminDashboard = () => {
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((state: any) => state.users);
  const { roles, loading: roleLoading, error: roleError } = useAppSelector((state: any) => state.roles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(getRoles());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);


  const handleDelete = (id: string) => {
    dispatch(deleteRole(id));
  };

  const [activeTab, setActiveTab] = useState("overview");
  const [SidebarOpen, setSidebarOpen] = useState(false);

  const courses = [
    { id: 1, title: "Math 101", instructor: "Mr. Smith", status: "Active" },
    { id: 2, title: "Science 101", instructor: "Ms. Johnson", status: "Inactive" },
  ];

  const programs = [
    { id: 1, name: "STEM Program", description: "Science, Technology, Engineering, and Math.", status: "Ongoing" },
    { id: 2, name: "Arts Program", description: "Creative Arts and Literature.", status: "Completed" },
  ];

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
        className={`fixed inset-y-0 left-0 w-64 bg-light-gray dark:bg-dark-gray p-6 transition-transform transform md:relative md:translate-x-0 ${SidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button
          className="p-2 absolute top-4 right-4 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-6 h-6 dark:text-dark-text" />
        </button>

        <h2 className="text-md font-bold text-light-primary mb-6">Admin Dashboard</h2>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${activeTab === "overview" ? "bg-light-primary text-white" : "hover:bg-light-secondary"}`}
            >
              <User /> Overview
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
              onClick={() => setActiveTab("courses")}
              className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${activeTab === "courses" ? "bg-light-primary text-white" : "hover:bg-light-secondary"}`}
            >
              <BookOpen /> Courses
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("programs")}
              className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${activeTab === "programs" ? "bg-light-primary text-white" : "hover:bg-light-secondary"}`}
            >
              <Award /> Programs
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
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <section className="text-justify dark:text-dark-text">
            <h1 className="text-2xl font-bold m-5 text-center">Admin Dashboard Overview</h1>
            <div className="m-4 flex flex-wrap justify-around items-center gap-4">
              <Card title="Users" value={users.length} icon={<Users />} />
              <Card title="Courses" value={courses.length} icon={<BookOpen />} />
              <Card title="Programs" value={programs.length} icon={<Award />} />
            </div>
            <div className="mt-10 text-center">
              <UserExpansionTrend />
            </div>
          </section>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <section className="text-justify dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-4 text-center">Manage Users</h1>
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
                {users.map((item: any) => (
                  <tr key={item.id} className="border-b hover:bg-light-gray dark:hover:bg-dark-gray">
                    <td className="p-3">{item.id}</td>
                    <td className="p-3">{item.email}</td>
                    <td className="p-3">{item.firstName}</td>
                    <td className="p-3">{item.lastName}</td>
                    <td className="p-3">{item.role}</td>
                    <td className="p-3">{item.status? "Active" : "Inactive"}</td>
                    <td className="p-3 flex gap-2">
                      <button 
                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
                        onClick={() => {
                          setSelectedUser(item);
                          setIsModalOpen(true);
                        }}
                        >
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
            )}

            {/* Assign Role Modal */}
            {isModalOpen && selectedUser && (
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
            <table className="w-full table-auto border-collapse text-sm">
              <thead>
                <tr className="text-left bg-light-primary dark:bg-dark-primary text-white">
                  <th className="p-3">ID</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Instructor</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course.id} className="border-b hover:bg-light-gray dark:hover:bg-dark-gray">
                    <td className="p-3">{course.id}</td>
                    <td className="p-3">{course.title}</td>
                    <td className="p-3">{course.instructor}</td>
                    <td className="p-3">{course.status}</td>
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

        {/* Programs Tab */}
        {activeTab === "programs" && (
          <section className="text-justify dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-4 text-center">Manage Programs</h1>
            <table className="w-full table-auto border-collapse text-sm">
              <thead>
                <tr className="text-left bg-light-primary dark:bg-dark-primary text-white">
                  <th className="p-3">ID</th>
                  <th className="p-3">Program Name</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {programs.map(program => (
                  <tr key={program.id} className="border-b hover:bg-light-gray dark:hover:bg-dark-gray">
                    <td className="p-3">{program.id}</td>
                    <td className="p-3">{program.name}</td>
                    <td className="p-3">{program.description}</td>
                    <td className="p-3">{program.status}</td>
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
