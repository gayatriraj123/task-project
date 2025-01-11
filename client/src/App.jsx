import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/Admin/Dashboard';
import CustomerHome from './pages/Customer/Home';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from './context/CartContext';
import ProductList from './components/Customer/ProductList';
import Cart from './components/Customer/Cart';
import OrderHistory from './components/Customer/OrderHistory';
import Checkout from './components/Customer/Checkout';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/register" replace />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer/home"
                element={
                  <ProtectedRoute requiredRole="customer">
                    <CustomerHome />
                  </ProtectedRoute>
                }
              />
              <Route path="/customer" element={<CustomerHome />}>
                <Route index element={<ProductList />} />
                <Route path="products" element={<ProductList />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="orders" element={<OrderHistory />} />
              </Route>
            </Routes>
            <ToastContainer position="top-right" />
          </AuthProvider>
        </Router>
      </CartProvider>
    </QueryClientProvider>
  );
};

export default App; 