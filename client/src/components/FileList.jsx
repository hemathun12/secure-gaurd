import { useState, useEffect } from 'react';
import { listFiles, listSharedFiles, downloadFile, deleteFile } from '../api/api';
import { getFileIcon } from '../utils/fileUtils';
import ShareModal from './ShareModal';
import ManageAccessModal from './ManageAccessModal';

const FileList = ({ refreshTrigger, type = 'mine' }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFileForShare, setSelectedFileForShare] = useState(null);
    const [selectedFileForAccess, setSelectedFileForAccess] = useState(null);
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

    const handleDownload = async (fileId, filename) => {
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
            // Optimistically remove from list
            setFiles(files.filter(f => f.id !== fileId));
        } catch (error) {
            console.error('Delete failed', error);
            alert('Failed to delete file.');
        }
    };

    if (loading) return <div className="flex justify-center items-center h-40"><div className="w-8 h-8 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <div className="relative w-full max-w-xs">
                    <input
                        type="text"
                        placeholder="Search files..."
                        className="w-full bg-black/20 border border-gray-700 text-gray-200 text-sm rounded-lg focus:ring-neon-blue focus:border-neon-blue block p-2.5 pl-10 placeholder-gray-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                </div>
            </div>

            {filteredFiles.length === 0 ? (
                <div className="text-center py-10 text-gray-400 border border-dashed border-gray-700 rounded-lg">
                    <p>{searchTerm ? 'No matching files found.' : (type === 'shared' ? 'No files shared with you yet.' : 'No files uploaded yet.')}</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-700/50">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-700 text-gray-400 text-sm bg-black/20">
                                <th className="p-4 font-medium">Filename</th>
                                <th className="p-4 font-medium">Size</th>
                                {type === 'shared' && <th className="p-4 font-medium">Owner</th>}
                                <th className="p-4 font-medium">Uploaded</th>
                                <th className="p-4 font-medium text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFiles.map((file) => (
                                <tr key={file.id} className="border-b border-gray-800 hover:bg-white/5 transition-colors group">
                                    <td className="p-4 font-medium text-gray-200 group-hover:text-neon-blue transition-colors flex items-center gap-2">
                                        <span className="text-xl">{getFileIcon(file.filename)}</span>
                                        {file.filename}
                                    </td>
                                    <td className="p-4 text-gray-400">{(file.size / 1024).toFixed(2)} KB</td>
                                    {type === 'shared' && <td className="p-4 text-neon-purple">{file.owner_name}</td>}
                                    <td className="p-4 text-gray-400">{new Date(file.upload_date).toLocaleDateString()}</td>
                                    <td className="p-4 text-center flex justify-center gap-2">
                                        <button
                                            onClick={() => handleDownload(file.id, file.filename)}
                                            className="px-3 py-1.5 text-xs font-bold text-neon-blue border border-neon-blue/30 rounded hover:bg-neon-blue/10 hover:shadow-[0_0_10px_rgba(0,243,255,0.2)] transition-all duration-300"
                                            title="Download"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                        </button>

                                        {type === 'mine' && (
                                            <>
                                                <button
                                                    onClick={() => setSelectedFileForShare(file)}
                                                    className="px-3 py-1.5 text-xs font-bold text-brand-blue border border-brand-blue/30 rounded hover:bg-brand-blue/10 transition-all duration-300"
                                                    title="Share"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                                                </button>
                                                <button
                                                    onClick={() => setSelectedFileForAccess(file)}
                                                    className="px-3 py-1.5 text-xs font-bold text-emerald-500 border border-emerald-500/30 rounded hover:bg-emerald-500/10 transition-all duration-300"
                                                    title="Manage Access"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(file.id)}
                                                    className="px-3 py-1.5 text-xs font-bold text-red-500 border border-red-500/30 rounded hover:bg-red-500/10 transition-all duration-300"
                                                    title="Delete"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
        </div>
    );
};

export default FileList;
