const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Function to find an available port
const findAvailablePort = async (startPort) => {
  let port = startPort;
  while (port < startPort + 10) { // Try up to 10 ports
    try {
      await new Promise((resolve, reject) => {
        const server = app.listen(port)
          .once('listening', () => {
            server.close();
            resolve();
          })
          .once('error', (err) => {
            if (err.code === 'EADDRINUSE') {
              reject(new Error('Port in use'));
            } else {
              reject(err);
            }
          });
      });
      return port;
    } catch (err) {
      port++;
    }
  }
  throw new Error('No available ports found');
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server with port finding
    findAvailablePort(PORT)
      .then(port => {
        app.listen(port, () => {
          console.log(`Server running on port ${port}`);
        });
      })
      .catch(err => {
        console.error('Failed to start server:', err);
        process.exit(1);
      });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
}); 