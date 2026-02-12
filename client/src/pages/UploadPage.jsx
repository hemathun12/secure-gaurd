import FileUpload from '../components/FileUpload';
import StorageIndicator from '../components/StorageIndicator';
import { useState } from 'react';

const UploadPage = () => {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleUploadSuccess = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="w-full text-[var(--text-primary)] animate-slide-up">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Secure Upload</h2>
                    <p className="text-[var(--text-secondary)]">Encrypt and store your documents safely.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden lg:block w-64">
                        <StorageIndicator refreshKey={refreshKey} />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full max-w-3xl mx-auto">
                <div className="mb-8 text-sm bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-1 h-6 bg-brand-blue rounded-full"></span>
                        <p className="font-semibold text-brand-blue text-lg">AI Security Protocols</p>
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-3 text-[var(--text-secondary)]">
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>Allowed: PDF, DOCX, XLSX, JPG, PNG, TXT</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>Blocked: EXE, BAT, CMD, APK, JS</li>
                        <li className="flex items-center gap-2 md:col-span-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-blue"></div>Encryption: AES-256 (Military Grade)</li>
                    </ul>
                </div>

                <div className="card p-0 overflow-hidden">
                    <FileUpload onUploadSuccess={handleUploadSuccess} />
                </div>
            </div>
        </div>
    );
};

export default UploadPage;
