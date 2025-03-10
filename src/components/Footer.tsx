import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Footer = () => {

  const { t } = useTranslation();

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log("Message Sent:", formData);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <footer className="bg-light-gray dark:bg-dark-gray text-light-text dark:text-dark-text py-8 mt-4">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company Info */}
        <div>
          <h2 className="text-xl text-light-primary dark:text-dark-primary font-semibold">
            {t('companyName')}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t('empoweringText')}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold">{t('quickLinks')}</h2>
          <ul className="mt-2 space-y-2">
            <li><a href="/about" className="text-gray-600 dark:text-gray-400 hover:text-light-accent">{t('aboutUs')}</a></li>
            <li><a href="/courses" className="text-gray-600 dark:text-gray-400 hover:text-light-accent">{t('programs')}</a></li>
            <li><a href="/policy" className="text-gray-600 dark:text-gray-400 hover:text-light-accent">{t('privacyPolicy')}</a></li>
          </ul>
        </div>

        {/* Contact Form & Social Media */}
        <div>
          <h2 className="text-xl font-semibold">{t('contactUs')}</h2>
          <form className="mt-2 space-y-2" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder={t('namePlaceholder')}
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 text-gray-900 rounded bg-light-gray dark:bg-dark-gray dark:text-white border border-gray-300 dark:border-gray-700"
              required
            />
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
              className="w-full p-2 mt-2 bg-light-primary dark:bg-dark-primary text-white font-semibold rounded hover:bg-light-accent dark:hover:bg-dark-accent"
            >
              {t('sendMessage')}
            </button>
          </form>

          <div className="flex mt-4 space-x-4">
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-light-accent dark:hover:text-light-accent text-2xl">
                <FaFacebook />
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-light-accent dark:hover:text-light-accent text-2xl">
                <FaTwitter />
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-light-accent dark:hover:text-light-accent text-2xl">
                <FaLinkedin />
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-light-accent dark:hover:text-light-accent text-2xl">
                <FaInstagram />
            </a>
          </div>

        </div>
      </div>

      <div className="text-center text-gray-600 dark:text-gray-400 text-sm mt-8 border-t border-gray-300 dark:border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} {t('companyName')}. {t('allRightsReserved')}
      </div>
    </footer>
  );
};

export default Footer;
