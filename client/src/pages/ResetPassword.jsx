import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { resetPassword } from '../api/api';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setStatus('error');
            setMessage('Passwords do not match');
            return;
        }

        setStatus('loading');
        try {
            const response = await resetPassword(token, password);
            setStatus('success');
            setMessage(response.data.message);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.message || 'Reset failed. Token might be invalid or expired.');
        }
    };

    if (!token) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <div className="text-center card p-8 max-w-md w-full">
                    <h2 className="text-2xl font-bold text-red-500">Invalid Link</h2>
                    <p className="mt-4 text-[var(--text-secondary)]">This reset link is missing its token.</p>
                    <Link to="/forgot-password" title="Go to forgot password page" className="mt-6 inline-block text-brand-blue hover:underline">Request a new link</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 card p-8 backdrop-blur-md animate-scale-in">
                <div>
                    <div className="mx-auto h-12 w-12 rounded-full bg-brand-blue/10 flex items-center justify-center">
                        <Lock className="h-6 w-6 text-brand-blue" />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--text-primary)]">
                        New Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
                        Please enter your new password below.
                    </p>
                </div>

                {status === 'success' ? (
                    <div className="text-center space-y-4">
                        <div className="mx-auto h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm font-medium">
                            {message}
                        </div>
                        <p className="text-sm text-[var(--text-secondary)]">Redirecting to login in 3 seconds...</p>
                        <Link to="/login" title="Go to login page" className="text-brand-blue hover:underline font-medium">Login now</Link>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm space-y-4">
                            <div className="relative">
                                <label htmlFor="new-password" title="Label for new-password" className="sr-only">New Password</label>
                                <input
                                    id="new-password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="appearance-none relative block w-full px-3 py-3 border border-[var(--border-color)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-[var(--bg-secondary)] transition-all"
                                    placeholder="New password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    title="Toggle password visibility"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-secondary)] hover:text-brand-blue transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>

                            <div>
                                <label htmlFor="confirm-password" title="Label for confirm-password" className="sr-only">Confirm Password</label>
                                <input
                                    id="confirm-password"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    className="appearance-none relative block w-full px-3 py-3 border border-[var(--border-color)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-[var(--bg-secondary)] transition-all"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {status === 'error' && (
                            <div className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded border border-red-500/20">
                                {message}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                title="Reset password button"
                                disabled={status === 'loading'}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-brand-blue hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-all disabled:opacity-50"
                            >
                                {status === 'loading' ? (
                                    <Loader2 className="animate-spin h-5 w-5" />
                                ) : (
                                    'Update Password'
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
