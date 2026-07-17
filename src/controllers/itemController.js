import { ItemModel } from '../models/itemModel.js';

export const itemController = {
  async getAllItems(req, res) {
    try {
      const items = await ItemModel.find().sort({ updatedAt: -1 });
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async createItem(req, res) {
    const { id, name, category, costPrice, sellingPrice, margin, barcode, description, tags, images, status, stock, minStock, lastUpdated } = req.body;
    try {
      const existing = await ItemModel.findOne({
        $or: [
          { name: name.trim() },
          { barcode: barcode ? barcode.trim() : '___nonexistent___' }
        ]
      });
      if (existing) {
        return res.status(400).json({ error: 'Item with same Name or Barcode already exists / آئٹم پہلے سے موجود ہے' });
      }

      const newItem = new ItemModel({
        id,
        name: name.trim(),
        category,
        costPrice,
        sellingPrice,
        margin,
        barcode: barcode ? barcode.trim() : undefined,
        description,
        tags,
        images,
        status,
        stock: stock !== undefined ? Number(stock) : 0,
        minStock: minStock !== undefined ? Number(minStock) : 5,
        lastUpdated: lastUpdated || new Date().toISOString().split('T')[0]
      });

      await newItem.save();
      res.status(201).json({ message: 'Item saved successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async updateItem(req, res) {
    const { id: paramId } = req.params;
    const { name, category, costPrice, sellingPrice, margin, barcode, description, tags, images, status, stock, minStock, lastUpdated } = req.body;
    try {
      const existing = await ItemModel.findOne({
        id: { $ne: paramId },
        $or: [
          { name: name.trim() },
          { barcode: barcode ? barcode.trim() : '___nonexistent___' }
        ]
      });
      if (existing) {
        return res.status(400).json({ error: 'Another item has same Name or Barcode / اس نام یا بارکوڈ کا دوسرا آئٹم موجود ہے' });
      }

      await ItemModel.findOneAndUpdate(
        { id: paramId },
        {
          name: name.trim(),
          category,
          costPrice,
          sellingPrice,
          margin,
          barcode: barcode ? barcode.trim() : undefined,
          description,
          tags,
          images,
          status,
          stock: stock !== undefined ? Number(stock) : 0,
          minStock: minStock !== undefined ? Number(minStock) : 5,
          lastUpdated: lastUpdated || new Date().toISOString().split('T')[0]
        }
      );

      res.json({ message: 'Item updated successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async deleteItem(req, res) {
    const { id } = req.params;
    try {
      await ItemModel.findOneAndDelete({ id });
      res.json({ message: 'Item deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async updateBulkPrices(req, res) {
    const updatedItems = req.body;
    try {
      for (const it of updatedItems) {
        await ItemModel.findOneAndUpdate(
          { id: it.id },
          {
            costPrice: it.costPrice,
            sellingPrice: it.sellingPrice,
            margin: it.margin,
            lastUpdated: new Date().toISOString().split('T')[0]
          }
        );
      }
      res.json({ message: 'Bulk prices applied successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
