
import { useState, useCallback } from 'react';
import { uploadFile } from '../api/api';

const FileUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage('');
        setProgress(0);
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
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${file ? 'border-neon-blue bg-neon-blue/5' : 'border-gray-600 hover:border-gray-500 hover:bg-white/5'
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
                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        </div>
                        <span className="text-gray-300 font-medium">Click to upload or drag and drop</span>
                        <span className="text-xs text-gray-500">Supported: PDF, DOCX, JPG, PNG, TXT</span>
                    </label>
                ) : (
                    <div className="text-left">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="font-medium text-neon-blue truncate max-w-[200px]">{file.name}</p>
                                <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button onClick={() => setFile(null)} className="text-gray-500 hover:text-red-400 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                    </div>
                )}

                {uploading && (
                    <div className="w-full bg-gray-700 rounded-full h-1.5 mt-4 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-neon-blue to-neon-purple h-full rounded-full transition-all duration-300 relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute top-0 left-0 w-full h-full bg-white/30 animate-pulse"></div>
                        </div>
                    </div>
                )}
            </div>

            <button
                onClick={handleUpload}
                disabled={uploading || !file}
                className={`w-full mt-4 py-3 px-4 rounded-lg font-bold text-white shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${uploading || !file
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
