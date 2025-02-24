import { ReactNode } from 'react';

interface LayoutProps {
  title: string;
  children: ReactNode;
}

const Layout = ({ title, children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text">
      <header className="p-4 text-xl font-bold text-light-primary dark:text-dark-primary">
        {title}
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
};

export default Layout;
