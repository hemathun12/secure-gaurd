
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Storage } from '@google-cloud/storage';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { Readable } from 'stream';

dotenv.config();

// Configure GCS (Optional)
let bucket;
const bucketName = process.env.GCS_BUCKET_NAME;

if (bucketName && bucketName !== 'your-gcs-bucket-name') {
    const storage = new Storage({
        keyFilename: path.resolve('service-account-key.json'),
    });
    bucket = storage.bucket(bucketName);
}

// Configure AWS S3 (Optional)
let s3Client;
const s3BucketName = process.env.AWS_S3_BUCKET_NAME;

if (s3BucketName) {
    s3Client = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });
} else {
    // Only log if neither cloud provider is configured
    if (!bucket) {
        console.log("Cloud storage (GCS/AWS) not configured. Using local storage.");
    }
}

// Helper to ensure directory exists
const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

export const uploadFile = async (fileStream, destination, mimeType) => {
    // 1. AWS S3
    if (s3Client) {
        // Collect stream to buffer for S3 PutObject (simple implementation)
        // For larger files or better performance, consider using @aws-sdk/lib-storage Upload
        const chunks = [];
        for await (const chunk of fileStream) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        const command = new PutObjectCommand({
            Bucket: s3BucketName,
            Key: destination,
            Body: buffer,
            ContentType: mimeType || 'application/octet-stream',
        });

        await s3Client.send(command);
        return `s3://${s3BucketName}/${destination}`;
    }

    // 2. Google Cloud Storage
    if (bucket) {
        const file = bucket.file(destination);
        const writeStream = file.createWriteStream({
            resumable: false,
            contentType: mimeType || 'application/octet-stream',
        });

        return new Promise((resolve, reject) => {
            fileStream.pipe(writeStream)
                .on('error', (err) => reject(err))
                .on('finish', () => resolve(`gs://${bucketName}/${destination}`));
        });
    }

    // 3. Local Fallback
    // Normalize destination to ensure safe path usage
    const cleanDestination = destination.replace(/^uploads\//, '');
    const localPath = path.resolve('uploads', cleanDestination);

    const dir = path.dirname(localPath);
    try {
        ensureDir(dir);
    } catch (err) {
        console.error(`[DEBUG] Error creating directory: ${err.message}`);
        throw err;
    }

    const writeStream = fs.createWriteStream(localPath);

    return new Promise((resolve, reject) => {
        fileStream.pipe(writeStream)
            .on('error', (err) => {
                console.error(`[DEBUG] Write stream error: ${err.message}`);
                reject(err);
            })
            .on('finish', () => {
                console.log(`[DEBUG] Upload finished: ${localPath}`);
                resolve(localPath);
            });
    });
};

export const downloadFile = async (fileName) => {
    // 1. AWS S3
    if (s3Client && fileName.startsWith('s3://')) {
        const key = fileName.replace(`s3://${s3BucketName}/`, '');
        const command = new GetObjectCommand({
            Bucket: s3BucketName,
            Key: key,
        });
        const response = await s3Client.send(command);
        return response.Body; // Returns a readable stream in Node.js
    }

    // 2. Google Cloud Storage
    if (bucket && fileName.startsWith('gs://')) {
        const cleanName = fileName.replace(`gs://${bucketName}/`, '');
        const file = bucket.file(cleanName);
        return file.createReadStream();
    }

    // 3. Local Fallback
    let localPath = fileName;
    if (!fs.existsSync(localPath)) {
        // Maybe it's a relative path from uploads?
        localPath = path.join('uploads', fileName);
    }

    if (fs.existsSync(localPath)) {
        return fs.createReadStream(localPath);
    } else {
        throw new Error(`File not found: ${fileName}`);
    }
};

export const getFileMetadata = async (fileName) => {
    // 1. AWS S3
    if (s3Client && fileName.startsWith('s3://')) {
        // Metadata fetching not strictly implemented for S3 yet in this snippet
        return {};
    }

    // 2. Google Cloud Storage
    if (bucket && fileName.startsWith('gs://')) {
        const cleanName = fileName.replace(`gs://${bucketName}/`, '');
        const file = bucket.file(cleanName);
        const [metadata] = await file.getMetadata();
        return metadata;
    }

    // 3. Local Fallback
    const localPath = fileName;
    if (fs.existsSync(localPath)) {
        const stats = fs.statSync(localPath);
        return { size: stats.size, updated: stats.mtime };
    }
    return {};
}

export const deleteFile = async (filePath) => {
    // 1. AWS S3
    if (s3Client && filePath.startsWith('s3://')) {
        const key = filePath.replace(`s3://${s3BucketName}/`, '');
        const command = new DeleteObjectCommand({
            Bucket: s3BucketName,
            Key: key,
        });
        console.log(`[DEBUG] Deleting from S3: ${key}`);
        await s3Client.send(command);
        return;
    }

    // 2. Google Cloud Storage
    if (bucket && filePath.startsWith('gs://')) {
        const cleanName = filePath.replace(`gs://${bucketName}/`, '');
        const file = bucket.file(cleanName);
        console.log(`[DEBUG] Deleting from GCS: ${cleanName}`);
        await file.delete();
        return;
    }

    // 3. Local Fallback
    let localPath = filePath;
    if (!path.isAbsolute(localPath)) {
        localPath = path.resolve(localPath);
    }

    console.log(`[DEBUG] Deleting local file: ${localPath}`);

    if (fs.existsSync(localPath)) {
        await fs.promises.unlink(localPath);
    } else {
        console.warn(`[WARN] File not found for deletion: ${localPath}`);
    }
};

export default {
    uploadFile,
    downloadFile,
    getFileMetadata,
    deleteFile
};
