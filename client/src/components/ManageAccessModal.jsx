import { useState, useEffect } from 'react';
import { getFilePermissions, revokeAccess } from '../api/api';

const ManageAccessModal = ({ file, onClose }) => {
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPermissions();
    }, [file.id]);

    const fetchPermissions = async () => {
        try {
            const { data } = await getFilePermissions(file.id);
            setPermissions(data);
        } catch (err) {
            console.error("Failed to load permissions", err);
            setError("Failed to load access list.");
        } finally {
            setLoading(false);
        }
    };

    const handleRevoke = async (userId, username) => {
        if (!window.confirm(`Are you sure you want to revoke access for ${username}?`)) {
            return;
        }

        try {
            await revokeAccess(file.id, userId);
            setPermissions(permissions.filter(p => p.user_id !== userId));
        } catch (err) {
            console.error("Failed to revoke access", err);
            alert("Failed to revoke access.");
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-3xl flex items-center justify-center z-[100] p-4 animate-fade-in" style={{ backdropFilter: 'blur(24px)' }}>
            <div className="card w-full max-w-md shadow-2xl p-0 overflow-hidden">
                <div className="p-6 border-b border-[var(--border-color)]">
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">
                        Manage Access
                    </h3>
                    <p className="text-brand-blue truncate text-sm font-medium mt-1">{file.filename}</p>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {loading ? (
                            <p className="text-[var(--text-tertiary)] text-center py-4">Loading access list...</p>
                        ) : permissions.length === 0 ? (
                            <p className="text-[var(--text-tertiary)] text-center py-4">This file is not shared with anyone.</p>
                        ) : (
                            <ul className="space-y-3">
                                {permissions.map(user => (
                                    <li key={user.user_id} className="flex justify-between items-center p-3 bg-[var(--bg-primary)] dark:bg-slate-900/50 rounded-xl border border-[var(--border-color)]">
                                        <div>
                                            <p className="text-[var(--text-primary)] font-semibold text-sm">{user.username}</p>
                                            <p className="text-xs text-[var(--text-tertiary)]">{user.email}</p>
                                        </div>
                                        <button
                                            onClick={() => handleRevoke(user.user_id, user.username)}
                                            className="text-xs font-bold text-red-500 hover:text-red-600 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                                        >
                                            REVOKE
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t border-[var(--border-color)] flex justify-end bg-[var(--bg-primary)]/50">
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

export default ManageAccessModal;
