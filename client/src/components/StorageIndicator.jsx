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
        <div className="card p-4 mb-6 relative overflow-hidden group">
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3 flex items-center justify-between uppercase tracking-wider">
                <span className="text-[var(--text-primary)]">Storage</span>
                <span className="text-brand-blue">{Math.round(usage.percentage)}%</span>
            </h3>
            <div className="w-full bg-[var(--border-color)] rounded-full h-2.5 mb-2 overflow-hidden">
                <div
                    className="bg-brand-blue h-2.5 rounded-full transition-all duration-1000 ease-out shadow-sm"
                    style={{ width: `${Math.min(usage.percentage, 100)}%` }}
                ></div>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold text-[var(--text-secondary)]">
                <span className="text-[var(--text-primary)]">{formatBytes(usage.used)}</span>
                <span className="text-[var(--text-secondary)]">of {formatBytes(usage.limit)}</span>
            </div>
        </div>
    );
};

export default StorageIndicator;
