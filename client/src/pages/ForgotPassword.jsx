import React, { useState } from 'react';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../api/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const response = await forgotPassword(email);
            setStatus('success');
            setMessage(response.data.message);
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 card p-8 backdrop-blur-md animate-scale-in">
                <div>
                    <div className="mx-auto h-12 w-12 rounded-full bg-brand-blue/10 flex items-center justify-center">
                        <Mail className="h-6 w-6 text-brand-blue" />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--text-primary)]">
                        Forgot Password?
                    </h2>
                    <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
                        No worries, we'll send you reset instructions.
                    </p>
                </div>

                {status === 'success' ? (
                    <div className="space-y-6">
                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm text-center">
                            {message}
                        </div>
                        <Link
                            to="/login"
                            className="flex items-center justify-center text-sm font-medium text-brand-blue hover:text-blue-400 transition-colors"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to login
                        </Link>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm space-y-4">
                            <div>
                                <label htmlFor="email-address" className="sr-only">Email address</label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    required
                                    className="appearance-none relative block w-full px-3 py-3 border border-[var(--border-color)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-[var(--bg-secondary)] transition-all"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                disabled={status === 'loading'}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-brand-blue hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-all disabled:opacity-50"
                            >
                                {status === 'loading' ? (
                                    <Loader2 className="animate-spin h-5 w-5" />
                                ) : (
                                    'Reset Password'
                                )}
                            </button>
                        </div>

                        <div className="text-center">
                            <Link
                                to="/login"
                                className="inline-flex items-center text-sm font-medium text-brand-blue hover:text-blue-400 transition-colors"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
