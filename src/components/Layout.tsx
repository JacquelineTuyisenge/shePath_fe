import React from 'react';
import { Outlet } from 'react-router-dom';
import GeneralNavbar from './GenNav';
import Footer from './Footer';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text">
      <GeneralNavbar onLoginBtnClick={() => {} }/>
      <main>
        {/* Render the specific content of each route here */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
