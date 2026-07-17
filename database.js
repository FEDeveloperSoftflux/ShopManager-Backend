import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, process.env.DATABASE_URL || 'shop.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    initDatabase();
  }
});

// Helper wrapper to run sqlite queries as Promises
export const dbQuery = {
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  },
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

async function initDatabase() {
  try {
    // 1. Create tables
    await dbQuery.run(`
      CREATE TABLE IF NOT EXISTS users (
        email TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        urduName TEXT NOT NULL,
        phone TEXT,
        role TEXT NOT NULL,
        image TEXT,
        password TEXT NOT NULL
      )
    `);

    await dbQuery.run(`
      CREATE TABLE IF NOT EXISTS items (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        category TEXT,
        costPrice REAL,
        sellingPrice REAL,
        margin REAL,
        barcode TEXT UNIQUE,
        description TEXT,
        tags TEXT, -- JSON stringified array
        images TEXT, -- JSON stringified array
        status TEXT DEFAULT 'Active',
        lastUpdated TEXT
      )
    `);

    await dbQuery.run(`
      CREATE TABLE IF NOT EXISTS invoices (
        invoiceNo TEXT PRIMARY KEY,
        dateTime TEXT NOT NULL,
        units INTEGER,
        subtotal REAL,
        discount REAL,
        tax REAL,
        total REAL,
        paymentMethod TEXT,
        cashier TEXT,
        items TEXT, -- JSON stringified array of objects
        loanDetails TEXT -- JSON stringified object or NULL
      )
    `);

    console.log('Database tables verified/created successfully.');

    // 2. Seed data if tables are empty
    await seedUsers();
    await seedItems();
    await seedInvoices();

  } catch (error) {
    console.error('Error during database initialization:', error);
  }
}

async function seedUsers() {
  const row = await dbQuery.get('SELECT COUNT(*) as count FROM users');
  if (row.count === 0) {
    console.log('Seeding initial users...');
    const seed = [
      {
        email: 'ali.raza@shopmanager.com',
        name: 'Ali Raza',
        urduName: 'علی رضا',
        phone: '+92 300 1234567',
        role: 'ADMINISTRATOR',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
        password: 'password123'
      },
      {
        email: 'ahmed.azeem@shopmanager.com',
        name: 'Ahmed Azeem',
        urduName: 'احمد عظیم',
        phone: '+92 300 7654321',
        role: 'CASHIER',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop',
        password: 'password123'
      }
    ];

    for (const u of seed) {
      await dbQuery.run(
        'INSERT INTO users (email, name, urduName, phone, role, image, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [u.email, u.name, u.urduName, u.phone, u.role, u.image, u.password]
      );
    }
  }
}

async function seedItems() {
  const row = await dbQuery.get('SELECT COUNT(*) as count FROM items');
  if (row.count === 0) {
    console.log('Seeding initial items...');
    const seed = [
      {
        id: 'ITM-001',
        name: 'Basmati Rice 5kg',
        category: 'Groceries',
        costPrice: 450,
        sellingPrice: 580,
        margin: 22.4,
        barcode: '8901234560001',
        description: 'Premium extra long grain basmati rice for biryani.',
        tags: JSON.stringify(['Rice', 'Grain', 'Groceries']),
        images: JSON.stringify(['https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=256&auto=format&fit=crop']),
        status: 'Active',
        lastUpdated: '2026-04-05'
      },
      {
        id: 'ITM-002',
        name: 'Sugar Premium 1kg',
        category: 'Groceries',
        costPrice: 120,
        sellingPrice: 150,
        margin: 20.0,
        barcode: '8901234560002',
        description: 'Refined pure white cane sugar for everyday sweetness.',
        tags: JSON.stringify(['Sugar', 'Sweetener']),
        images: JSON.stringify(['https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=256&auto=format&fit=crop']),
        status: 'Active',
        lastUpdated: '2026-04-06'
      },
      {
        id: 'ITM-003',
        name: 'Wheat Flour (Atta) 10kg',
        category: 'Groceries',
        costPrice: 550,
        sellingPrice: 650,
        margin: 15.4,
        barcode: '8901234560003',
        description: '100% stone-ground whole wheat flour for soft rotis.',
        tags: JSON.stringify(['Flour', 'Wheat', 'Atta']),
        images: JSON.stringify(['https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=256&auto=format&fit=crop']),
        status: 'Active',
        lastUpdated: '2026-04-07'
      },
      {
        id: 'ITM-004',
        name: 'Pure Cooking Oil 1L',
        category: 'Groceries',
        costPrice: 400,
        sellingPrice: 480,
        margin: 16.7,
        barcode: '8901234560004',
        description: 'Double-refined healthy sunflower cooking oil.',
        tags: JSON.stringify(['Oil', 'Cooking']),
        images: JSON.stringify(['https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=256&auto=format&fit=crop']),
        status: 'Active',
        lastUpdated: '2026-04-08'
      },
      {
        id: 'ITM-005',
        name: 'Coca Cola 1.5L',
        category: 'Beverages',
        costPrice: 110,
        sellingPrice: 140,
        margin: 21.4,
        barcode: '8901234560005',
        description: 'Crisp carbonated soft drink to quench thirst.',
        tags: JSON.stringify(['Cola', 'Beverages', 'Cold Drink']),
        images: JSON.stringify(['https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=256&auto=format&fit=crop']),
        status: 'Active',
        lastUpdated: '2026-04-09'
      },
      {
        id: 'ITM-006',
        name: 'Pepsi 1.5L',
        category: 'Beverages',
        costPrice: 115,
        sellingPrice: 145,
        margin: 20.7,
        barcode: '8901234560006',
        description: 'Sweet carbonated soft drink cola blend.',
        tags: JSON.stringify(['Pepsi', 'Beverages']),
        images: JSON.stringify(['https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=256&auto=format&fit=crop']),
        status: 'Active',
        lastUpdated: '2026-04-09'
      },
      {
        id: 'ITM-007',
        name: 'Milk Premium 1L',
        category: 'Dairy',
        costPrice: 180,
        sellingPrice: 220,
        margin: 18.2,
        barcode: '8901234560007',
        description: 'Pasteurized homogenized full cream pure buffalo milk.',
        tags: JSON.stringify(['Milk', 'Dairy', 'Fresh']),
        images: JSON.stringify(['https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=256&auto=format&fit=crop']),
        status: 'Active',
        lastUpdated: '2026-04-10'
      },
      {
        id: 'ITM-008',
        name: 'Chocolate Cookies 250g',
        category: 'Snacks',
        costPrice: 70,
        sellingPrice: 95,
        margin: 26.3,
        barcode: '8901234560008',
        description: 'Crunchy cookies baked with premium dark chocolate chips.',
        tags: JSON.stringify(['Cookies', 'Snacks', 'Bakery']),
        images: JSON.stringify(['https://images.unsplash.com/photo-1558961309-dbdf05b5d8a9?q=80&w=256&auto=format&fit=crop']),
        status: 'Active',
        lastUpdated: '2026-04-10'
      }
    ];

    for (const it of seed) {
      await dbQuery.run(
        'INSERT INTO items (id, name, category, costPrice, sellingPrice, margin, barcode, description, tags, images, status, lastUpdated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [it.id, it.name, it.category, it.costPrice, it.sellingPrice, it.margin, it.barcode, it.description, it.tags, it.images, it.status, it.lastUpdated]
      );
    }
  }
}

