const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());

// お気に入りデータ（初期値）
let favorites = [
    { id: 1, title: 'Google', url: 'https://google.com' },
    { id: 2, title: 'GitHub', url: 'https://github.com' }
];

// 1. メイン画面（index.htmlを返す）
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. お気に入り一覧を取得するAPI
app.get('/api/favorites', (req, res) => {
    res.json(favorites);
});

// 3. お気に入り追加のAPI
app.post('/api/favorites', (req, res) => {
    const { title, url } = req.body;
    const newFavorite = { id: Date.now(), title, url };
    favorites.push(newFavorite);
    res.status(201).json(newFavorite);
});

// 4. お気に入り削除のAPI
app.delete('/api/favorites/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    favorites = favorites.filter(fav => fav.id !== id);
    res.status(200).json({ message: 'Deleted' });
});

app.listen(PORT, () => {
    console.log(`サーバーが起動しました！ http://localhost:${PORT}`);
});
