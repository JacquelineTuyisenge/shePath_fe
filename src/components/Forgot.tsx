import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import Toaster from "./Toaster";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [toaster, setToaster] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToaster = (message: string, type: 'success' | 'error') => {
        setToaster({ message, type });
        setTimeout(() => setToaster(null), 3000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await axiosInstance.post("/api/auth/forgot-password", { email });
            console.log(data);
            showToaster('Email sent successfully!', 'success');
            
            setEmail("");
        } catch (error: any) {
            showToaster(error.response?.data?.message || 'Something went wrong', 'error');
        }
    };

    return (
        <div className="max-w-2xl p-8 mx-auto mt-12 dark:bg-dark-gray rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center text-light-secondary dark:text-dark-secondary mb-6">
                Forgot Password
            </h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 text-light-text dark:text-dark-text border border-orange-500 dark:bg-dark-gray rounded-md"
                    placeholder="Enter your email"
                    required
                />
                <button type="submit" className="w-full py-2 text-white bg-light-primary dark:bg-dark-primary rounded-md mt-4">
                    Send Reset Link
                </button>
            </form>
            {toaster && <Toaster message={toaster.message} type={toaster.type} />}

        </div>
    );
};

export default ForgotPassword;
