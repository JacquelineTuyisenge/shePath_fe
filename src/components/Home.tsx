import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Navbar from "./NavBar";
import Footer from "./Footer";
import Login from "../auth/Login";
import heroPic from '../assets/heroPic.svg';
import AboutPage from "./About";
import CoursesList from "./Courses";
import { fadeInUp, fadeInLeft, slideInFromRight } from "./motionVariants";

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLoginButtonClick = () => {
    console.log("Login button clicked");
    setIsLoginModalOpen(true); // Open the modal
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text">
      <Navbar onLoginBtnClick={handleLoginButtonClick} />

      <motion.section className="h-screen p-2 mt-12 mx-6 flex flex-col-reverse lg:flex-row items-center justify-between" {...fadeInUp}>
        {/* Text Section */}
        <motion.div className="w-full" {...fadeInLeft}>
          <motion.h2 className="text-3xl md:text-5xl font-bold leading-tight pb-6">
            <span className="text-light-secondary">{t("journeyBegins")}</span>
          </motion.h2>
          <motion.p className="mb-4 mtext-lg md:text-xl  text-justify text-dark-gray dark:text-light-gray pb-5" {...fadeInUp}>
            {t("mission_desc")}
          </motion.p>
          <motion.button 
            className="mb-12 px-8 py-3 bg-light-primary dark:bg-dark-primary text-white text-lg font-medium rounded-lg shadow-md hover:bg-light-accent hover:dark:bg-dark-accent transition-transform duration-300 transform hover:scale-105"
            onClick={() => setIsLoginModalOpen(true)}
          >
            {t("getStarted")}
          </motion.button>
        </motion.div>

        {/* Image Section */}
        <motion.div className="w-full" {...slideInFromRight}>
          <img className="w-full" src={heroPic} alt="Hero" />
        </motion.div>
      </motion.section>


      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="pt-5 dark:bg-dark-gray bg-light-gray rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="text-xl absolute p-2 top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-gray-700"
            >
              ✖
            </button>
            <Login />
          </div>
        </div>
      )}

      <AboutPage />
      <CoursesList />
      <Footer />
    </div>
  );
};

export default HomePage;
