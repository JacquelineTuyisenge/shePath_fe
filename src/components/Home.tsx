import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageToggle from './Translate';
import ThemeToggle from './Theme';
import logo from '../assets/Logo.png';
import herbg from '../assets/Hero-bg.png';
import micro from '../assets/micro.png';
import Programs from './Programs';

const HomePage: React.FC = () => {
  const {t} = useTranslation();
  return (
    <div className="min-h-screen bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text">
      {/* Navigation Bar */}
      <nav className="bg-light-gray dark:bg-dark-gray p-4 flex justify-between items-center shadow-md">
        <ul className="flex space-x-6 items-center">
          <h1 className="text-light-primary font-bold text-2xl">ShePath</h1>
          <li className="hover:text-light-primary cursor-pointer">Home</li>
          <li className="hover:text-light-primary cursor-pointer">About</li>
          <li className="hover:text-light-primary cursor-pointer">Programs</li>
          <li className="hover:text-light-primary cursor-pointer">Contact</li>
        </ul>
        <ul className="flex space-x-6 items-center">
          <LanguageToggle />
          <ThemeToggle />
          <button className="px-6 py-2 bg-light-primary text-white rounded hover:bg-light-accent transition-colors duration-200">Login</button>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="p-8 bg-light-gray dark:bg-dark-gray flex items-center justify-between gap-2">
       {/* Left: Image or Illustration */}
        
       <div className="w-1/2 pl-8 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-secondary dark:text-light-secondary leading-tight">
          <span className="block text-light-primary dark:text-dark-primary animate-bounce">
            Breaking Barriers!
          </span> <br />
            Empowering Girls through Education
          </h2>
          <br />
          <p className="mt-4 text-lg text-dark-gray dark:text-light-gray">
            {t('join')}
          </p>
          <button className="mt-6 px-8 py-3 bg-light-primary dark:bg-dark-primary text-white text-lg font-medium rounded-lg shadow-md hover:bg-light-accent hover:dark:bg-dark-accent transition-transform duration-300 transform hover:scale-105">
            Get Started
          </button>
        </div>

        {/* Right: Content */}

        <div className="w-1/2">
          <img 
            src={micro} 
            alt="Hero section background image" 
            className="w-full animate-pulse relative z-0 py-5"
          />
        </div>
        
      </section>

      {/* Features Section */}
      <section className="p-8">
        <h2 className="text-3xl font-bold text-dark-secondary mb-4">Our Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 bg-light-gray dark:bg-dark-gray rounded shadow-md">
            <h3 className="text-xl font-bold text-light-primary">Mentorship</h3>
            <p className="mt-2 text-sm">
              Connect with mentors who can guide and inspire girls toward their educational goals.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="p-6 bg-light-gray dark:bg-dark-gray rounded shadow-md">
            <h3 className="text-xl font-bold text-light-primary">Resources</h3>
            <p className="mt-2 text-sm">
              Access scholarships, learning materials, and other resources to support education.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="p-6 bg-light-gray dark:bg-dark-gray rounded shadow-md">
            <h3 className="text-xl font-bold text-light-primary">Awareness</h3>
            <p className="mt-2 text-sm">
              Raise awareness about the importance of education for girls and inspire action.
            </p>
          </div>
        </div>
      </section>

      {/* Programs section */}
      <Programs />

      {/* Community Highlights */}
      <section className="p-8">
        <h2 className="text-3xl font-bold text-dark-secondary mb-4">Community Highlights</h2>
      </section>

      {/* Frequently Asked Questions */}
      <section className="p-8">
        <h2 className="text-3xl font-bold text-dark-secondary mb-4">Frequently Asked Questions</h2>
      </section>

      {/* Patners */}
      <section className="p-8">
        <h2 className="text-3xl font-bold text-dark-secondary mb-4">Patners</h2>
        <div className='flex gap-4 mb-4 p-4'>
          <div>
            <h1>Patner 1</h1>
          </div>
          <div>
            <h1>Patner 2</h1>
          </div>
          <div>
            <h1>Patner 3</h1>
          </div>
        </div>
      </section>

      {/* Testimonial Section (Showcasing All Colors) */}
      <section className="p-8 bg-dark-secondary text-white">
        <h2 className="text-3xl font-bold">What People Say</h2>
        <p className="mt-4">
          "ShePath has transformed the way we think about education for girls. The resources and mentorship are
          invaluable."
        </p>
        <button className="mt-6 px-6 py-2 bg-light-accent text-dark-text rounded hover:bg-light-primary transition-colors duration-200">
          Join Us
        </button>
      </section>

      {/* CTA Section */}
      <section className="p-8 bg-light-gray dark:bg-dark-gray">
        <h2 className="text-3xl font-bold text-dark-secondary">Get Involved</h2>
        <p className="mt-4 text-lg">
          Whether you're a teacher, a student, or a supporter, there's a place for you at ShePath. Help us make a
          difference.
        </p>
        <div className="mt-6 flex space-x-4">
          <button className="px-6 py-2 bg-light-primary text-white rounded hover:bg-light-accent transition-colors duration-200">
            Volunteer
          </button>
          <button className="px-6 py-2 bg-dark-secondary text-white rounded hover:bg-gray-500 transition-colors duration-200">
            Donate
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="p-6 bg-light-gray dark:bg-dark-gray text-center">
        <p>&copy; {new Date().getFullYear()} ShePath. All Rights Reserved.</p>
        <div className="mt-2 flex justify-center space-x-4 text-light-primary">
          <a href="#" className="hover:text-light-accent">Facebook</a>
          <a href="#" className="hover:text-light-accent">Twitter</a>
          <a href="#" className="hover:text-light-accent">LinkedIn</a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
