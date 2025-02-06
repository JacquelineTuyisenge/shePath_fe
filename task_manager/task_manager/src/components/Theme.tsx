import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ThemeToggle: React.FC = () => {
  const {t} = useTranslation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 bg-gray-800 text-white dark:bg-gray-200 dark:text-black rounded m-2"
    >
      {theme === 'light' ? t('darkMode') : t('lightMode')}
    </button>
  );
};

export default ThemeToggle;
