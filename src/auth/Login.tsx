import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import { useTranslation } from 'react-i18next';
import Toaster from "../components/Toaster";
import Loader from "../components/Loader";

function Login() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false); 
    const [toaster, setToaster] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const toggleForm = () => setIsLogin((prev) => !prev);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const showToaster = (message: string, type: 'success' | 'error') => {
        setToaster({ message, type });
        setTimeout(() => setToaster(null), 3000);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                const { data } = await axiosInstance.post('/api/auth/login', {
                    email: formData.email,
                    password: formData.password
                });

                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.user.role);
                localStorage.setItem('profile', JSON.stringify(data.profile));

                showToaster('Login successful!', 'success');

                setTimeout(() => {
                    switch (data.user.role) {
                        case 'Admin': navigate('/admin'); break;
                        case 'Learner': navigate('/learner'); break;
                        case 'Mentor': navigate('/mentor'); break;
                        case 'Parent': navigate('/parent'); break;
                        default: navigate('/'); break;
                    }
                }, 2000);

            } else {
                if (formData.password !== formData.confirmPassword) {
                    showToaster(t("passwordMismatch"), 'error');
                    return;
                }
                
                const { data } = await axiosInstance.post("/api/auth/register", formData);
                console.log(data);
                
                setIsLogin(true);
                setFormData({
                    firstName: "",
                    lastName: "",
                    userName: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                });

                showToaster('Registration successful!', 'success');
            }
        } catch (error: any) {
            showToaster(error.response?.data?.message || 'Something went wrong', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-8 mt-7 dark:bg-dark-gray rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center text-light-secondary dark:text-dark-secondary mb-6">
                {isLogin ? t('welcomeBack') : t('welcomeToShePath')}
            </h2>
            {loading && <Loader />}
            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <>
                        <div className="mb-4">
                            <label className="block mb-1">{t('firstName')}</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-4 py-2  border border-orange-500 dark:bg-dark-gray rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">{t('lastName')}</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-orange-500 dark:bg-dark-gray rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-light-text dark:text-dark-text mb-1">{t('username')}</label>
                            <input
                                type="text"
                                name="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-orange-500 dark:bg-dark-gray rounded-md"
                                required
                            />
                        </div>
                    </>
                )}
                <div className="mb-4">
                    <label className="block text-light-text dark:text-dark-text mb-1">{t('email')}</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-orange-500 dark:bg-dark-gray rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-light-text dark:text-dark-text mb-1">{t('password')}</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-orange-500 dark:bg-dark-gray rounded-md"
                        required
                    />
                </div>
                {isLogin && (
                    <div className="text-right mb-4">
                        <button 
                            type="button" 
                            onClick={() => navigate('/forgot-password')} 
                            className="text-light-primary font-medium hover:underline"
                        >
                            {t('forgotPassword')}
                        </button>
                    </div>
                )}
                {!isLogin && (
                    <div className="mb-4">
                        <label className="block text-light-text dark:text-dark-text mb-1">{t('confirmPassword')}</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-orange-500 dark:bg-dark-gray rounded-md"
                            required
                        />
                    </div>
                )}
                <button
                    type="submit"
                    className="w-full py-2 text-white bg-light-primary dark:bg-dark-primary rounded-md"
                >
                    {isLogin ? t('login') : t('register')}
                </button>
            </form>
            <p className="mt-4 text-center text-sm">
                {isLogin ? t('noAccount') : t('alreadyHaveAccount')}{' '}
                <button type="button" onClick={toggleForm} className="text-light-primary font-medium hover:underline">
                    {isLogin ? t('register') : t('login')}
                </button>
            </p>

            {toaster && <Toaster message={toaster.message} type={toaster.type} />}
        </div>
    );
}

export default Login;
