
import { useState, useCallback } from 'react';

import { uploadFile } from '../api/api';

import { getFileIcon } from '../utils/fileUtils';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'xlsx', 'jpg', 'png', 'txt'];

const FileUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [aiStatus, setAiStatus] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setMessage('');
        setProgress(0);

        const extension = selectedFile.name.split('.').pop().toLowerCase();
        const isSizeValid = selectedFile.size <= MAX_FILE_SIZE;
        const isExtensionValid = ALLOWED_EXTENSIONS.includes(extension);

        if (!isSizeValid) {
            setAiStatus({ safe: false, message: 'AI Status: File Unsafe To Upload (Size > 50MB)' });
        } else if (!isExtensionValid) {
            setAiStatus({ safe: false, message: 'AI Status: File Unsafe To Upload (Invalid File Type)' });
        } else {
            setAiStatus({ safe: true, message: 'AI Status: File Safe To Upload' });
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file first.');
            return;
        }

        setUploading(true);
        setMessage('');

        try {
            await uploadFile(file, (event) => {
                setProgress(Math.round((100 * event.loaded) / event.total));
            });
            setMessage('File uploaded successfully!');
            setFile(null);
            setProgress(0);
            if (onUploadSuccess) onUploadSuccess();
        } catch (error) {
            console.error(error);
            setMessage(error.response?.data?.message || 'Upload failed.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full">
            <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${file ? 'border-brand-blue bg-blue-50 dark:bg-blue-900/20' : 'border-[var(--border-color)] hover:border-brand-blue hover:bg-[var(--bg-primary)] dark:hover:bg-slate-800/50'
                    }`}
            >
                <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileChange}
                    className="hidden"
                />

                {!file ? (
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[var(--bg-primary)] dark:bg-gray-700 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-sm border border-[var(--border-color)]">
                            <svg className="w-6 h-6 text-[var(--text-secondary)] dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        </div>
                        <span className="text-[var(--text-primary)] font-semibold">Click to upload or drag and drop</span>
                        <span className="text-xs text-[var(--text-tertiary)]">Supported: PDF, DOCX, JPG, PNG, TXT (Max 50MB)</span>
                    </label>
                ) : (
                    <div className="text-left">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{getFileIcon(file.name)}</span>
                                <div>
                                    <p className="font-medium text-brand-blue truncate max-w-[200px]">{file.name}</p>
                                    <p className="text-xs text-[var(--text-secondary)]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button onClick={() => setFile(null)} className="text-[var(--text-tertiary)] hover:text-red-500 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div className={`border rounded-lg p-2.5 flex items-center gap-2 mb-2 animate-fade-in ${aiStatus?.safe
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                            }`}>
                            <div className={`rounded-full p-1 ${aiStatus?.safe ? 'bg-emerald-500/20' : 'bg-red-500/20'
                                }`}>
                                {aiStatus?.safe ? (
                                    <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                ) : (
                                    <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                )}
                            </div>
                            <span className={`text-sm font-medium ${aiStatus?.safe ? 'text-emerald-400' : 'text-red-400'
                                }`}>
                                {aiStatus?.message}
                            </span>
                        </div>
                    </div>
                )}

                {uploading && (
                    <div className="w-full mt-4">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Uploading...</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-neon-blue to-neon-purple h-full rounded-full transition-all duration-300 relative"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute top-0 left-0 w-full h-full bg-white/30 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <button
                onClick={handleUpload}
                disabled={uploading || !file || !aiStatus?.safe}
                className={`w-full mt-4 py-3 px-4 rounded-lg font-bold text-white shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${uploading || !file || !aiStatus?.safe
                    ? 'bg-gray-700 cursor-not-allowed opacity-50 shadow-none hover:translate-y-0'
                    : 'bg-gradient-to-r from-neon-blue to-blue-600 hover:from-neon-blue hover:to-blue-500 shadow-neon-blue/20'
                    }`}
            >
                {uploading ? 'Encrypting & Uploading...' : 'Secure Upload'}
            </button>

            {message && (
                <div className={`mt-4 p-3 rounded-lg text-sm border backdrop-blur-sm animate-fade-in ${message.includes('success')
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
