import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa';

const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    setIsDropdownVisible(false); 
  };

  return (
    <div className="relative justify-center items-center p-3">
      <FaGlobe
        size={20}
        className="cursor-pointer"
        onClick={() => setIsDropdownVisible((prev) => !prev)}
      />
      
      {isDropdownVisible && (
        <div className="absolute top-5 left-5 mt-5 bg-light-gray dark:bg-dark-gray shadow-lg text-light-text dark:text-dark-text rounded border">
          <div
            onClick={() => handleLanguageChange('en')}
            className="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-500"
          >
            English
          </div>
          <div
            onClick={() => handleLanguageChange('fr')}
            className="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-500"
          >
            Français
          </div>
          <div
            onClick={() => handleLanguageChange('rw')}
            className="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-500"
          >
            Kinyarwanda
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;
