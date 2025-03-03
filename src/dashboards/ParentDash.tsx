import React, { useState } from "react";
import { BookOpen, Users, MessageSquare, Menu, X } from "lucide-react";
import ThemeToggle from "../components/Theme";
import LogoutButton from "../auth/Logout";
import { Link } from "react-router-dom";

const ParentDashboard = () => {
  const [activeTab, setActiveTab] = useState("awareness");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-light-background dark:bg-dark-background">
      {/* Mobile Sidebar Button */}
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
        <button
          className="p-2 absolute top-4 right-4 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-6 h-6 dark:text-dark-text" />
        </button>

        <h2 className="text-xl font-bold text-light-primary mb-6">Parent Space</h2>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => setActiveTab("awareness")}
              className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${
                activeTab === "awareness" ? "bg-light-primary text-white" : "hover:bg-light-secondary"
              }`}
            >
              <BookOpen /> Education Awareness
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("parenting")}
              className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${
                activeTab === "parenting" ? "bg-light-primary text-white" : "hover:bg-light-secondary"
              }`}
            >
              <Users /> Parenting & Support
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("community")}
              className={`flex items-center gap-2 p-3 w-full rounded-lg transition dark:text-dark-text ${
                activeTab === "community" ? "bg-light-primary text-white" : "hover:bg-light-secondary"
              }`}
            >
              <MessageSquare /> Community & Discussions
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
        {activeTab === "awareness" && (
          <section className="text-justify dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-4 text-center">Education Awareness</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Learn why education is crucial for your child's future and how you can support their learning journey.
            </p>
          </section>
        )}
        {activeTab === "parenting" && (
          <section className="text-justify dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-4 text-center">Parenting & Support</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Find guidance on how to build a strong relationship with your children and talk about important topics.
            </p>
          </section>
        )}
        {activeTab === "community" && (
          <section className="text-justify dark:text-dark-text">
            <h1 className="text-2xl font-bold mb-4 text-center">Community & Discussions</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Join discussions with other parents to share experiences and advice.
            </p>
          </section>
        )}
      </main>
    </div>
  );
};

export default ParentDashboard;
