import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../sass/components/myaddress_modal.scss';

const MyAddressModal = ({ isOpen, onClose, address, onSave }) => {
  const [formData, setFormData] = useState({
    barangay: '',
    city: '',
    province: '',
    country: 'Philippines',
    is_default: false,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (address) {
      setFormData({
        barangay: address.barangay || '',
        city: address.city || '',
        province: address.province || '',
        country: 'Philippines',
        is_default: address.is_default || false,
      });
    }
  }, [address]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');

    try {
      let response;
      if (address) {
        // Update existing address
        response = await axios.put(
          `http://localhost:8000/api/addresses/${address.address_id}`,
          formData,
          {
            headers: { Authorization: token },
          }
        );
      } else {
        // Add new address
        response = await axios.post('http://localhost:8000/api/addresses', formData, {
          headers: { Authorization: token },
        });
      }

      if (response.data.success) {
        onSave(response.data.data);
        onClose();
      } else {
        setError(response.data.message || 'Failed to save address.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save address.');
    }
  };

  const provinces = [
    'Agusan del Norte',
    'Agusan del Sur',
    'Surigao del Norte',
  ];

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <h2>{address ? 'Edit Address' : 'Add New Address'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="modal-field">
            <label>Barangay</label>
            <input
              type="text"
              name="barangay"
              value={formData.barangay}
              onChange={handleChange}
              required
            />
          </div>
          <div className="modal-field">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="modal-field">
            <label>Province</label>
            <select
              name="province"
              value={formData.province}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Province</option>
              {provinces.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-field">
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              readOnly
              className="readonly-input"
            />
          </div>
          <div className="modal-checkbox-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_default"
                checked={formData.is_default}
                onChange={handleChange}
              />
              <span>Set as Default</span>
            </label>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="modal-save-btn">
            {address ? 'Update' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MyAddressModal;