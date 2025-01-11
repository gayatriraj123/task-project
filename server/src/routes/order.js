const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

// Customer routes
router.post('/', auth, orderController.createOrder);
router.get('/my-orders', auth, orderController.getMyOrders);

// Admin routes
router.get('/', auth, orderController.getAllOrders);
router.patch('/:orderId/status', auth, orderController.updateOrderStatus);

module.exports = router; 