import { useState, useEffect } from 'react';
import { getStorageUsage } from '../api/api';

const StorageIndicator = ({ refreshKey }) => {
    const [usage, setUsage] = useState({ used: 0, limit: 1073741824, percentage: 0 }); // Default 1GB limit

    useEffect(() => {
        const fetchUsage = async () => {
            try {
                const { data } = await getStorageUsage();
                setUsage(data);
            } catch (error) {
                console.error('Failed to fetch storage usage', error);
            }
        };
        fetchUsage();
    }, [refreshKey]);

    const formatBytes = (bytes, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    return (

        <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 shadow-lg rounded-xl p-4 mb-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center justify-between">
                <span>Storage Used</span>
                <span className="text-blue-400 text-sm">{Math.round(usage.percentage)}%</span>
            </h3>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2 overflow-hidden border border-white/5">
                <div
                    className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    style={{ width: `${Math.min(usage.percentage, 100)}%` }}
                ></div>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-400">
                <span>{formatBytes(usage.used)}</span>
                <span>of {formatBytes(usage.limit)}</span>
            </div>
        </div>
    );
};

export default StorageIndicator;
