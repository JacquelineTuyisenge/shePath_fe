import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import LanguageToggle from "./Translate";
import Footer from "./Footer";
import ThemeToggle from "./Theme";
import Login from "../auth/Login";
import { Link } from "react-router-dom";
import heroPic from '../assets/heroPic.svg'
import AboutPage from "./About";
import { fadeInUp, fadeInLeft, fadeInRight} from "./motionVariants";
import {Menu, X, UserCircle} from 'lucide-react';
import CoursesList from "./Courses";


const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const getDashboardRoute = () => {
    switch (userRole) {
      case "Admin": return "/admin";
      case "Learner": return "/learner";
      case "Mentor": return "/mentor";
      case "Parent": return "/parent";
      default: return "/";
    }
  };

  return (
    <div className="min-h-screen w-full bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text">
      <nav className="bg-light-gray dark:bg-dark-gray p-4 flex justify-between items-center shadow-md">
        <div className="flex justify-between items-center">
          <div className="flex justify-center items-center">
            <h1 className="text-light-primary font-bold px-2 text-2xl">ShePath</h1>
            {/* hamburg menu */}
            <button onClick={toggleMenu} className="md:hidden text-light-primary">
              {isOpen ? <X /> : 
              <Menu />}
            </button>
          </div>
          <ul className="hidden md:flex space-x-6 items-center">
            <li className="hover:text-light-primary cursor-pointer">{t("home")}</li>
            <li><Link to="/about">About</Link></li>
            <li className="hover:text-light-primary cursor-pointer">Programs</li>
            <li className="hover:text-light-primary cursor-pointer">Contact</li>
          </ul>
        </div>
          {/* Theme & Language Toggle + Login Button (Desktop) */}
        <div className="hidden md:flex space-x-4">
          <LanguageToggle />
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
            <Link to={getDashboardRoute()} className="px-6 py-2 bg-light-primary text-white rounded hover:transition-transform duration-300 transform hover:scale-105">
              Dashboard
            </Link>
            <UserCircle className="w-8 h-8 text-light-primary cursor-pointer" />
          </div>
          ) : (
            <button 
            onClick={openLoginModal}
            className="px-6 py-2 bg-light-primary text-white rounded hover:bg-light-accent transition"
          >
            Login
          </button>
          )}
        </div>
      </nav>

      {isOpen && (
        <div className="md:hidden">
            <div className="flex flex-col w-40 bg-light-gray dark:bg-dark-gray p-2 space-x-2 mt-4 items-start justify-center">
              <ul className="space-y-2 text-justify px-6">
                <li className="hover:text-light-primary cursor-pointer">{t("home")}</li>
                <li><Link to="/about">About</Link></li>
                <li className="hover:text-light-primary cursor-pointer">Programs</li>
                <li className="hover:text-light-primary cursor-pointer">Contact</li>
              </ul>
              <ul className="flex text-justify">
                <LanguageToggle />
                <ThemeToggle />
              </ul>
                {isAuthenticated ? (
                  <div className="flex gap-2 m-2">
                  <Link to={getDashboardRoute()} className="p-2 bg-light-primary text-white rounded hover:bg-blue-600 transition">
                    Dashboard
                  </Link>
                  <UserCircle className="w-8 h-8 text-light-primary cursor-pointer" />
                </div>
                ) : (
                  <button 
                  onClick={openLoginModal}
                  className="px-6 py-2 bg-light-primary text-white rounded hover:bg-light-accent transition"
                >
                  Login
                </button>
                )}
            </div>
        </div>
        )}

      <motion.section
        className="p-2 m-6 flex flex-col-reverse md:flex-row items-center justify-between" {...fadeInRight}>
        <div className="w-full">
          <motion.h2
            className="text-4xl md:text-4xl font-bold leading-tight" {...fadeInLeft}>
            <span className="text-light-secondary">Your Journey Begins Here!</span>  
            <br />
          </motion.h2>
          <motion.p className="mt-4 text-justify text-lg text-dark-gray dark:text-light-gray" {...fadeInUp}>
            {t("join")}
          </motion.p>
          <motion.button
            className="mt-6 px-8 py-3 bg-light-primary dark:bg-dark-primary text-white text-lg font-medium rounded-lg shadow-md hover:bg-light-accent hover:dark:bg-dark-accent transition-transform duration-300 transform hover:scale-105"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Get Started
          </motion.button>
        </div>

        <motion.div
          className="w-full" {...fadeInRight}
        > 
        <img 
        className="w-full"
        src={heroPic} ></img>
        </motion.div>
      </motion.section>
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="g-white dark:bg-dark-gray bg-light-gray rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
            onClick={closeLoginModal}
            className="text-xl absolute p-2 top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-gray-700"
            >
              ✖
            </button>
            <Login />
          </div>
        </div>
      )}

      {/* About Section */}
      <AboutPage />

      {/* Courses Section */}
      <CoursesList />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
