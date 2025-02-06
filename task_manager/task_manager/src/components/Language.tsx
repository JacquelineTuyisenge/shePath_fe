import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation(); // Access i18n instance

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language); // Change the language
  };

  return (
    <div className="flex space-x-4">
      <button
        onClick={() => handleLanguageChange('en')}
        className="px-4 py-2 bg-gray-500 text-white rounded"
      >
        English
      </button>
      <button
        onClick={() => handleLanguageChange('fr')}
        className="px-4 py-2 bg-gray-500 text-white rounded"
      >
        Français
      </button>
      <button
        onClick={() => handleLanguageChange('rw')}
        className="px-4 py-2 bg-gray-500 text-white rounded"
      >
        Kinyarwanda
      </button>
    </div>
  );
};

export default LanguageToggle;
