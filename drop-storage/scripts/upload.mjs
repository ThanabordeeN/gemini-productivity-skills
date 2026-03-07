import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Use built-in fetch (Node 18+)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Try to load API_KEY from environment or local .env file
let API_KEY = process.env.API_KEY;

if (!API_KEY) {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/^API_KEY=(.*)$/m);
        if (match) {
            API_KEY = match[1].trim();
        }
    }
}

const UPLOAD_URL = process.env.UPLOAD_URL || 'https://drop.2edge.co/api/upload';

// 1. Generate encrypted token
const generateToken = () => {
    if (!API_KEY) {
        throw new Error('API_KEY not found. Please set it in the environment or in the skill\'s .env file.');
    }
    const payload = JSON.stringify({ timestamp: Date.now() });
    const iv = crypto.randomBytes(12); // Standard for GCM
    const key = crypto.createHash('sha256').update(API_KEY).digest();
    
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    let encrypted = cipher.update(payload, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    
    // Format: iv:authTag:encryptedPayload
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
};

const uploadFile = async (filePath) => {
    if (!fs.existsSync(filePath)) {
        console.error(`Error: File not found: ${filePath}`);
        process.exit(1);
    }

    const token = generateToken();
    const formData = new FormData();
    const fileBlob = new Blob([fs.readFileSync(filePath)]);
    const fileName = filePath.split('/').pop() || filePath.split('\\').pop();
    
    formData.append('file', fileBlob, fileName);

    try {
        const response = await fetch(UPLOAD_URL, {
            method: 'POST',
            headers: {
                'X-API-Token': token
            },
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Upload failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

const fileArg = process.argv[2];
if (!fileArg) {
    console.error('Error: No file path provided.');
    process.exit(1);
} else {
    uploadFile(fileArg);
}
