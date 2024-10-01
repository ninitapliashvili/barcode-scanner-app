import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/Auth/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import Dashboard from './components/Dashboard/Dashboard';
import Organization from './components/Organization/OrganizationList';
import Warehouse from './components/Warehouse/WarehouseList';
import Login from './components/Auth/Login';
import Logout from './components/Auth/Logout';
import SystemAdminDashboard from './components/SystemAdminDashboard/SystemAdminDashboard';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          {/* Public Route for Login */}
          <Route path="/login" element={<Login />} />

          {/* Private Routes for authenticated users */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute allowedRoles={['admin', 'user']}>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/organizations" 
            element={
              <PrivateRoute allowedRoles={['admin', 'system_admin']}>
                <Organization />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/warehouses" 
            element={
              <PrivateRoute allowedRoles={['admin', 'system_admin']}>
                <Warehouse />
              </PrivateRoute>
            } 
          />

          {/* Private Route for Logout */}
          <Route 
            path="/logout" 
            element={
              <PrivateRoute allowedRoles={['admin', 'user', 'system_admin']}>
                <Logout />
              </PrivateRoute>
            } 
          />
          
          {/* System Admin Dashboard route */}
          <Route 
            path="/system-admin-dashboard" 
            element={
              <PrivateRoute allowedRoles={['system_admin']}>
                <SystemAdminDashboard />
              </PrivateRoute>
            } 
          />

          {/* Redirect to Login by default */}
          <Route path="/" element={<Login />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;
