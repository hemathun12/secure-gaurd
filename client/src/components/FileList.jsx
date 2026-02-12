import { useState, useEffect } from 'react';
import { listFiles, listSharedFiles, downloadFile, deleteFile } from '../api/api';
import { getFileIcon } from '../utils/fileUtils';
import ShareModal from './ShareModal';
import ManageAccessModal from './ManageAccessModal';
import PasswordPromptModal from './PasswordPromptModal';
import { Download, Share2, Trash2, Shield, Calendar, HardDrive, User, MoreVertical } from 'lucide-react';

const FileList = ({ refreshTrigger, type = 'mine' }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFileForShare, setSelectedFileForShare] = useState(null);
    const [selectedFileForAccess, setSelectedFileForAccess] = useState(null);
    const [selectedFileForDownload, setSelectedFileForDownload] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFiles = files.filter(file =>
        file.filename.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        fetchFiles();
    }, [refreshTrigger, type]);

    const fetchFiles = async () => {
        try {
            const apiCall = type === 'shared' ? listSharedFiles : listFiles;
            const { data } = await apiCall();
            setFiles(data);
        } catch (error) {
            console.error('Error fetching files:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadRequest = (file) => {
        setSelectedFileForDownload(file);
    };

    const performDownload = async () => {
        if (!selectedFileForDownload) return;
        const { id: fileId, filename } = selectedFileForDownload;

        try {
            const response = await downloadFile(fileId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Download failed', error);
            alert('Download failed. Please try again.');
        }
    };

    const handleDelete = async (fileId) => {
        if (!window.confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
            return;
        }

        try {
            await deleteFile(fileId);
            setFiles(files.filter(f => f.id !== fileId));
        } catch (error) {
            console.error('Delete failed', error);
            alert('Failed to delete file.');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="relative w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-brand-blue rounded-full animate-spin border-t-transparent"></div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Search your secure vault..."
                        className="input-field !pl-12"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[var(--text-tertiary)]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''} found
                </div>
            </div>

            {filteredFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-[var(--bg-primary)]/50 dark:bg-slate-900/20 border-2 border-dashed border-[var(--border-color)] rounded-3xl">
                    <div className="bg-[var(--bg-secondary)] dark:bg-slate-800 p-4 rounded-full mb-4 shadow-sm">
                        <HardDrive className="w-8 h-8 text-[var(--text-tertiary)]" />
                    </div>
                    <p className="text-[var(--text-secondary)] font-medium text-lg">
                        {searchTerm ? 'No matching files found.' : (type === 'shared' ? 'No files shared with you yet.' : 'Your vault is empty.')}
                    </p>
                    {type === 'mine' && !searchTerm && <p className="text-[var(--text-tertiary)] text-sm mt-2">Upload a file to get started.</p>}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredFiles.map((file, index) => (
                        <div
                            key={file.id}
                            className="group relative card p-5 animate-fade-in flex flex-col justify-between h-[220px]"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Top Access Metadata */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-[var(--bg-primary)] rounded-xl text-3xl group-hover:scale-110 transition-transform duration-300">
                                    {getFileIcon(file.filename)}
                                </div>
                                {type === 'shared' && (
                                    <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
                                        <User className="w-3 h-3" />
                                        {file.owner_name}
                                    </span>
                                )}
                            </div>

                            {/* Main Content */}
                            <div>
                                <h3 className="font-bold text-[var(--text-primary)] truncate mb-1 text-lg group-hover:text-brand-blue transition-colors">
                                    {file.filename}
                                </h3>
                                <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] font-medium">
                                    <span className="flex items-center gap-1">
                                        <HardDrive className="w-3 h-3" />
                                        {(file.size / 1024).toFixed(2)} KB
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(file.upload_date).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {/* Action Bar (Reveals on Hover mostly, but always accessible) */}
                            <div className="mt-4 pt-4 border-t border-[var(--border-color)] flex justify-end gap-2">
                                <button
                                    onClick={() => handleDownloadRequest(file)}
                                    className="p-2 text-[var(--text-secondary)] hover:text-brand-blue hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                    title="Download"
                                >
                                    <Download className="w-4 h-4" />
                                </button>

                                {type === 'mine' && (
                                    <>
                                        <button
                                            onClick={() => setSelectedFileForShare(file)}
                                            className="p-2 text-[var(--text-secondary)] hover:text-brand-blue hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                            title="Share"
                                        >
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setSelectedFileForAccess(file)}
                                            className="p-2 text-[var(--text-secondary)] hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                                            title="Manage Access"
                                        >
                                            <Shield className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(file.id)}
                                            className="p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedFileForShare && (
                <ShareModal
                    file={selectedFileForShare}
                    onClose={() => setSelectedFileForShare(null)}
                />
            )}

            {selectedFileForAccess && (
                <ManageAccessModal
                    file={selectedFileForAccess}
                    onClose={() => setSelectedFileForAccess(null)}
                />
            )}

            <PasswordPromptModal
                isOpen={!!selectedFileForDownload}
                onClose={() => setSelectedFileForDownload(null)}
                onSuccess={performDownload}
                title="Download Authorization"
                message={`Please enter your password to download "${selectedFileForDownload?.filename}".`}
            />
        </div>
    );
};

export default FileList;
