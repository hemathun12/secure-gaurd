
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex justify-between items-center transition-all duration-300">
            <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
                <Link to="/" className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                    <span className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    </span>
                    SecureGuard
                </Link>
                <div className="flex items-center gap-6">
                    {user ? (
                        <>
                            <div className="hidden md:flex gap-6 mr-4">
                                <Link to="/upload" className="text-gray-400 hover:text-brand-blue transition-colors text-sm font-medium">Upload</Link>
                                <Link to="/files" className="text-gray-400 hover:text-brand-blue transition-colors text-sm font-medium">My Files</Link>
                                <Link to="/search" className="text-gray-400 hover:text-brand-blue transition-colors text-sm font-medium">Find Users</Link>
                            </div>

                            <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all">
                                <div className="w-6 h-6 rounded-full bg-brand-blue flex items-center justify-center text-xs font-bold text-white">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm text-gray-200">{user.username}</span>
                            </Link>
                        </>
                    ) : (
                        <div className="flex gap-4 items-center">
                            <Link to="/login" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Login</Link>
                            <Link to="/register" className="px-4 py-2 rounded-lg bg-brand-blue hover:bg-blue-600 text-white text-sm font-medium transition-all duration-300 shadow-sm">
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
