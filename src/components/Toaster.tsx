import React, { useState, useEffect } from 'react';

interface ToasterProps {
    message: string;
    type: 'success' | 'error';
    onClose?: () => void;
}

const Toaster: React.FC<ToasterProps> = ({ message, type, onClose }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        console.log("Toaster rendered with message:", message); // Debug log
        const timer = setTimeout(() => {
            setVisible(false);
            if (onClose) onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!visible) return null;

    return (
        <div
            className={`
                fixed z-[100] px-4 py-3 rounded-lg shadow-lg
                transition-transform duration-300 ease-in-out
                ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}
                text-white max-w-xs w-full
                bottom-4 right-4 md:top-4 md:bottom-auto
                ${visible ? 'translate-y-0' : 'translate-y-full md:-translate-y-full'}
            `}
        >
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{message}</p>
                <button
                    onClick={() => {
                        setVisible(false);
                        if (onClose) onClose();
                    }}
                    className="ml-3 text-white hover:text-gray-200 focus:outline-none"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default Toaster;