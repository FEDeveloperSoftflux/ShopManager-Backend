import { ItemModel } from '../models/itemModel.js';

export const itemController = {
  /**
   * GET /api/items
   * Returns all items sorted by most recently updated.
   */
  async getAllItems(req, res) {
    try {
      const items = await ItemModel.find().sort({ updatedAt: -1 });
      res.json(items);
    } catch (err) {
      console.error('Get items error:', err.message);
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * POST /api/items
   * Body: full item object
   * Creates a new item. Checks for duplicate name/barcode.
   */
  async createItem(req, res) {
    const { id, name, category, costPrice, sellingPrice, margin, barcode, description, tags, images, status, stock, minStock, lastUpdated } = req.body;
    try {
      // Check for duplicate name or barcode
      const duplicateQuery = {
        $or: [
          { name: name.trim() }
        ]
      };
      if (barcode && barcode.trim()) {
        duplicateQuery.$or.push({ barcode: barcode.trim() });
      }

      const existing = await ItemModel.findOne(duplicateQuery);
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
      console.error('Create item error:', err.message);
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * PUT /api/items/:id
   * Body: updated item fields
   * Updates an existing item by its custom id field.
   */
  async updateItem(req, res) {
    const { id: paramId } = req.params;
    const { name, category, costPrice, sellingPrice, margin, barcode, description, tags, images, status, stock, minStock, lastUpdated } = req.body;
    try {
      // Check for duplicate name/barcode excluding current item
      const duplicateQuery = {
        id: { $ne: paramId },
        $or: [
          { name: name.trim() }
        ]
      };
      if (barcode && barcode.trim()) {
        duplicateQuery.$or.push({ barcode: barcode.trim() });
      }

      const existing = await ItemModel.findOne(duplicateQuery);
      if (existing) {
        return res.status(400).json({ error: 'Another item has same Name or Barcode / اس نام یا بارکوڈ کا دوسرا آئٹم موجود ہے' });
      }

      await ItemModel.findOneAndUpdate({ id: paramId }, {
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
      }, { new: true });

      res.json({ message: 'Item updated successfully' });
    } catch (err) {
      console.error('Update item error:', err.message);
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * DELETE /api/items/:id
   * Deletes an item by its custom id field.
   */
  async deleteItem(req, res) {
    const { id } = req.params;
    try {
      await ItemModel.findOneAndDelete({ id });
      res.json({ message: 'Item deleted successfully' });
    } catch (err) {
      console.error('Delete item error:', err.message);
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * PUT /api/items-bulk/prices
   * Body: array of items with updated prices
   * Updates cost/selling prices for multiple items at once.
   */
  async updateBulkPrices(req, res) {
    const updatedItems = req.body;
    try {
      if (!Array.isArray(updatedItems)) {
        return res.status(400).json({ error: 'Expected an array of items' });
      }

      for (const it of updatedItems) {
        await ItemModel.findOneAndUpdate({ id: it.id }, {
          costPrice: it.costPrice,
          sellingPrice: it.sellingPrice,
          margin: it.margin,
          lastUpdated: new Date().toISOString().split('T')[0]
        });
      }

      res.json({ message: 'Bulk prices applied successfully' });
    } catch (err) {
      console.error('Bulk prices error:', err.message);
      res.status(500).json({ error: err.message });
    }
  }
};
