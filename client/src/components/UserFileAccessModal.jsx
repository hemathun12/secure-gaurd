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
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="glass p-6 w-full max-w-lg shadow-2xl border border-slate-700">
                <h3 className="text-xl font-bold mb-4 text-white">
                    Access for: <span className="text-brand-blue">{targetUser.username}</span>
                </h3>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div className="mb-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {loading ? (
                        <p className="text-slate-400 text-center py-4">Loading files...</p>
                    ) : files.length === 0 ? (
                        <p className="text-slate-400 text-center py-4">You haven't uploaded any files yet.</p>
                    ) : (
                        <ul className="space-y-3">
                            {files.map(file => (
                                <li key={file.id} className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                                    <div className="truncate pr-4">
                                        <p className="text-white font-medium truncate">{file.filename}</p>
                                        <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(2)} KB</p>
                                    </div>
                                    <button
                                        onClick={() => handleToggleAccess(file)}
                                        className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded transition-all uppercase tracking-wide border ${file.is_shared
                                                ? 'text-red-400 border-red-400/50 hover:bg-red-400/10'
                                                : 'text-brand-blue border-brand-blue/50 hover:bg-brand-blue/10'
                                            }`}
                                    >
                                        {file.is_shared ? 'Revoke' : 'Share'}
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

export default UserFileAccessModal;
