import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import { useTranslation } from 'react-i18next';

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
    const [error, setError] = useState<string | null>(null);

    const toggleForm = () => setIsLogin((prev) => !prev);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        try {
            if (isLogin) {
                const {data} = await axiosInstance.post('/api/auth/login', {
                    email: formData.email,
                    password: formData.password
                });
                console.log('login is successful',data);

                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.user.role);
                localStorage.setItem('profile', JSON.stringify(data.profile));

                //redirections
               switch(data.user.role){
                case 'Admin':
                    navigate('/admin');
                    break;
                case 'Learner':
                    navigate('/learner');
                    break;
                case 'Guide-Mentor':
                    navigate('/mentor');
                    break;
                case 'Parent':
                    navigate('/parent');
                    break;
                default:
                    navigate('/');
                    break;
               }

            } else {
                if (formData.password !== formData.confirmPassword) {
                    setError(t("passwordMismatch"));
                    return;
                }
                  const { data } = await axiosInstance.post("/api/auth/register", formData);
                  console.log("Registration Successful:", data);
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="w-full max-w-md p-8 bg-light-gray dark:bg-dark-gray rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center text-light-secondary dark:text-dark-secondary mb-6">
                {isLogin ? t('welcomeBack') : t('welcomeToShePath')}
            </h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <>
                        <div className="mb-4">
                            <label className="block text-light-text dark:text-dark-text mb-1">{t('firstName')}</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border-light-gray dark:border-dark-gray text-sm"
                                placeholder={t('enterFirstName')}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-light-text dark:text-dark-text mb-1">{t('lastName')}</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border-light-gray dark:border-dark-gray text-sm"
                                placeholder={t('enterLastName')}
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
                                className="w-full px-4 py-2 border rounded-md bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border-light-gray dark:border-dark-gray text-sm"
                                placeholder="Username"
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
                        className="w-full px-4 py-2 border rounded-md bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border-light-gray dark:border-dark-gray text-sm"
                        placeholder="you@example.com"
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
                        className="w-full px-4 py-2 border rounded-md bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border-light-gray dark:border-dark-gray text-sm"
                        placeholder="Password.."
                        required
                    />
                </div>
                {!isLogin && (
                    <div className="mb-4">
                        <label className="block text-light-text dark:text-dark-text mb-1">{t('confirmPassword')}</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border-light-gray dark:border-dark-gray text-sm"
                            placeholder="Confirm Password.."
                            required
                        />
                    </div>
                )}
                <button
                    type="submit"
                    className="w-full py-2 text-white bg-light-primary dark:bg-dark-primary rounded-md hover:bg-light-accent dark:hover:bg-dark-accent"
                >
                    {isLogin ? t('login') : t('register')}
                </button>
            </form>
            <p className="mt-4 text-center text-sm text-light-text dark:text-dark-text">
                {isLogin ? t('noAccount') : t('alreadyHaveAccount')}{' '}
                <button
                    type="button"
                    onClick={toggleForm}
                    className="text-light-primary dark:text-dark-primary font-medium hover:underline"
                >
                    {isLogin ? t('register') : t('login')}
                </button>
            </p>
        </div>
    );
}

export default Login;
