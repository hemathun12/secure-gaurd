import { useState } from 'react';
import { verifyPassword } from '../api/api';
import { Lock } from 'lucide-react';

const PasswordPromptModal = ({ isOpen, onClose, onSuccess, title = "Password Required", message = "Please enter your password to continue." }) => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await verifyPassword(password);
            await verifyPassword(password);
            onSuccess(password);
            onClose();
            setPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/20 backdrop-blur-sm animate-fade-in">
            <div className="card w-full max-w-sm p-0 overflow-hidden shadow-2xl animate-scale-up">
                <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-secondary)]">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                        <Lock className="w-5 h-5 text-brand-blue" />
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors p-1 rounded-full hover:bg-[var(--bg-primary)]"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <p className="text-[var(--text-secondary)] text-sm mb-4">
                        {message}
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="mb-6">
                        <input
                            type="password"
                            required
                            autoFocus
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="input-field"
                        />
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !password}
                            className="btn-primary"
                        >
                            {loading ? 'Verifying...' : 'Confirm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordPromptModal;
