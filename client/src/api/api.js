
import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (username, email, password) => api.post('/auth/register', { username, email, password });
export const getMe = () => api.get('/auth/me');

export const uploadFile = (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress,
    });
};

export const listFiles = () => api.get('/files');
export const listSharedFiles = () => api.get('/files/shared');
export const shareFile = (fileId, recipientEmail) => api.post('/files/share', { fileId, recipientEmail });
export const downloadFile = (id) => api.get(`/files/download/${id}`, { responseType: 'blob' });
export const deleteFile = (id) => api.delete(`/files/${id}`);
export const getFilePermissions = (id) => api.get(`/files/${id}/permissions`);
export const revokeAccess = (fileId, userId) => api.delete(`/files/${fileId}/permissions/${userId}`);
export const getFilesStatus = (userId) => api.get(`/files/status/${userId}`);
export const searchUsers = (query) => api.get(`/users/search?q=${query}`);

export default api;
