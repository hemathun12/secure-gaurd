
import { useState } from 'react';
import { searchUsers } from '../api/api';
// UserFileAccessModal import removed

const UserSearch = ({ onAccess }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);

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
        <div className="w-full relative">
            <div className="transition-all duration-300">
                <form onSubmit={handleSearch} className="flex gap-4 mb-8">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search by username or email..."
                            className="input-field !pl-12"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[var(--text-tertiary)]">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="bg-brand-blue hover:bg-blue-600 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-brand-blue/30 disabled:opacity-50 transition-all font-bold text-sm uppercase tracking-wider"
                        disabled={searching}
                    >
                        {searching ? '...' : 'Search'}
                    </button>
                </form>

                {results.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {results.map(user => (
                            <div key={user.id} className="card p-5 group flex justify-between items-center hover:shadow-md transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[var(--bg-primary)] flex items-center justify-center font-bold text-[var(--text-secondary)]">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-[var(--text-primary)]">{user.username}</p>
                                        <p className="text-xs text-[var(--text-secondary)]">{user.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onAccess && onAccess(user)}
                                    className="px-3 py-1.5 text-xs font-bold text-brand-blue bg-blue-50 hover:bg-brand-blue hover:text-white border border-brand-blue/20 rounded-lg transition-all uppercase tracking-wide"
                                >
                                    Access
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                {results.length === 0 && query && !searching && (
                    <div className="text-center py-12 bg-[var(--bg-primary)] dark:bg-slate-900/50 rounded-2xl border border-dashed border-[var(--border-color)]">
                        <p className="text-[var(--text-secondary)]">No users found matching "{query}"</p>
                    </div>
                )}
            </div>

            {/* Modal removed/lifted up */}
        </div>
    );
};

export default UserSearch;
