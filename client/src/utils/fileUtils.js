export const getFileIcon = (filename) => {
    if (!filename) return '📁';
    const extension = filename.split('.').pop().toLowerCase();

    switch (extension) {
        case 'pdf':
            return '📄';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'webp':
        case 'svg':
        case 'bmp':
            return '🖼️';
        case 'xls':
        case 'xlsx':
        case 'csv':
            return '📊';
        case 'doc':
        case 'docx':
            return '📝';
        case 'txt':
            return '📄';
        case 'zip':
        case 'rar':
        case '7z':
            return '📦';
        case 'mp4':
        case 'mov':
        case 'avi':
        case 'mkv':
            return '🎥';
        case 'mp3':
        case 'wav':
        case 'ogg':
            return '🎵';
        default:
            return '📁';
    }
};
