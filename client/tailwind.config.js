/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0f172a', // Slate 900
                secondary: '#1e293b', // Slate 800
                accent: '#10b981', // Emerald 500 (Security/Success)
                'accent-hover': '#059669', // Emerald 600
                'brand-blue': '#3b82f6', // Blue 500 (Primary Action)
                'brand-dark': '#020617', // Slate 950
                'glass-white': 'rgba(255, 255, 255, 0.05)',
                'glass-border': 'rgba(255, 255, 255, 0.1)',
                // Keeping neon names mapped to new colors for compatibility, but should eventually replace
                'neon-blue': '#3b82f6', // Maps to Brand Blue
                'neon-purple': '#10b981', // Maps to Emerald
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-out forwards',
                'slide-up': 'slideUp 0.6s ease-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
