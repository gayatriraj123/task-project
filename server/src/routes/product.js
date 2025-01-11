const express = require('express');
const router = express.Router();
const { auth, requireAdmin } = require('../middleware/auth');
const productController = require('../controllers/productController');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/subcategory/:subcategoryId', productController.getProductsBySubcategory);

// Admin routes
router.post('/', auth, requireAdmin, productController.createProduct);
router.put('/:id', auth, requireAdmin, productController.updateProduct);
router.delete('/:id', auth, requireAdmin, productController.deleteProduct);

module.exports = router; 