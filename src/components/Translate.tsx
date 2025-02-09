import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa'

const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        className="flex items-center space-x-2"
      >
        <FaGlobe size={20} />
      </button>

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
