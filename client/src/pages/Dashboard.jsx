import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';

const Dashboard = () => {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleUploadSuccess = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="container mx-auto p-4 pt-24 animate-fade-in text-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="glass p-6 sticky top-24">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                            <span className="w-2 h-8 bg-neon-blue rounded-full shadow-[0_0_10px_rgba(0,243,255,0.5)]"></span>
                            Upload File
                        </h2>
                        <FileUpload onUploadSuccess={handleUploadSuccess} />
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    {/* My Files Section */}
                    <div className="glass p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                            <span className="w-2 h-8 bg-neon-purple rounded-full shadow-[0_0_10px_rgba(176,38,255,0.5)]"></span>
                            My Secured Files
                        </h2>
                        <FileList key={`my-${refreshKey}`} type="mine" />
                    </div>

                    {/* Shared With Me Section */}
                    <div className="glass p-6 border-neon-blue/20">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                            <span className="w-2 h-8 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
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
