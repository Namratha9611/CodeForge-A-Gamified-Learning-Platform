import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pythonScript = path.join(__dirname, '../../ai-services/main.py');
const testPdfPath = path.join(__dirname, 'test.pdf');
const PORT = 8000;

// Create dummy PDF with sufficient text (>50 chars)
const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";
fs.writeFileSync(testPdfPath, `%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/Resources <<\n/Font <<\n/F1 4 0 R\n>>\n>>\n/MediaBox [0 0 612 792]\n/Contents 5 0 R\n>>\nendobj\n4 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\nendobj\n5 0 obj\n<<\n/Length ${lorem.length + 20}\n>>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(${lorem}) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f\n0000000010 00000 n\n0000000060 00000 n\n0000000117 00000 n\n0000000256 00000 n\n0000000344 00000 n\ntrailer\n<<\n/Size 6\n/Root 1 0 R\n>>\nstartxref\n439\n%%EOF`);

console.log('Starting Python server...');

// Start uvicorn
const pythonProcess = spawn('python', ['-m', 'uvicorn', 'main:app', '--host', '127.0.0.1', '--port', '8000'], {
    cwd: path.dirname(pythonScript),
    shell: true
});

pythonProcess.stdout.on('data', (data) => console.log(`Python: ${data}`));
pythonProcess.stderr.on('data', (data) => console.error(`Python Error: ${data}`));

setTimeout(() => {
    console.log('Sending request to Python server...');

    // We use a simple boundary for multipart body construction manually to avoid dependencies in this script
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    const content = fs.readFileSync(testPdfPath);

    let body = `--${boundary}\r\n`;
    body += 'Content-Disposition: form-data; name="file"; filename="test.pdf"\r\n';
    body += 'Content-Type: application/pdf\r\n\r\n';

    const footer = `\r\n--${boundary}--`;

    const postData = Buffer.concat([
        Buffer.from(body),
        content,
        Buffer.from(footer)
    ]);

    const req = http.request({
        hostname: '127.0.0.1',
        port: PORT,
        path: '/api/generate-course',
        method: 'POST',
        headers: {
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'Content-Length': postData.length
        }
    }, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            console.log('RESPONSE:', data);

            // Validate response 
            try {
                const json = JSON.parse(data);
                if (json.lessons && json.lessons.length > 0) {
                    console.log('SUCCESS: Generated course structure with lessons.');
                } else {
                    console.log('WARNING: Response format unexpected.');
                }
            } catch (e) {
                console.log('ERROR Parsing JSON');
            }

            // Cleanup
            pythonProcess.kill();
            try {
                fs.unlinkSync(testPdfPath);
            } catch (e) { }
            process.exit(0);
        });
    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
        pythonProcess.kill();
        process.exit(1);
    });

    req.write(postData);
    req.end();

}, 15000); // Increased wait time to 15s
