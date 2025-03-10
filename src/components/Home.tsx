import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import LanguageToggle from "./Translate";
import Footer from "./Footer";
import ThemeToggle from "./Theme";
import Login from "../auth/Login";
import { Link, useNavigate } from "react-router-dom";
import heroPic from '../assets/heroPic.svg'
import AboutPage from "./About";
import { fadeInUp, fadeInLeft, fadeInRight} from "./motionVariants";
import {Menu, X, UserCircle} from 'lucide-react';
import CoursesList from "./Courses";
import { FaSignInAlt } from "react-icons/fa";


const HomePage: React.FC = () => {
  const { t } = useTranslation(); // Initialize translation hook
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

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

  const scrollToContact = () => {
    const contactElement = document.getElementById("contact");
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen w-full bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text">
      <nav className="bg-light-gray dark:bg-dark-gray p-4 flex justify-between items-center shadow-md">
        <div className="flex justify-between items-center">
          <div className="flex justify-between space-x-40">
            <button onClick={() => navigate("/")}>
              <h1 className="text-light-primary font-bold px-2 text-2xl">ShePath</h1>
            </button>
            {/* hamburg menu */}
            <button onClick={toggleMenu} className="md:hidden text-light-primary">
              {isOpen ? <X /> : 
              <Menu />}
            </button>
          </div>
          <ul className="hidden md:flex px-4 space-x-4 items-center">
            <li className="hover:text-light-primary cursor-pointer"><Link to="/about">{t("about")}</Link></li> {/* Translated About text */}
            <li className="hover:text-light-primary cursor-pointer"><Link to="/courses">{t("programs")}</Link></li> {/* Translated Programs text */}
            <li className="hover:text-light-primary cursor-pointer">
             <button onClick={scrollToContact}>{t("contact")}</button> {/* Translated Contact text */}
            </li>
          </ul>
        </div>
          {/* Theme & Language Toggle + Login Button (Desktop) */}
        <div className="hidden md:flex space-x-4">
          <LanguageToggle />
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
            <Link to={getDashboardRoute()} className="px-6 py-2 bg-gray-200 dark:bg-gray-600 rounded hover:transition-transform duration-300 transform hover:scale-105">
              {t("dashboard")}
            </Link> {/* Translated Dashboard */}
            <UserCircle className="w-8 h-8 text-light-primary cursor-pointer" />
          </div>
          ) : (
            <button 
              onClick={openLoginModal}
              className="flex items-center space-x-2 p-2 text-white rounded hover:bg-light-accent transition"
            >
              <FaSignInAlt size={20} /> {/* The Login icon */}
              <span>{t("login")}</span> {/* Translated Login */}
            </button>

          )}
        </div>
      </nav>

      {isOpen && (
        <div className="md:hidden">
            <div className="flex w-fit bg-light-gray dark:bg-dark-gray p-4 space-x-2 space-y-2 m-4 items-center justify-center">
              <ul className="space-y-2 text-justify px-6">
                <li className="hover:text-light-primary cursor-pointer"><Link to="/about">{t("about")}</Link></li> {/* Translated About */}
                <li className="hover:text-light-primary cursor-pointer"><Link to="/courses">{t("programs")}</Link></li> {/* Translated Programs */}
                <li className="hover:text-light-primary cursor-pointer">{t("contact")}</li> {/* Translated Contact */}
              </ul>
              <div>
                <div className="flex light:bg-gray-400 rounded">
                  <LanguageToggle />
                  <ThemeToggle />
                </div>
                  {isAuthenticated ? (
                    <div className="flex flex-col gap-2 m-2">
                    <Link to={getDashboardRoute()} className="p-2 bg-gray-200 dark:bg-gray-600 rounded hover:transition-transform duration-300 hover:scale-105">
                      {t("dashboard")}
                    </Link> {/* Translated Dashboard */}
                    <UserCircle className="w-8 h-8 text-light-primary cursor-pointer" />
                  </div>
                  ) : (
                    <button 
                      onClick={openLoginModal}
                      className="flex items-center space-x-2 p-2 rounded hover:bg-light-accent hover:text-white transition"
                    >
                      <FaSignInAlt size={20} /> {/* The Login icon */}
                      <span>{t("login")}</span> {/* Translated Login */}
                    </button>
                  )}
              </div>
            </div>
        </div>
        )}

      <motion.section
        className="p-2 m-6 flex flex-col-reverse md:flex-row items-center justify-between" {...fadeInRight}>
        <div className="w-full">
          <motion.h2
            className="text-4xl md:text-4xl font-bold leading-tight" {...fadeInLeft}>
            <span className="text-light-secondary">{t("journeyBegins")}</span> {/* Translated Journey Begins */}
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
            {t("getStarted")} {/* Translated Get Started */}
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
      <div className="contact" id="contact">
      <Footer />
      </div>
    </div>
  );
};

export default HomePage;
