
import crypto from 'crypto';
import fs from 'fs';

// Encryption Algorithms mappings to Node crypto alogs
const ALGO_MAP = {
    'AES-128': 'aes-128-cbc',
    'AES-192': 'aes-192-cbc',
    'AES-256': 'aes-256-cbc'
};

export const generateKey = (length) => {
    return crypto.randomBytes(length);
};

export const generateIV = () => {
    return crypto.randomBytes(16); // AES always uses 16-byte IV
};

export const encryptStream = (inputStream, key, iv, algoName) => {
    const algo = ALGO_MAP[algoName] || 'aes-128-cbc';
    const cipher = crypto.createCipheriv(algo, key, iv);
    return inputStream.pipe(cipher);
};

export const decryptStream = (encryptedStream, key, iv, algoName) => {
    const algo = ALGO_MAP[algoName] || 'aes-128-cbc';
    const decipher = crypto.createDecipheriv(algo, key, iv);
    return encryptedStream.pipe(decipher);
};

export default {
    generateKey,
    generateIV,
    encryptStream,
    decryptStream
};
