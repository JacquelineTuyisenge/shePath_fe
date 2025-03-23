import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import Toaster from "./Toaster";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ newPassword: "", confirmPassword: "" });
    const [toaster, setToaster] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToaster = (message: string, type: 'success' | 'error') => {
        setToaster({ message, type });
        setTimeout(() => setToaster(null), 3000);
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            showToaster("Passwords do not match", 'error');
            return;
        }

        try {
            const { data } = await axiosInstance.post(`/api/auth/reset-password?token=${token}`, {
                newPassword: formData.newPassword,
            });
            console.log(data);
            showToaster('Password reset is successful!', 'success');

            setFormData({ newPassword: "", confirmPassword: "" });

            setTimeout(() => navigate("/"), 3000);
        } catch (error: any) {
            showToaster(error.response?.data?.message || 'Something went wrong', 'error');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8 mt-12 dark:bg-dark-gray rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center text-light-secondary dark:text-dark-secondary mb-6">
                Reset Password
            </h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-orange-500 dark:bg-dark-gray text-light-text dark:text-dark-text rounded-md"
                    placeholder="New password"
                    required
                />
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 text-light-text dark:text-dark-text border border-orange-500 dark:bg-dark-gray rounded-md mt-4"
                    placeholder="Confirm password"
                    required
                />
                <button type="submit" className="w-full py-2 text-white bg-light-primary dark:bg-dark-primary rounded-md mt-4">
                    Reset Password
                </button>
            </form>
            {toaster && <Toaster message={toaster.message} type={toaster.type} />}
        </div>
    );
};

export default ResetPassword;
