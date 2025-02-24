import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User, BookOpen, Award, Settings, Users, Menu, X, Edit, Trash, Key, Lock } from "lucide-react";
import ThemeToggle from "./Theme";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [SidebarOpen, setSidebarOpen] = useState(false);

  // Hardcoded data for now
  const users = [
    { id: 1, name: "Alice", role: "Learner", status: "Active" },
    { id: 2, name: "John", role: "Mentor", status: "Active" },
    { id: 3, name: "Jane", role: "Parent", status: "Inactive" },
  ];

  const courses = [
    { id: 1, title: "Math 101", instructor: "Mr. Smith", status: "Active" },
    { id: 2, title: "Science 101", instructor: "Ms. Johnson", status: "Inactive" },
  ];

  const programs = [
    { id: 1, name: "STEM Program", description: "Science, Technology, Engineering, and Math.", status: "Ongoing" },
    { id: 2, name: "Arts Program", description: "Creative Arts and Literature.", status: "Completed" },
  ];

  const roles = [
    { id: 1, name: "Admin", permissions: "Full Access" },
    { id: 2, name: "Mentor", permissions: "View and Edit Courses" },
    { id: 3, name: "Learner", permissions: "Access Courses" },
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

        <h2 className="text-xl font-bold text-light-primary mb-6">Admin Dashboard</h2>
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <section className="text-justify dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-4 text-center">Admin Dashboard Overview</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage users, courses, and programs effectively.</p>
          </section>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <section className="text-justify dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-4 text-center">Manage Users</h1>
            <table className="w-full table-auto border-collapse text-sm">
              <thead>
                <tr className="text-left bg-light-primary dark:bg-dark-primary text-white">
                  <th className="p-3">ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b hover:bg-light-gray dark:hover:bg-dark-gray">
                    <td className="p-3">{user.id}</td>
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3">{user.status}</td>
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

        {/* Roles Tab */}
        {activeTab === "roles" && (
          <section className="text-justify dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-4 text-center">Manage Roles</h1>
            <table className="w-full table-auto border-collapse text-sm">
              <thead>
                <tr className="text-left bg-light-primary dark:bg-dark-primary text-white">
                  <th className="p-3">ID</th>
                  <th className="p-3">Role Name</th>
                  <th className="p-3">Permissions</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map(role => (
                  <tr key={role.id} className="border-b hover:bg-light-gray dark:hover:bg-dark-gray">
                    <td className="p-3">{role.id}</td>
                    <td className="p-3">{role.name}</td>
                    <td className="p-3">{role.permissions}</td>
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
