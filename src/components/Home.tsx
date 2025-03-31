import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Navbar from "./NavBar";
import Footer from "./Footer";
import Login from "../auth/Login";
import CoursesList from "./Courses";
import Toaster from "./Toaster"; // Import Toaster
import heroPic from "../assets/heroPic.svg";
import AboutPage from "./About";
import { fadeInUp, fadeInLeft, slideInFromRight } from "./motionVariants";


const HowItWorks: React.FC = () => {
  // const { t } = useTranslation();

  return (
    <section className="py-12 px-6 bg-light-background dark:bg-dark-background">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-light-primary dark:text-dark-primary mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          How It Works
        </motion.h2>
        <motion.p
          className="text-lg md:text-xl text-light-text dark:text-dark-text mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Get started with ShePath in a few simple steps!
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            className="bg-white dark:bg-dark-gray p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-light-secondary dark:text-dark-secondary mb-3">
              1. Explore the Site
            </h3>
            <p className="text-light-text dark:text-dark-text text-justify">
              Try all the navigation links (About, Programs, Community, Contact) at the top to see what we offer.
            </p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-dark-gray p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold text-light-secondary dark:text-dark-secondary mb-3">
              2. Log In & Explore Your Dashboard
            </h3>
            <p className="text-light-text dark:text-dark-text text-justify">
              Click "Login" and "register". You’ll be directed to a dashboard based on your role:
              <ol className="list-disc list-none mt-2">
                <li><strong>Learner (Default)</strong>: Access courses and progress.</li>
                <li><strong>Mentor</strong>: Guide learners.</li>
                <li><strong>Parent</strong>: get Support.</li>
                <li><strong>Admin</strong>: Manage the platform.</li>
              </ol>
            </p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-dark-gray p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-light-secondary dark:text-dark-secondary mb-3">
              3. Need Help?
            </h3>
            <p className="text-light-text dark:text-dark-text text-justify">
              Check our <a href="/privacy-policy" className="text-light-primary hover:underline">Privacy Policy</a> in the footer. 
              Facing issues? <a className="text-light-primary hover:underline">Send us a message</a>. 
              Want to change your role? Request it <a className="text-light-primary hover:underline">contact us.</a>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};


const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [toaster, setToaster] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleLoginButtonClick = () => {
    console.log("Login button clicked");
    setIsLoginModalOpen(true);
  };

  const showToaster = (message: string, type: "success" | "error") => {
    setToaster({ message, type });
    setTimeout(() => setToaster(null), 3000);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text">
      <Navbar onLoginBtnClick={handleLoginButtonClick} />
      <motion.section
        className="h-screen p-2 mt-12 mx-6 flex flex-col-reverse lg:flex-row items-center justify-between"
        {...fadeInUp}
      >
        <motion.div className="w-full" {...fadeInLeft}>
          <motion.h2 className="text-3xl md:text-5xl font-bold leading-tight pb-6">
            <span className="text-light-secondary">{t("journeyBegins")}</span>
          </motion.h2>
          <motion.p className="mb-4 text-lg md:text-xl text-justify text-dark-gray dark:text-light-gray pb-5" {...fadeInUp}>
            {t("mission_desc")}
          </motion.p>
          <motion.button
            className="mb-12 px-8 py-3 bg-light-primary dark:bg-dark-primary text-white text-lg font-medium rounded-lg shadow-md hover:bg-light-accent hover:dark:bg-dark-accent transition-transform duration-300 transform hover:scale-105"
            onClick={() => setIsLoginModalOpen(true)}
          >
            {t("getStarted")}
          </motion.button>
        </motion.div>
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

      {toaster && <Toaster message={toaster.message} type={toaster.type} />}
      <AboutPage />
      <CoursesList setToaster={showToaster} />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default HomePage;