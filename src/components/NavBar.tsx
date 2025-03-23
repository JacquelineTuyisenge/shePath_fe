import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, UserCircle } from "lucide-react";
import { FaSignInAlt } from "react-icons/fa";
import LanguageToggle from "./Translate";
import ThemeToggle from "./Theme";

interface NavBarProps {
  onLoginBtnClick: () => void;
}

const Navbar: React.FC<NavBarProps> = ({ onLoginBtnClick }) => {
  const { t } = useTranslation();
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

  const toggleMenu = () => setIsOpen(!isOpen);

  const getDashboardRoute = () => {
    switch (userRole) {
      case "Admin":
        return "/admin";
      case "Learner":
        return "/learner";
      case "Mentor":
        return "/mentor";
      case "Parent":
        return "/parent";
      default:
        return "/";
    }
  };

  return (
    <nav className="bg-light-gray w-full dark:bg-dark-gray p-4 flex justify-between items-center shadow-md fixed top-0 z-50">
      <div className="flex justify-between items-center w-full md:mx-4">
        {/* Logo and Hamburger Icon */}
        <div className="flex justify-between items-center w-full">
          <button onClick={() => navigate("/")}>
            <h1 className="text-light-primary font-bold text-2xl">ShePath</h1>
          </button>
          <button onClick={toggleMenu} className="md:hidden text-light-primary">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Sidebar for Mobile */}
      <div
        className={`fixed top-20 left-0 w-64 h-full bg-light-gray dark:bg-dark-gray text-white z-50 p-4 md:hidden transition-transform duration-300 ease-in-out ${
          isOpen ? "transform translate-x-0" : "transform -translate-x-full"
        }`}
      >
        <div className="flex flex-col justify-center items-center space-y-4">
          <ul className="space-y-4 text-center text-light-text dark:text-dark-text">
            <li>
              <button
                onClick={() => {
                  const targetElement = document.getElementById("about");
                  if (targetElement) {
                    targetElement.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
               {t("about")}
              </button>
            </li>
            
            <li>
              <button
                onClick={() =>
                  document.getElementById("programs")?.scrollIntoView({ behavior: "smooth" })
                }
                className="hover:text-light-primary"
              >
                {t("programs")}
              </button>
            </li>
            <li>
            <Link className="hover:text-light-primary cursor-pointer" to="/community">{t("community")}</Link>
            </li>
            <li>
              <button
                onClick={() =>
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                }
                className="hover:text-light-primary"
              >
                {t("contact")}
              </button>
            </li>
          </ul>

          <div className="flex flex-col space-y-4 mt-4 text-light-text dark:text-dark-text">
                <div className="flex gap-2 px-4">
                  <LanguageToggle />
                  <ThemeToggle />
                </div>
            {isAuthenticated ? (
              <div className="flex gap-1 px-2">
                <Link
                  to={getDashboardRoute()}
                  className="p-2 bg-gray-200 dark:bg-gray-600 rounded hover:scale-105 transition-transform"
                >
                  {t("dashboard")}
                </Link>
                <UserCircle className="w-8 h-8 text-light-primary cursor-pointer" />
              </div>
            ) : (
              <button
                className="flex items-center space-x-2 p-2 rounded hover:bg-light-accent hover:text-white transition"
                onClick={onLoginBtnClick}
              >
                <FaSignInAlt size={15} />
                <span>{t("register")}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6 mx-2">
        <ul className="flex space-x-4 items-center">
          <li className="hover:text-light-primary cursor-pointer">
            <button
                  className="flex items-center justify-center"
                  onClick={() => {
                    const targetElement = document.getElementById("about");
                    if (targetElement) {
                      targetElement.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  <p className="whitespace-nowrap">{t("about")}</p>
              </button>
          </li>
          <li className="hover:text-light-primary cursor-pointer">
            <button
              onClick={() => {
                const targetElement = document.getElementById("programs");
                if (targetElement) {
                  targetElement.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              {t("programs")}
            </button>
          </li>
          <li>
            <Link className="hover:text-light-primary cursor-pointer" to="/community">{t("community")}</Link>
          </li>
          <li className="hover:text-light-primary cursor-pointer">
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
              {t("contact")}
            </button>
          </li>
        </ul>

        <div className="flex items-center space-x-4">
          <LanguageToggle />
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link
                to={getDashboardRoute()}
                className="px-6 whitespace-nowrap py-2 bg-gray-200 dark:bg-gray-600 rounded hover:scale-105 transition-transform"
              >
                {t("dashboard")}
              </Link>
              <UserCircle className="w-8 h-8 text-light-primary cursor-pointer" />
            </div>
          ) : (
            <button
              className="flex items-center space-x-2 p-2 rounded hover:bg-light-accent hover:text-white transition"
              onClick={onLoginBtnClick}
            >
              <FaSignInAlt size={20} />
              <span>{t("register")}</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
