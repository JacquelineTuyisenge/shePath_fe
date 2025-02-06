import React from 'react';
import TaskManager from './components/TaskManager';
import ThemeToggle from './components/Theme';
import LanguageToggle from './components/Language';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
      <LanguageToggle />
      <ThemeToggle />
      <TaskManager />
    </div>
  );
};

export default App;
