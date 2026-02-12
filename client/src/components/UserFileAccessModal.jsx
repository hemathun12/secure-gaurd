import { useState, useEffect } from 'react';
import { getFilesStatus, shareFile, revokeAccess } from '../api/api';

const UserFileAccessModal = ({ targetUser, onClose }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFileStatus();
    }, [targetUser.id]);

    const fetchFileStatus = async () => {
        try {
            const { data } = await getFilesStatus(targetUser.id);
            setFiles(data);
        } catch (err) {
            console.error("Failed to load file status", err);
            setError("Failed to load file list.");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleAccess = async (file) => {
        const action = file.is_shared ? 'revoke' : 'share';

        try {
            if (action === 'share') {
                await shareFile(file.id, targetUser.email);
            } else {
                await revokeAccess(file.id, targetUser.id);
            }

            // Update local state
            setFiles(files.map(f =>
                f.id === file.id ? { ...f, is_shared: !f.is_shared } : f
            ));

        } catch (err) {
            console.error(`Failed to ${action} access`, err);
            alert(`Failed to ${action} access. ${err.response?.data?.message || ''}`);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-3xl flex items-center justify-center z-50 p-4 animate-fade-in" style={{ backdropFilter: 'blur(24px)' }}>
            <div className="card w-full max-w-lg shadow-2xl p-0 overflow-hidden">
                <div className="p-6 border-b border-[var(--border-color)]">
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">
                        Access for: <span className="text-brand-blue">{targetUser.username}</span>
                    </h3>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {loading ? (
                            <p className="text-[var(--text-tertiary)] text-center py-4">Loading files...</p>
                        ) : files.length === 0 ? (
                            <p className="text-[var(--text-tertiary)] text-center py-4">You haven't uploaded any files yet.</p>
                        ) : (
                            <ul className="space-y-3">
                                {files.map(file => (
                                    <li key={file.id} className="card p-3 flex justify-between items-center mb-2">
                                        <div className="truncate pr-4">
                                            <p className="text-[var(--text-primary)] font-semibold truncate">{file.filename}</p>
                                            <p className="text-xs text-[var(--text-tertiary)]">{(file.size / 1024).toFixed(2)} KB</p>
                                        </div>
                                        <button
                                            onClick={() => handleToggleAccess(file)}
                                            className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded-lg transition-all uppercase tracking-wide border ${file.is_shared
                                                ? 'text-red-500 border-red-500/50 hover:bg-red-50 dark:hover:bg-red-900/20'
                                                : 'text-brand-blue border-brand-blue/50 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                                }`}
                                        >
                                            {file.is_shared ? 'Revoke' : 'Share'}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t border-[var(--border-color)] flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-white transition-colors text-sm font-semibold"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserFileAccessModal;
