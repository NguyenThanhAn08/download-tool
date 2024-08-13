const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Đảm bảo rằng thư mục tồn tại
const dbDir = path.resolve(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Tạo hoặc mở cơ sở dữ liệu
const dbPath = path.join(dbDir, 'bot.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Tạo bảng nếu chưa tồn tại
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS auto_replies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            guild_id TEXT NOT NULL,
            trigger TEXT NOT NULL,
            response TEXT NOT NULL
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS welcome_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            guild_id TEXT NOT NULL UNIQUE,
            channel_id TEXT NOT NULL,
            message TEXT NOT NULL
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS invites_channels (
            inviter_id TEXT NOT NULL,
            invitee_id TEXT NOT NULL,
            guild_id TEXT NOT NULL,
            PRIMARY KEY (invitee_id, guild_id)
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS banned_users (
            guild_id TEXT,
            user_id TEXT,
            PRIMARY KEY (guild_id, user_id)
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            balance INTEGER DEFAULT 0
        )
    `);
});

module.exports = db;