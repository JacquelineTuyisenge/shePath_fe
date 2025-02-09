import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import LanguageToggle from "./Translate";
import ThemeToggle from "./Theme";
import Login from "../auth/Login";
import { Link } from "react-router-dom";
import Programs from "./Programs";
import heroPic from '../assets/heroPic.svg'
import AboutPage from "./About";
import { fadeInUp, fadeInLeft, fadeInRight} from "./motionVariants";

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <div className="min-h-screen bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text">
      <nav className="bg-light-gray dark:bg-dark-gray p-4 flex justify-between items-center shadow-md">
        <ul className="flex space-x-6 items-center">
          <h1 className="text-light-primary font-bold text-2xl">ShePath</h1>
          <li className="hover:text-light-primary cursor-pointer">{t("home")}</li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li className="hover:text-light-primary cursor-pointer">Programs</li>
          <li className="hover:text-light-primary cursor-pointer">Contact</li>
        </ul>
        <ul className="flex space-x-6 items-center">
          <LanguageToggle />
          <ThemeToggle />
          <button
            onClick={openLoginModal}
            className="px-6 py-2 bg-light-primary text-white rounded hover:bg-light-accent transition-colors duration-200"
          >
            Login
          </button>
        </ul>
      </nav>

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

      {/* Programs Section */}
      <Programs />

      {/* Footer */}
      <footer className="p-6 bg-light-gray dark:bg-dark-gray text-center">
        <p>&copy; {new Date().getFullYear()} ShePath. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
