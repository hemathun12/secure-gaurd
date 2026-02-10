import { useState } from 'react';
import FileList from '../components/FileList';

const FilesPage = () => {
    const [activeTab, setActiveTab] = useState('mine');

    return (
        <div className="container mx-auto p-4 pt-24 animate-fade-in text-gray-200">
            <div className="glass p-6 min-h-[600px]">
                <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-8 bg-neon-purple rounded-full shadow-[0_0_10px_rgba(176,38,255,0.5)]"></span>
                        Secure Cloud Storage
                    </h2>

                    <div className="flex bg-gray-800/50 rounded-lg p-1">
                        <button
                            onClick={() => setActiveTab('mine')}
                            className={`px-4 py-2 rounded-md transition-all ${activeTab === 'mine' ? 'bg-neon-purple text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            My Files
                        </button>
                        <button
                            onClick={() => setActiveTab('shared')}
                            className={`px-4 py-2 rounded-md transition-all ${activeTab === 'shared' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Shared With Me
                        </button>
                    </div>
                </div>

                {activeTab === 'mine' ? (
                    <FileList type="mine" />
                ) : (
                    <FileList type="shared" />
                )}
            </div>
        </div>
    );
};

export default FilesPage;
