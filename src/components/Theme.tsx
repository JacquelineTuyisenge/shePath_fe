import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import moon from '../assets/moon.svg';
import sun from '../assets/sun.svg';

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
      className="p-2 rounded"
    >
      <img
        src={theme === 'light' ? moon : sun}
        alt={theme === 'light' ? t('darkMode') : t('lightMode')}
        className="w-6 h-6"
      />
    </button>
  );
};

export default ThemeToggle;
