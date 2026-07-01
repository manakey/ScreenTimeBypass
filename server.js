const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// データファイルの初期化
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

const server = http.createServer((req, res) => {
    // 1. 静的ファイル（HTML）の配信
    if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        });
    }
    // 2. URL一覧の取得 API
    else if (req.method === 'GET' && req.url === '/api/urls') {
        fs.readFile(DATA_FILE, (err, data) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    }
    // 3. URLの登録 API
    else if (req.method === 'POST' && req.url === '/api/urls') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const newLink = JSON.parse(body); // { name, url }
            newLink.id = Date.now().toString(); // 簡易ユニークID

            fs.readFile(DATA_FILE, (err, data) => {
                const list = JSON.parse(data);
                list.push(newLink);
                fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), () => {
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, item: newLink }));
                });
            });
        });
    }
    // 4. URLの削除 API
    else if (req.method === 'DELETE' && req.url.startsWith('/api/urls/')) {
        const idToDelete = req.url.split('/').pop();

        fs.readFile(DATA_FILE, (err, data) => {
            let list = JSON.parse(data);
            list = list.filter(item => item.id !== idToDelete);
            fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), () => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            });
        });
    }
    // 5. 該当なし（404）
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
