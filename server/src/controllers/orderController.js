const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, city, postalCode, phone, total } = req.body;

    // Log the user object to debug
    console.log('User from request:', req.user);

    // Validate order items and check stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }
      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}` 
        });
      }
    }

    // Create order with the user ID from auth middleware
    const order = new Order({
      user: req.user._id, // Use _id from auth middleware
      items,
      shippingAddress,
      city,
      postalCode,
      phone,
      total,
      status: 'pending'
    });

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stockQuantity: -item.quantity }
      });
    }

    await order.save();

    // Populate the response with product details
    const populatedOrder = await Order.findById(order._id)
      .populate('items.product')
      .populate('user', 'email');

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    console.log('Getting orders for user:', req.user._id);
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort('-createdAt');
    console.log('Found orders:', orders);
    res.json(orders);
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    console.log('Admin requesting all orders');
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const orders = await Order.find()
      .populate('user', 'email')
      .populate('items.product')
      .sort('-createdAt');
    console.log('Found all orders:', orders);
    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    ).populate('user', 'email').populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 