const Item = require('../models/model');

// CREATE async function

const createItem = async (req, res) => {
    const { name, description, quantity } = req.body;
    const newItem = new Item({ name, description, quantity });

    try {
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// READ (one by name) async function

const getItemsByName = async (req, res) => {
    try {
        const items = await Item.find({ name: req.params.name });
        if (!items || items.length === 0) return res.status(404).json({ message: 'No items found with that name' });
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// READ (all) async function

const getAllItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// READ (one) async function

const getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// UPDATE async function

const updateItem = async (req, res) => {

    const { name, description, quantity } = req.body;

    try {
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id, 
            { name, description, quantity }, 
            { new: true, runValidators: true }
        );
        if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// DELETE async function

const deleteItem = async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { 
    createItem, 
    getAllItems, 
    getItemById, 
    updateItem, 
    deleteItem,
    getItemsByName
};
