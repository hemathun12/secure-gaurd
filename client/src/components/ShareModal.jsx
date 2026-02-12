
import { useState } from 'react';
import { shareFile } from '../api/api';
import PasswordPromptModal from './PasswordPromptModal';

const ShareModal = ({ file, onClose, onShareSuccess }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

    if (!file) return null;

    const handleShareClick = (e) => {
        e.preventDefault();
        setShowPasswordPrompt(true);
    };

    const performShare = async (password) => {
        setLoading(true);
        setMessage('');

        try {
            await shareFile(file.id, email, password);
            setMessage(`Successfully shared ${file.filename} with ${email}`);
            setEmail('');
            if (onShareSuccess) onShareSuccess();
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Share failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/20 backdrop-blur-sm animate-fade-in">
            <div className="card w-full max-w-md p-0 overflow-hidden shadow-2xl animate-scale-up">
                <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-secondary)]">
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">
                        Share File
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors p-1 rounded-full hover:bg-[var(--bg-primary)]"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <form onSubmit={handleShareClick} className="p-6">
                    <div className="mb-6 bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border-color)]">
                        <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-semibold mb-1">File</p>
                        <p className="font-semibold text-[var(--text-primary)] truncate">{file.filename}</p>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Recipient Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter user email"
                            className="input-field"
                        />
                    </div>

                    {message && (
                        <div className={`p-3 rounded-lg text-sm border mb-4 ${message.includes('Success')
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
                            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                            }`}>
                            {message}
                        </div>
                    )}

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
                            disabled={loading || !email}
                            className="btn-primary"
                        >
                            {loading ? 'Sharing...' : 'Share File'}
                        </button>
                    </div>
                </form>
            </div>

            <PasswordPromptModal
                isOpen={showPasswordPrompt}
                onClose={() => setShowPasswordPrompt(false)}
                onSuccess={performShare}
                title="Confirm Share"
                message={`Please enter your password to confirm sharing "${file.filename}" with ${email}.`}
            />
        </div>
    );
};

export default ShareModal;
