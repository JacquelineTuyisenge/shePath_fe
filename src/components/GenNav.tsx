import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Menu, X, UserCircle } from "lucide-react";
import { FaSignInAlt } from "react-icons/fa";
import LanguageToggle from "./Translate";
import ThemeToggle from "./Theme";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { isAuthenticated } from "../utils/utils";

const GeneralNavbar: React.FC<{ onLoginBtnClick: () => void }> = ({ onLoginBtnClick }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.users);
  const authStatus = isAuthenticated();

  const toggleMenu = () => setIsOpen(!isOpen);

  const getDashboardRoute = () => {
    const role = localStorage.getItem("role");
    switch (role) {
      case "Admin": return "/admin";
      case "Learner": return "/learner";
      case "Mentor": return "/mentor";
      case "Parent": return "/parent";
      default: return "/";
    }
  };

  return (
    <nav className="bg-light-gray w-full dark:bg-dark-gray p-4 flex justify-between items-center shadow-md fixed top-0 z-50">
      <div className="flex justify-between items-center w-full md:mx-4">
        <button onClick={() => navigate("/")}>
          <h1 className="text-light-primary font-bold text-2xl">ShePath</h1>
        </button>
        <button onClick={toggleMenu} className="md:hidden text-light-primary">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-20 left-0 w-64 h-full bg-light-gray dark:bg-dark-gray text-white z-50 p-4 md:hidden transition-transform duration-300 ease-in-out ${
          isOpen ? "transform translate-x-0" : "transform -translate-x-full"
        }`}
      >
        <ul className="space-y-4 text-center text-light-text dark:text-dark-text">
          <li><a href="/about" className="hover:text-light-primary">{t("about")}</a></li>
          <li><a href="/courses" className="hover:text-light-primary">{t("programs")}</a></li>
          <li><a href="/community" className="hover:text-light-primary">{t("community")}</a></li>
          <li><a href="/" className="hover:text-light-primary">{t("contact")}</a></li> {/* Redirects to home for contact */}
        </ul>
        <div className="flex flex-col space-y-4 mt-4 text-light-text dark:text-dark-text">
          <div className="flex gap-2 px-4">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          {authStatus ? (
            <div className="flex gap-1 px-2">
              <a href={getDashboardRoute()} className="p-2 bg-gray-200 dark:bg-gray-600 rounded hover:scale-105 transition-transform">
                {t("dashboard")}
              </a>
              {currentUser?.profile ? (
                <img src={currentUser.profile} alt="Profile" className="w-8 h-8 rounded-full" />
              ) : (
                <UserCircle className="w-8 h-8 text-light-primary" />
              )}
            </div>
          ) : (
            <button className="flex items-center space-x-2 p-2 rounded hover:bg-light-accent hover:text-white transition" onClick={onLoginBtnClick}>
              <FaSignInAlt size={15} />
              <span>{t("register")}</span>
            </button>
          )}
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6 mx-2 mr-6">
        <ul className="flex space-x-4 items-center">
          <li className="hover:text-light-primary"><a href="/about">{t("about")}</a></li>
          <li className="hover:text-light-primary"><a href="/courses">{t("programs")}</a></li>
          <li className="hover:text-light-primary"><a href="/community">{t("community")}</a></li>
          <li className="hover:text-light-primary"><a href="/">{t("contact")}</a></li> {/* Redirects to home */}
        </ul>
        <div className="flex items-center space-x-4">
          <LanguageToggle />
          <ThemeToggle />
          {authStatus ? (
            <div className="flex items-center space-x-4">
              <a href={getDashboardRoute()} className="px-6 py-2 bg-gray-200 dark:bg-gray-600 rounded hover:scale-105 transition-transform">
                {t("dashboard")}
              </a>
              {currentUser?.profile ? (
                <img src={currentUser.profile} alt="Profile" className="w-8 h-8 rounded-full" />
              ) : (
                <UserCircle className="w-8 h-8 text-light-primary" />
              )}
            </div>
          ) : (
            <button className="flex items-center space-x-2 p-2 rounded hover:bg-light-accent hover:text-white transition" onClick={onLoginBtnClick}>
              <FaSignInAlt size={20} />
              <span>{t("register")}</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default GeneralNavbar;