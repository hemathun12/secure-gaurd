const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'xlsx', 'jpg', 'png', 'txt'];
const BLOCKED_EXTENSIONS = ['exe', 'bat', 'cmd', 'apk', 'js'];

export const analyzeFile = (file) => {
    const originalName = file.originalname.toLowerCase();
    const extension = originalName.split('.').pop();
    const size = file.size;

    // 1. Safety Check (Rule-Based AI)
    if (BLOCKED_EXTENSIONS.includes(extension)) {
        return { safe: false, reason: 'File type blocked by AI Security Rule: Executable/Script files are not allowed.' };
    }

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
        return { safe: false, reason: 'File type blocked by AI Security Rule: Only PDF, DOCX, XLSX, JPG, PNG, TXT are allowed.' };
    }

    // 2. Encryption Level Selection (Rule-Based AI)
    // Small/normal files → AES-128
    // Medium files → AES-192
    // Large or sensitive files → AES-256

    let encryptionLevel = 'AES-128';
    let keyLength = 16; // 128 bits = 16 bytes

    if (size > 50 * 1024 * 1024) { // > 50MB (Large)
        encryptionLevel = 'AES-256';
        keyLength = 32;
    } else if (size >= 5 * 1024 * 1024) { // 5MB - 50MB (Medium)
        encryptionLevel = 'AES-192';
        keyLength = 24;
    } else {
        // < 5MB (Small)
        encryptionLevel = 'AES-128';
        keyLength = 16;
    }

    return {
        safe: true,
        algo: encryptionLevel,
        keyLength: keyLength,
        mimeType: file.mimetype,
        extension: extension
    };
};

export default {
    analyzeFile
};
