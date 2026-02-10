import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <div className="container mx-auto p-4 pt-24 animate-fade-in text-gray-200 flex justify-center">
            <div className="glass p-8 w-full max-w-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/20 rounded-full blur-[50px] -mr-10 -mt-10"></div>

                <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 text-white border-b border-gray-700 pb-4 relative z-10">
                    <span className="w-2 h-8 bg-pink-500 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.5)]"></span>
                    User Profile
                </h2>

                <div className="space-y-6 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-neon-blue to-neon-purple flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Username</p>
                            <p className="text-xl font-bold text-white">{user.username}</p>
                        </div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">Email Address</p>
                        <p className="text-lg text-white">{user.email}</p>
                    </div>

                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">Account ID</p>
                        <p className="text-lg text-gray-300 font-mono">{user.id}</p>
                    </div>

                    <button
                        onClick={logout}
                        className="w-full mt-8 py-3 px-4 bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/40 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
