
import { useState } from 'react';
import { searchUsers } from '../api/api';
import UserFileAccessModal from './UserFileAccessModal';

const UserSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setSearching(true);
        try {
            const { data } = await searchUsers(query);
            setResults(data);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="glass p-6 rounded-lg shadow-md mb-6 relative">
            <h3 className="text-xl font-semibold mb-4 text-white">Find Users</h3>
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Search by username or email..."
                    className="flex-1 input-field bg-slate-900/50 border-slate-700 focus:border-brand-blue"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors font-medium"
                    disabled={searching}
                >
                    {searching ? '...' : 'Search'}
                </button>
            </form>

            {results.length > 0 && (
                <ul className="divide-y divide-slate-700">
                    {results.map(user => (
                        <li key={user.id} className="py-3 flex justify-between items-center group">
                            <div>
                                <p className="font-medium text-white">{user.username}</p>
                                <p className="text-sm text-slate-400">{user.email}</p>
                                {user.authorized_files && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {user.authorized_files.split(',').map((filename, idx) => (
                                            <span key={idx} className="text-[10px] uppercase font-bold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                                                {filename}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setSelectedUser(user)}
                                className="px-3 py-1.5 text-xs font-bold text-brand-blue border border-brand-blue/50 rounded hover:bg-brand-blue/10 transition-all uppercase tracking-wide"
                            >
                                Manage Access
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            {results.length === 0 && query && !searching && (
                <p className="text-sm text-gray-700">No users found.</p>
            )}

            {selectedUser && (
                <UserFileAccessModal
                    targetUser={selectedUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}
        </div>
    );
};

export default UserSearch;
