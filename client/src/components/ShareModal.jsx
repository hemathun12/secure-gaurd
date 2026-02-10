
import { useState } from 'react';
import { shareFile } from '../api/api';
import UserSearch from './UserSearch';

const ShareModal = ({ file, onClose, onShareSuccess }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    if (!file) return null;

    const handleShare = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await shareFile(file.id, email);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="glass w-full max-w-md p-6 relative animate-slide-up">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>

                <h2 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple">
                    Share File
                </h2>

                <div className="mb-6">
                    <p className="text-sm text-gray-300">File: <span className="font-medium text-white">{file.filename}</span></p>
                    <p className="text-xs text-gray-500">Size: {(file.size / 1024).toFixed(2)} KB</p>
                </div>

                <form onSubmit={handleShare} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
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
                        <div className={`p-3 rounded-lg text-sm border backdrop-blur-sm ${message.includes('Success')
                                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                : 'bg-red-500/10 border-red-500/30 text-red-400'
                            }`}>
                            {message}
                        </div>
                    )}

                    <div className="flex gap-3 justify-end mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !email}
                            className="px-4 py-2 rounded-lg bg-neon-blue/20 text-neon-blue border border-neon-blue/50 hover:bg-neon-blue/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                        >
                            {loading ? 'Sharing...' : 'Share File'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ShareModal;
