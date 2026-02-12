import UserSearch from '../components/UserSearch';

import { useState } from 'react';
import UserFileAccessModal from '../components/UserFileAccessModal';

const SearchPage = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    return (
        <div className="w-full text-[var(--text-primary)] animate-slide-up relative">
            <div className={`transition-all duration-300 ${selectedUser ? 'blur-2xl pointer-events-none select-none opacity-40' : ''}`}>
                {/* Page Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">User Search</h2>
                    <p className="text-[var(--text-secondary)]">Find other users to share your secure files with.</p>
                </div>

                <div className="w-full max-w-3xl">
                    <UserSearch onAccess={setSelectedUser} />
                </div>
            </div>

            {selectedUser && (
                <UserFileAccessModal
                    targetUser={selectedUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}
        </div>
    );
};

export default SearchPage;
