
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-950 pt-16">
            <div className="glass p-8 w-full max-w-md animate-slide-up relative overflow-hidden border-t-4 border-t-brand-blue">

                <h2 className="text-2xl font-bold mb-2 text-center text-white">
                    Welcome Back
                </h2>
                <p className="text-center text-slate-400 text-sm mb-8">Sign in to access your secured files</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-lg mb-6 text-center text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 ml-1">Email Address</label>
                        <input
                            type="email"
                            className="input-field bg-slate-900 border-slate-700 focus:border-brand-blue"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 ml-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="input-field bg-slate-900 border-slate-700 focus:border-brand-blue w-full pr-10"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary mt-6 bg-brand-blue hover:bg-blue-600">
                        Sign In
                    </button>

                    <div className="flex justify-center items-center mt-6 gap-2 text-sm text-slate-400">
                        <span>Don't have an account?</span>
                        <span
                            onClick={() => navigate('/register')}
                            className="text-brand-blue hover:text-blue-400 cursor-pointer transition-colors font-medium"
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
