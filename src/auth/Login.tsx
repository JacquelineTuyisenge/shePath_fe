import React, {useState} from "react";
import { useTranslation } from 'react-i18next';

function Login(){
    const {t} = useTranslation();
    const [isLogin, setisLogin] = useState(false);

    const toggleForm = () => setisLogin((prev) => !prev);

    return (
                <div className="w-full max-w-md p-8 bg-light-gray dark:bg-dark-gray rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold text-center text-light-secondary dark:text-dark-secondary mb-6">
                    {isLogin ? 'Welcome Back!' : 'Welcome to shePath!'}
                    </h2>
                    <form>
                    {!isLogin && (
                        <div className="mb-4">
                        <label className="block text-light-text dark:text-dark-text mb-1">{t('username')}</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-md bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border-light-gray dark:border-dark-gray text-sm"
                            placeholder="Enter your userName"
                        />
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-light-text dark:text-dark-text mb-1">{t('email')}</label>
                        <input
                        type="email"
                        className="w-full px-4 py-2 border rounded-md bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border-light-gray dark:border-dark-gray text-sm"
                        placeholder="you@example.com"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-light-text dark:text-dark-text mb-1">{t('password')}</label>
                        <input
                        type="password"
                        className="w-full px-4 py-2 border rounded-md bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border-light-gray dark:border-dark-gray text-sm"
                        placeholder="Password.."
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 text-white bg-light-primary dark:bg-dark-primary rounded-md hover:bg-light-accent dark:hover:bg-dark-accent"
                    >
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                    </form>
                    <p className="mt-4 text-center text-sm text-light-text dark:text-dark-text">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button
                        type="button"
                        onClick={toggleForm}
                        className="text-light-primary dark:text-dark-primary font-medium hover:underline"
                    >
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                    </p>
                </div>
    );
};

export default Login;