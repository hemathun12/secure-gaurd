import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={(e) => toggleTheme(e)}
            className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            aria-label="Toggle Dark Mode"
        >
            <div className="relative w-6 h-6 overflow-hidden">
                <Sun
                    className={`absolute inset-0 w-6 h-6 text-orange-500 transition-all duration-500 transform ${theme === 'dark' ? 'rotate-90 opacity-0 scale-0' : 'rotate-0 opacity-100 scale-100'
                        }`}
                    fill="currentColor"
                />
                <Moon
                    className={`absolute inset-0 w-6 h-6 text-brand-blue transition-all duration-500 transform ${theme === 'dark' ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-0'
                        }`}
                    fill="currentColor"
                />
            </div>
            <span className="sr-only">Toggle theme</span>
        </button>
    );
};

export default ThemeToggle;
