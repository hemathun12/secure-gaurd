import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { deleteAccount } from '../api/api';
import PasswordPromptModal from '../components/PasswordPromptModal';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!user) return null;

    const handleDeleteAccount = async (password) => {
        setLoading(true);
        try {
            await deleteAccount(password);
            // Logout will redirect to login
            logout();
        } catch (err) {
            console.error('Failed to delete account', err);
            alert(err.response?.data?.message || 'Failed to delete account');
        } finally {
            setLoading(false);
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="w-full text-[var(--text-primary)] animate-slide-up">
            {/* Page Header */}
            <div className="mb-10">
                <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">User Profile</h2>
                <p className="text-[var(--text-secondary)]">Manage your account settings and preferences.</p>
            </div>

            {/* Profile Content */}
            <div className="max-w-4xl">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* User Card */}
                    <div className="w-full md:w-1/3 bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-color)] shadow-sm">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-blue to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-xl mb-4">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)]">{user.username}</h3>
                            <p className="text-sm text-[var(--text-secondary)] mb-6">Free Plan Member</p>

                            <button
                                onClick={logout}
                                className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm mb-3"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                Sign Out
                            </button>

                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="w-full py-2.5 px-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                Delete Account
                            </button>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
                            <p className="text-sm font-medium text-[var(--text-tertiary)] mb-1">Email Address</p>
                            <p className="text-lg font-semibold text-[var(--text-primary)] truncate">{user.email}</p>
                        </div>

                        <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
                            <p className="text-sm font-medium text-[var(--text-tertiary)] mb-1">Account ID</p>
                            <p className="text-sm font-mono text-[var(--text-secondary)] break-all">{user.id}</p>
                        </div>

                        <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm md:col-span-2">
                            <p className="text-sm font-medium text-[var(--text-secondary)] mb-4">Security Status</p>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-semibold">Scanning Active</span>
                                </div>
                                <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm">
                                    <span>Encryption: AES-256</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PasswordPromptModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onSuccess={handleDeleteAccount}
                title="Delete Account"
                message="Please enter your password to confirm account deletion. This action cannot be undone."
            />
        </div>
    );
};

export default ProfilePage;
