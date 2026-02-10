import FileUpload from '../components/FileUpload';

const UploadPage = () => {
    return (
        <div className="container mx-auto p-4 pt-24 animate-fade-in text-gray-200 flex justify-center">
            <div className="glass p-8 w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white border-b border-gray-700 pb-4">
                    <span className="w-2 h-8 bg-neon-blue rounded-full shadow-[0_0_10px_rgba(0,243,255,0.5)]"></span>
                    Secure File Upload
                </h2>
                <div className="mb-6 text-gray-400 text-sm bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                    <p className="font-semibold text-blue-400 mb-2">AI Security Rules:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Allowed: PDF, DOCX, XLSX, JPG, PNG, TXT</li>
                        <li>Blocked: EXE, BAT, CMD, APK, JS</li>
                        <li>Encryption: AES-128 (Small), AES-192 (Medium), AES-256 (Large)</li>
                    </ul>
                </div>
                <FileUpload />
            </div>
        </div>
    );
};

export default UploadPage;
