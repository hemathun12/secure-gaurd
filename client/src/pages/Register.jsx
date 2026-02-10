
import { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Assuming register is exposed
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(username, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] animate-fade-in relative z-10 pt-20">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-neon-blue/20 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
            </div>

            <div className="glass p-8 w-full max-w-md animate-slide-up relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-purple to-neon-blue"></div>

                <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Create Account
                </h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-center text-sm backdrop-blur-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2 ml-1">Username</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2 ml-1">Email Address</label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2 ml-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="input-field w-full pr-10"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary mt-4">
                        Register
                    </button>

                    <div className="text-center mt-6">
                        <p className="text-gray-400 text-sm">
                            Already have an account?{' '}
                            <span
                                onClick={() => navigate('/login')}
                                className="text-neon-blue hover:text-neon-purple cursor-pointer transition-colors duration-300"
                            >
                                Sign in
                            </span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
