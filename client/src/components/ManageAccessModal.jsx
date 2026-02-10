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
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="glass p-6 w-full max-w-md shadow-2xl border border-slate-700">
                <h3 className="text-xl font-bold mb-4 text-white">
                    Manage Access: <span className="text-brand-blue truncate block text-base font-normal mt-1">{file.filename}</span>
                </h3>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div className="mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {loading ? (
                        <p className="text-slate-400 text-center py-4">Loading access list...</p>
                    ) : permissions.length === 0 ? (
                        <p className="text-slate-400 text-center py-4">This file is not shared with anyone.</p>
                    ) : (
                        <ul className="space-y-3">
                            {permissions.map(user => (
                                <li key={user.user_id} className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                                    <div>
                                        <p className="text-white font-medium">{user.username}</p>
                                        <p className="text-xs text-slate-400">{user.email}</p>
                                    </div>
                                    <button
                                        onClick={() => handleRevoke(user.user_id, user.username)}
                                        className="text-xs font-bold text-red-400 hover:text-red-300 hover:underline px-2 py-1"
                                    >
                                        REVOKE
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors text-sm font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageAccessModal;
