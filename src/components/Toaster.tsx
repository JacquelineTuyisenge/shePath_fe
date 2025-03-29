import React, { useState, useEffect } from 'react';

interface ToasterProps {
    message: string;
    type: 'success' | 'error';
}

const Toaster: React.FC<ToasterProps> = ({ message, type }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div className={`relative fixed top-5 right-5 p-3 rounded shadow-lg ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            <p className="text-white">{message}</p>
        </div>
    );
};

export default Toaster;