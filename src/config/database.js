import mongoose from 'mongoose';
import { hashPassword } from '../utils/hash.js';

export const connectDatabase = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shop_management_system';
  try {
    await mongoose.connect(uri);
    console.log('Successfully connected to MongoDB Atlas/Local.');
    await seedDatabase();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
};

async function seedDatabase() {
  try {
    const { UserModel } = await import('../models/userModel.js');
    const { ItemModel } = await import('../models/itemModel.js');
    const { InvoiceModel } = await import('../models/invoiceModel.js');

    // 1. Seed Users
    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      console.log('Seeding initial users...');
      await UserModel.insertMany([
        {
          email: 'ali.raza@shopmanager.com',
          name: 'Ali Raza',
          urduName: 'علی رضا',
          phone: '+92 300 1234567',
          role: 'ADMINISTRATOR',
          image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
          password: hashPassword('password123')
        },
        {
          email: 'ahmed.azeem@shopmanager.com',
          name: 'Ahmed Azeem',
          urduName: 'احمد عظیم',
          phone: '+92 300 7654321',
          role: 'CASHIER',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop',
          password: hashPassword('password123')
        }
      ]);
    } else {
      // Migrate any plain passwords in the database to secure hashes
      const users = await UserModel.find();
      for (const u of users) {
        if (u.password && !u.password.includes(':')) {
          u.password = hashPassword(u.password);
          await u.save();
          console.log(`Successfully migrated user ${u.email} password to secure hash.`);
        }
      }
    }

    // 2. Seed Items
    const itemCount = await ItemModel.countDocuments();
    if (itemCount === 0) {
      console.log('Seeding initial items...');
      await ItemModel.insertMany([
        {
          id: 'ITM-001',
          name: 'Basmati Rice 5kg',
          category: 'Groceries',
          costPrice: 450,
          sellingPrice: 580,
          margin: 22.4,
          barcode: '8901234560001',
          description: 'Premium extra long grain basmati rice for biryani.',
          tags: ['Rice', 'Grain', 'Groceries'],
          images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=256&auto=format&fit=crop'],
          status: 'Active',
          stock: 2,
          minStock: 5,
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
          tags: ['Sugar', 'Sweetener'],
          images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=256&auto=format&fit=crop'],
          status: 'Active',
          stock: 15,
          minStock: 5,
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
          tags: ['Flour', 'Wheat', 'Atta'],
          images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=256&auto=format&fit=crop'],
          status: 'Active',
          stock: 1,
          minStock: 5,
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
          tags: ['Oil', 'Cooking'],
          images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=256&auto=format&fit=crop'],
          status: 'Active',
          stock: 12,
          minStock: 5,
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
          tags: ['Cola', 'Beverages', 'Cold Drink'],
          images: ['https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=256&auto=format&fit=crop'],
          status: 'Active',
          stock: 8,
          minStock: 3,
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
          tags: ['Pepsi', 'Beverages'],
          images: ['https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=256&auto=format&fit=crop'],
          status: 'Active',
          stock: 9,
          minStock: 3,
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
          tags: ['Milk', 'Dairy', 'Fresh'],
          images: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=256&auto=format&fit=crop'],
          status: 'Active',
          stock: 5,
          minStock: 5,
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
          tags: ['Cookies', 'Snacks', 'Bakery'],
          images: ['https://images.unsplash.com/photo-1558961309-dbdf05b5d8a9?q=80&w=256&auto=format&fit=crop'],
          status: 'Active',
          stock: 20,
          minStock: 5,
          lastUpdated: '2026-04-10'
        }
      ]);
    }

    // 3. Seed Invoices
    const invoiceCount = await InvoiceModel.countDocuments();
    if (invoiceCount === 0) {
      console.log('Seeding initial invoices...');
      await InvoiceModel.insertMany([
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
          items: [
            { id: 'ITM-001', name: 'Basmati Rice 5kg', quantity: 2, price: 580, total: 1160 },
            { id: 'ITM-002', name: 'Sugar Premium 1kg', quantity: 3, price: 150, total: 450 }
          ],
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
          items: [
            { id: 'ITM-003', name: 'Wheat Flour (Atta) 10kg', quantity: 1, price: 650, total: 650 },
            { id: 'ITM-004', name: 'Pure Cooking Oil 1L', quantity: 2, price: 480, total: 960 }
          ],
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
          items: [
            { id: 'ITM-007', name: 'Milk Premium 1L', quantity: 5, price: 220, total: 1100 },
            { id: 'ITM-008', name: 'Chocolate Cookies 250g', quantity: 4, price: 95, total: 380 }
          ],
          loanDetails: {
            customerName: 'Muhammad Kamran',
            customerPhone: '0300-9876543',
            dueDate: '2026-08-04',
            status: 'Unpaid',
            amountPaid: 0,
            outstandingAmount: 1398.6,
            payments: []
          }
        }
      ]);
    }
    console.log('Database seeding complete.');
  } catch (error) {
    console.error('Seeding database failed:', error.message);
  }
}