async function seedInvoices() {
  const row = await dbQuery.get('SELECT COUNT(*) as count FROM invoices');
  if (row.count === 0) {
    console.log('Seeding initial invoices...');
    const seed = [
      {
        invoiceNo: 'INV-1001',
        dateTime: '2026-07-05 10:30',
        units: 5,
        subtotal: 1610,
        discount: 161,
        tax: 72.45,
        total: 1521.45,
        paymentMethod: 'Cash',
        cashier: 'Ahmed Azeem',
        items: JSON.stringify([
          { id: 'ITM-001', name: 'Basmati Rice 5kg', quantity: 2, price: 580, total: 1160 },
          { id: 'ITM-002', name: 'Sugar Premium 1kg', quantity: 3, price: 150, total: 450 }
        ]),
        loanDetails: null
      },
      {
        invoiceNo: 'INV-1002',
        dateTime: '2026-07-05 12:45',
        units: 3,
        subtotal: 1610,
        discount: 100,
        tax: 75.5,
        total: 1585.5,
        paymentMethod: 'Card',
        cashier: 'Ali Raza',
        items: JSON.stringify([
          { id: 'ITM-003', name: 'Wheat Flour (Atta) 10kg', quantity: 1, price: 650, total: 650 },
          { id: 'ITM-004', name: 'Pure Cooking Oil 1L', quantity: 2, price: 480, total: 960 }
        ]),
        loanDetails: null
      },
      {
        invoiceNo: 'INV-1003',
        dateTime: '2026-07-04 15:10',
        units: 9,
        subtotal: 1480,
        discount: 148,
        tax: 66.6,
        total: 1398.6,
        paymentMethod: 'Credit',
        cashier: 'Ahmed Azeem',
        items: JSON.stringify([
          { id: 'ITM-007', name: 'Milk Premium 1L', quantity: 5, price: 220, total: 1100 },
          { id: 'ITM-008', name: 'Chocolate Cookies 250g', quantity: 4, price: 95, total: 380 }
        ]),
        loanDetails: JSON.stringify({
          customerName: 'Muhammad Kamran',
          customerPhone: '0300-9876543',
          dueDate: '2026-08-04',
          status: 'Unpaid',
          amountPaid: 0,
          outstandingAmount: 1398.6,
          payments: []
        })
      }
    ];

    for (const inv of seed) {
      await dbQuery.run(
        'INSERT INTO invoices (invoiceNo, dateTime, units, subtotal, discount, tax, total, paymentMethod, cashier, items, loanDetails) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [inv.invoiceNo, inv.dateTime, inv.units, inv.subtotal, inv.discount, inv.tax, inv.total, inv.paymentMethod, inv.cashier, inv.items, inv.loanDetails]
      );
    }
  }
}

export default db;
