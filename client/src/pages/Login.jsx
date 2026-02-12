
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/files'); // Redirect to files after login
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)] pt-20 pb-10">
            <div className="card w-full max-w-md p-8 animate-slide-up relative overflow-hidden shadow-2xl">

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-[var(--text-secondary)]">Sign in to your secure cloud storage</p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-center text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2 pl-1">Email Address</label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[var(--text-secondary)] text-sm font-medium mb-2 pl-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="input-field pr-10"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <div className="flex justify-end mt-2">
                            <Link
                                to="/forgot-password"
                                className="text-sm font-medium text-brand-blue hover:text-blue-600 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary">
                        Sign In
                    </button>

                    <div className="flex justify-center items-center mt-6 gap-2 text-sm text-[var(--text-secondary)]">
                        <span>Don't have an account?</span>
                        <span
                            onClick={() => navigate('/register')}
                            className="text-brand-blue font-semibold hover:text-blue-600 cursor-pointer transition-colors"
                        >
                            Register now
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
