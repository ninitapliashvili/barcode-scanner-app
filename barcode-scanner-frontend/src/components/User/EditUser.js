import React, { useState, useEffect, useContext } from 'react';
import './AddUser.css'; // Use appropriate CSS file
import api from '../../api';
import AuthContext from '../Auth/AuthContext';

const EditUser = ({ userData, closeModal }) => {
  const { authData } = useContext(AuthContext);
  const [editUserData, setEditUserData] = useState({
    username: '',
    password: '',
    organization_id: '',
    role_name: '',
    ip_address: '',
    warehouse_ids: [], // Ensure this is always an array
  });

  const [organizations, setOrganizations] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (authData?.role === 'system_admin') {
        const orgRes = await api.get('/organizations');
        setOrganizations(orgRes.data);
      } else if (authData?.role === 'admin') {
        const whRes = await api.get('/warehouses');
        setWarehouses(whRes.data);
        setIsAdmin(true);
      }
  
      // Initialize form with existing user data
      setEditUserData({
        ...userData,
        warehouse_ids: userData.warehouse_ids || [] // Ensure this is always an array
      });
    };
  
    fetchData();
  }, [authData, userData]);

  const handleInputChange = (e) => {
    setEditUserData({ ...editUserData, [e.target.name]: e.target.value });
  };

  const handleWarehouseChange = (e) => {
    const warehouseId = e.target.value;
    const newWarehouseIds = editUserData.warehouse_ids.includes(warehouseId)
      ? editUserData.warehouse_ids.filter(id => id !== warehouseId)
      : [...editUserData.warehouse_ids, warehouseId];
    setEditUserData({ ...editUserData, warehouse_ids: newWarehouseIds });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${editUserData.id}`, editUserData);
      alert('User updated successfully!');
      closeModal();
    } catch (error) {
      console.error('Error updating user:', error.response?.data?.error || error.message);
      alert('Failed to update user: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="modal active">
      <div className="modal-content">
        <span className="close-btn" onClick={closeModal}>&times;</span>
        <h2>Edit User</h2>
        <form id="editUserForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={editUserData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password (Leave blank to keep unchanged):</label>
            <input
              type="password"
              id="password"
              name="password"
              value={editUserData.password}
              onChange={handleInputChange}
            />
          </div>
          {!isAdmin && (
            <div className="form-group">
              <label htmlFor="organization">Organization:</label>
              <select
                id="organization"
                name="organization_id"
                value={editUserData.organization_id}
                onChange={handleInputChange}
                required={authData?.role === 'system_admin'}
              >
                <option value="">Select an organization</option>
                {organizations.map(org => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
            </div>
          )}
          <div className="form-group">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              name="role_name"
              value={editUserData.role_name}
              onChange={handleInputChange}
              required
            >
              <option value={isAdmin ? 'user' : 'admin'}>{isAdmin ? 'user' : 'admin'}</option>
              {!isAdmin && <option value="system_admin">System Admin</option>}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="ipAddress">IP Address:</label>
            <input
              type="text"
              id="ipAddress"
              name="ip_address"
              value={editUserData.ip_address}
              onChange={handleInputChange}
              required
            />
          </div>
          {isAdmin && (
            <div className="form-group">
              <label htmlFor="warehouses">Warehouses:</label>
              <div id="warehouse-container">
                {warehouses.map(wh => (
                  <div key={wh.id}>
                    <input
                      type="checkbox"
                      id={`warehouse${wh.id}`}
                      name="warehouses"
                      value={wh.id}
                      checked={editUserData.warehouse_ids.includes(wh.id)}
                      onChange={handleWarehouseChange}
                    />
                    <label htmlFor={`warehouse${wh.id}`}>{wh.name}</label>
                  </div>
                ))}
              </div>
            </div>
          )}
          <button type="submit" className="edit-btn">Update User</button>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
