import { useState } from 'react';
import FileList from '../components/FileList';
import StorageIndicator from '../components/StorageIndicator';

const FilesPage = () => {
    const [activeTab, setActiveTab] = useState('mine');

    return (
        <div className="w-full text-[var(--text-primary)]">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 animate-slide-up">
                <div>
                    <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">My Vault</h2>
                    <p className="text-[var(--text-secondary)]">Manage and share your encrypted files safely.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden lg:block w-64">
                        <StorageIndicator />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex mb-8 border-b border-[var(--border-color)] animate-slide-up" style={{ animationDelay: '100ms' }}>
                <button
                    onClick={() => setActiveTab('mine')}
                    className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${activeTab === 'mine' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                >
                    My Files
                </button>
                <button
                    onClick={() => setActiveTab('shared')}
                    className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${activeTab === 'shared' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                >
                    Shared With Me
                </button>
            </div>

            {/* Content Area */}
            <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
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
