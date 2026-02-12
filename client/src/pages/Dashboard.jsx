import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';
import StorageIndicator from '../components/StorageIndicator';

const Dashboard = () => {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleUploadSuccess = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="container mx-auto p-4 pt-24 animate-fade-in text-slate-800 dark:text-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="card p-6 sticky top-24">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-[var(--text-primary)]">
                            <span className="w-1.5 h-6 bg-brand-blue rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]"></span>
                            Upload File
                        </h2>
                        <StorageIndicator refreshKey={refreshKey} />
                        <FileUpload onUploadSuccess={handleUploadSuccess} />
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    {/* My Files Section */}
                    <div className="card p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[var(--text-primary)]">
                            <span className="w-1.5 h-6 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.3)]"></span>
                            My Secured Files
                        </h2>
                        <FileList key={`my-${refreshKey}`} type="mine" />
                    </div>

                    {/* Shared With Me Section */}
                    <div className="card p-6 border-slate-200 dark:border-slate-700">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[var(--text-primary)]">
                            <span className="w-1.5 h-6 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"></span>
                            Shared With Me
                        </h2>
                        <FileList key={`shared-${refreshKey}`} type="shared" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
