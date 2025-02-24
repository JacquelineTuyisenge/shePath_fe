import React, { useState } from "react";
import { User, MessageSquare, BookOpen, Users, ClipboardList, Settings, Menu, X } from "lucide-react";
import ThemeToggle from "./Theme";

const MentorDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${
                activeTab === "overview" ? "bg-light-primary text-white" : "hover:bg-light-secondary"
              }`}
            >
              <User /> Overview
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
              onClick={() => setActiveTab("resources")}
              className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${
                activeTab === "resources" ? "bg-light-primary text-white" : "hover:bg-light-secondary"
              }`}
            >
              <BookOpen /> Resources
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("progress")}
              className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${
                activeTab === "progress" ? "bg-light-primary text-white" : "hover:bg-light-secondary"
              }`}
            >
              <ClipboardList /> Progress Reports
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {activeTab === "overview" && (
          <section className="dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-4 text-center">Welcome, Mentor!</h1>
            <p className="text-gray-600 dark:text-gray-300">Guide and inspire learners to achieve their dreams.</p>
          </section>
        )}
        {activeTab === "learners" && (
          <section className="dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-4 text-center">My Learners</h1>
            <p className="text-gray-600 dark:text-gray-300">View and support learners under your mentorship.</p>
          </section>
        )}
        {activeTab === "messages" && (
          <section className="dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-4 text-center">Messages</h1>
            <p className="text-gray-600 dark:text-gray-300">Communicate with learners for guidance and support.</p>
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
