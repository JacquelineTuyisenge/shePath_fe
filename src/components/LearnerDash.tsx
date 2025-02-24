import React from "react";
import { Link } from "react-router-dom";
import { User, BookOpen, Award, MessageSquare, Settings, Menu, X } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./Theme";

const LearnerDashboard = () => {
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
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center  gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${
                    activeTab === "overview" ? "bg-light-primary text-white" : "hover:bg-light-secondary"
                }`}
            >
              <User /> Dashboard
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
              onClick={() => setActiveTab("achievements")}
              className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${
                    activeTab === "achievements" ? "bg-light-primary text-white" : "hover:bg-light-secondary"
                }`}
            >
              <Award /> Achievements
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
          <section className="text-justify dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-4 text-center">Welcome, Learner!</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Continue your journey and achieve your learning goals.
            </p>
          </section>
        )}
        {activeTab === "courses" && (
          <section className="text-justify dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-4 text-center">My Courses</h1>
            <p className="text-gray-600 dark:text-gray-300">No courses enrolled yet.</p>
          </section>
        )}
        {activeTab === "achievements" && (
          <section className="text-justify dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-4 text-center">Achievements</h1>
            <p className="text-gray-600 dark:text-gray-300">Earn badges as you progress!</p>
          </section>
        )}
        {activeTab === "community" && (
          <section className="text-justify dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-4 text-center">Community</h1>
            <p className="text-gray-600 dark:text-gray-300">Join discussions and connect with peers.</p>
          </section>
        )}
        {activeTab === "settings" && (
          <section className="text-justify dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-4 text-center">Settings</h1>
            <p className="text-gray-600 dark:text-gray-300">Update your preferences.</p>
          </section>
        )}
      </main>
    </div>
  );
};

export default LearnerDashboard;
