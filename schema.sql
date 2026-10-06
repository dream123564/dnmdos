-- 龙黑发卡 Cloudflare D1 数据库表结构
-- 在 Cloudflare Dashboard → Workers & Pages → D1 → 控制台执行

CREATE TABLE IF NOT EXISTS merchants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  shop_name TEXT DEFAULT '',
  shop_notice TEXT DEFAULT '',
  theme_color TEXT DEFAULT '#2196F3',
  balance REAL DEFAULT 0,
  status INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now', '+8 hours'))
);

CREATE TABLE IF NOT EXISTS goods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  merchant_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  short_desc TEXT DEFAULT '',
  description TEXT DEFAULT '',
  price REAL NOT NULL DEFAULT 0,
  category_id INTEGER DEFAULT 0,
  status INTEGER DEFAULT 1,
  stock INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now', '+8 hours'))
);

CREATE TABLE IF NOT EXISTS cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  merchant_id INTEGER NOT NULL,
  goods_id INTEGER NOT NULL,
  card_content TEXT NOT NULL,
  status INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now', '+8 hours'))
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_no TEXT UNIQUE NOT NULL,
  merchant_id INTEGER NOT NULL,
  goods_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  status INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now', '+8 hours'))
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  merchant_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  sort INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS coupons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  merchant_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  money REAL NOT NULL,
  min_price REAL NOT NULL,
  used INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now', '+8 hours'))
);
