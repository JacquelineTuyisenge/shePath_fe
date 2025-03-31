import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import GeneralNavbar from './GenNav';
import Footer from './Footer';
import Login from '../auth/Login';

const Layout: React.FC = () => {

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  const handleLoginButtonClick = () => {
    console.log("Login button clicked");
    setIsLoginModalOpen(true);
  };

  return (
    <div className="min-h-screen w-full bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text">
      <GeneralNavbar onLoginBtnClick={handleLoginButtonClick}/>
      <main>
        <Outlet />
      </main>
      <Footer />

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
    </div>
  );
};

export default Layout;
