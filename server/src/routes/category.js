const express = require('express');
const router = express.Router();
const { auth, requireAdmin } = require('../middleware/auth');
const categoryController = require('../controllers/categoryController');

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:categoryId/subcategories', categoryController.getSubcategories);

// Admin routes
router.post('/', auth, requireAdmin, categoryController.createCategory);
router.post('/:categoryId/subcategories', auth, requireAdmin, categoryController.createSubcategory);
router.delete('/:id', auth, requireAdmin, categoryController.deleteCategory);
router.delete('/:categoryId/subcategories/:subcategoryId', auth, requireAdmin, categoryController.deleteSubcategory);

module.exports = router; 