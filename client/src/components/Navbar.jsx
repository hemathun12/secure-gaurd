import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { Menu, X, Upload, Files, Search, User, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMenuOpen(false);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const navLinks = [
        { to: '/upload', label: 'Upload', icon: <Upload className="w-4 h-4" /> },
        { to: '/files', label: 'My Files', icon: <Files className="w-4 h-4" /> },
        { to: '/search', label: 'Find Users', icon: <Search className="w-4 h-4" /> },
    ];

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-[var(--bg-secondary)]/90 backdrop-blur-md border-b border-[var(--border-color)] px-4 md:px-6 py-4 flex justify-between items-center transition-all duration-300 shadow-sm">
            <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
                <Link to="/" className="text-xl font-bold text-[var(--text-primary)] tracking-wide flex items-center gap-2 hover:opacity-80 transition-opacity" onClick={closeMenu}>
                    <span className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    </span>
                    <span className="hidden sm:inline">SecureGuard</span>
                </Link>

                <div className="flex items-center gap-2 md:gap-6">
                    <ThemeToggle />

                    {user ? (
                        <>
                            {/* Desktop Navigation */}
                            <div className="hidden md:flex gap-6 mr-4">
                                {navLinks.map(link => (
                                    <Link key={link.to} to={link.to} className="text-[var(--text-secondary)] hover:text-brand-blue transition-colors text-sm font-medium">
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            {/* User Profile - Desktop */}
                            <Link to="/profile" className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-primary)] hover:bg-slate-50 dark:hover:bg-slate-800 border border-[var(--border-color)] transition-all group">
                                <div className="w-6 h-6 rounded-full bg-brand-blue flex items-center justify-center text-xs font-bold text-white shadow-md">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-brand-blue transition-colors">{user.username}</span>
                            </Link>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={toggleMenu}
                                className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] transition-colors"
                            >
                                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-4 items-center">
                            <Link to="/login" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm font-medium">Login</Link>
                            <Link to="/register" className="px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white text-sm font-semibold transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transform hover:-translate-y-0.5">
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMenuOpen && user && (
                <div className="absolute top-full left-0 w-full bg-[var(--bg-secondary)] border-b border-[var(--border-color)] md:hidden animate-in slide-in-from-top duration-200">
                    <div className="flex flex-col p-4 gap-2">
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={closeMenu}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-brand-blue transition-all"
                            >
                                {link.icon}
                                <span className="font-medium">{link.label}</span>
                            </Link>
                        ))}
                        <div className="h-px bg-[var(--border-color)] my-2" />
                        <Link
                            to="/profile"
                            onClick={closeMenu}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-brand-blue transition-all"
                        >
                            <User className="w-4 h-4" />
                            <span className="font-medium">Profile ({user.username})</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-all text-left"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
