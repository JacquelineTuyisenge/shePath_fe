import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {useDispatch} from 'react-redux';
import { AppDispatch } from "../store";
import { sendMessage, clearMessageState } from '../features/messageSlice';
import Toaster from "./Toaster";

const Footer = () => {
  const [toaster, setToaster] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToaster = (message: string, type: 'success' | 'error') => {
    setToaster({ message, type });
    setTimeout(() => {
      setToaster(null);
    }, 3000);
  };

  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({ email: "", message: "" });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
        try {
            await dispatch(sendMessage(formData)).unwrap();
            showToaster('Message sent successfully!', 'success');
            setFormData({ email: "", message: "" });
        } catch (error) {
            showToaster('Failed to send message!', 'error');
        }
  };

  useEffect(()=> {
      dispatch(clearMessageState());
  }, [dispatch]);

  return (
    <footer id="contact" className="bg-light-gray dark:bg-dark-gray text-light-text dark:text-dark-text py-8 mt-4">
      <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {/* Company Info */}
        <div>
          <h2 className="text-xl text-light-primary font-semibold">
            {t('companyName')}
          </h2>
          <p className="mt-2 dark:text-gray-400">
            {t('empoweringText')}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold">{t('quickLinks')}</h2>
          <ul className="mt-2 space-y-2">
            <li><a href="/about" className="dark:text-gray-400 hover:text-light-accent">{t('aboutUs')}</a></li>
            <li><a href="/courses" className="dark:text-gray-400 hover:text-light-accent">{t('programs')}</a></li>
            <li><a href="/policy" className="dark:text-gray-400 hover:text-light-accent">{t('privacyPolicy')}</a></li>
          </ul>
        </div>

        {/* Contact Form & Social Media */}
        <div>
          <h2 className="text-xl font-semibold">{t('contactUs')}</h2>
          <form className="mt-2 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0" onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder={t('emailPlaceholder')}
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 text-gray-900 rounded bg-light-gray dark:bg-dark-gray dark:text-white border border-gray-300 dark:border-gray-700"
                required
              />
              <textarea
                name="message"
                placeholder={t('messagePlaceholder')}
                value={formData.message}
                onChange={handleChange}
                className="w-full p-2 text-gray-900 rounded bg-light-gray dark:bg-dark-gray dark:text-white border border-gray-300 dark:border-gray-700"
                required
              />
            <button
              type="submit"
              className="w-auto p-2 bg-light-primary dark:bg-dark-primary text-white font-semibold rounded hover:bg-light-accent dark:hover:bg-dark-accent"
            >
              {t('sendMessage')}
            </button>
          </form>
          {toaster && <Toaster message={toaster.message} type={toaster.type} />}
          <div className="flex justify-center space-x-4 mt-4">
            <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-light-accent dark:hover:text-light-accent text-2xl">
              <FaFacebook />
            </a>
            <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-light-accent dark:hover:text-light-accent text-2xl">
              <FaTwitter />
            </a>
            <a href="https://www.linkedin.com/in/tuyisenge-jacqueline-69b393240/" className="text-gray-300 dark:text-gray-400 hover:text-light-accent dark:hover:text-light-accent text-2xl">
              <FaLinkedin />
            </a>
            <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-light-accent dark:hover:text-light-accent text-2xl">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-400 dark:text-gray-400 text-sm mt-8 border-t border-gray-300 dark:border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} {t('companyName')}. {t('allRightsReserved')}
      </div>
    </footer>
  );
};

export default Footer;
