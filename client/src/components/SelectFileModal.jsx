import { useState, useEffect } from 'react';
import { listFiles, shareFile } from '../api/api';

const SelectFileModal = ({ recipient, onClose }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFileId, setSelectedFileId] = useState(null);
    const [sharing, setSharing] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const { data } = await listFiles();
                setFiles(data);
            } catch (err) {
                console.error("Failed to load files", err);
                setError("Failed to load your files.");
            } finally {
                setLoading(false);
            }
        };
        fetchFiles();
    }, []);

    const handleShare = async () => {
        if (!selectedFileId) return;

        setSharing(true);
        setMessage(null);
        setError(null);

        try {
            await shareFile(selectedFileId, recipient.email);
            setMessage(`Successfully shared file with ${recipient.username}!`);
            setTimeout(onClose, 2000); // Close after 2 seconds on success
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to share file.');
            setSharing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="glass p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                    Share File with <span className="text-brand-blue">{recipient.username}</span>
                </h3>

                {message && (
                    <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-sm">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div className="mb-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {loading ? (
                        <p className="text-slate-500 text-center py-4">Loading your files...</p>
                    ) : files.length === 0 ? (
                        <p className="text-slate-500 text-center py-4">You haven't uploaded any files yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {files.map(file => (
                                <div
                                    key={file.id}
                                    onClick={() => setSelectedFileId(file.id)}
                                    className={`p-3 rounded-lg border cursor-pointer transition-all flex justify-between items-center ${selectedFileId === file.id
                                        ? 'bg-brand-blue/10 border-brand-blue text-brand-blue dark:bg-brand-blue/20 dark:text-white'
                                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700/50'
                                        }`}
                                >
                                    <span className="truncate font-medium">{file.filename}</span>
                                    <span className="text-xs text-slate-500 ml-2 whitespace-nowrap">{(file.size / 1024).toFixed(1)} KB</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex gap-3 justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-slate-600 hover:text-white hover:bg-slate-700 transition-colors text-sm font-medium"
                        disabled={sharing}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleShare}
                        disabled={!selectedFileId || sharing}
                        className="px-6 py-2 rounded-lg bg-brand-blue text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-all text-sm"
                    >
                        {sharing ? 'Sharing...' : 'Share File'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectFileModal;
