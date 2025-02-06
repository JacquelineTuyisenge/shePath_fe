import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import earth from '../assets/earth.svg';

const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-400 rounded"
      >
        <img src={earth} alt="Language Toggle" className="w-5 h-5" />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 rounded w-40 flex">
          <button
            onClick={() => handleLanguageChange('en')}
            className="block w-full text-left px-4 py-2 hover:text-light-primary"
          >
            English
          </button>
          <button
            onClick={() => handleLanguageChange('fr')}
            className="block w-full text-left px-4 py-2 hover:text-light-primary"
          >
            Français
          </button>
          <button
            onClick={() => handleLanguageChange('rw')}
            className="block w-full text-left px-4 py-2 hover:text-light-primary"
          >
            Kinyarwanda
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;
