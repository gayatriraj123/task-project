const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort('name');
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createSubcategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const subcategory = new Subcategory({
      name,
      category: categoryId
    });

    await subcategory.save();
    res.status(201).json(subcategory);
  } catch (error) {
    console.error('Create subcategory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSubcategories = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subcategories = await Subcategory.find({ category: categoryId }).sort('name');
    res.json(subcategories);
  } catch (error) {
    console.error('Get subcategories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    // Delete associated subcategories
    await Subcategory.deleteMany({ category: req.params.id });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteSubcategory = async (req, res) => {
  try {
    const { categoryId, subcategoryId } = req.params;
    const subcategory = await Subcategory.findOneAndDelete({
      _id: subcategoryId,
      category: categoryId
    });

    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    res.json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    console.error('Delete subcategory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 