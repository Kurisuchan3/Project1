import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../sass/components/myaddress.scss';
import Header from '../Header/header';
import SideMenuProfile from '../SideMenuProfile/sidemenuprofile';
import MyAddressModal from '../MyAddressModal/myaddress_modal';

const MyAddresses = () => {
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
  
    useEffect(() => {
      fetchAddresses();
    }, []);
  
    const fetchAddresses = async () => {
      const token = localStorage.getItem('authToken');
  
      if (!token) {
        setError('You are not logged in. Please log in first.');
        navigate('/login');
        return;
      }
  
      try {
        const response = await axios.get('http://localhost:8000/api/addresses', {
          headers: { Authorization: token },
        });
        if (response.data.success) {
          setAddresses(response.data.data);
        } else {
          setError('Failed to load addresses.');
        }
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Unauthorized. Please log in again.');
          navigate('/login');
        } else {
          setError('Failed to load addresses.');
        }
      }
    };
  
    const handleAddAddress = () => {
      setEditingAddress(null);
      setIsModalOpen(true);
    };
  
    const handleEditAddress = (address) => {
      setEditingAddress(address);
      setIsModalOpen(true);
    };
  
    const handleDeleteAddress = async (address_id) => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.delete(`http://localhost:8000/api/addresses/${address_id}`, {
          headers: { Authorization: token },
        });
        if (response.data.success) {
          setAddresses(addresses.filter((addr) => addr.address_id !== address_id));
        } else {
          setError('Failed to delete address.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete address.');
      }
    };
  
    const handleSetDefault = async (address_id) => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.post(
          `http://localhost:8000/api/addresses/${address_id}/set-default`,
          {},
          {
            headers: { Authorization: token },
          }
        );
        if (response.data.success) {
          setAddresses(
            addresses.map((addr) =>
              addr.address_id === address_id
                ? { ...addr, is_default: true }
                : { ...addr, is_default: false }
            )
          );
        } else {
          setError('Failed to set default address.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to set default address.');
      }
    };
  
    const handleSaveAddress = (newAddress) => {
      if (editingAddress) {
        setAddresses(
          addresses.map((addr) =>
            addr.address_id === newAddress.address_id ? newAddress : addr
          )
        );
      } else {
        setAddresses([...addresses, newAddress]);
      }
    };
  
    const formatUserName = (address) => {
      const parts = [
        address.first_name,
        address.middle_initial ? `${address.middle_initial}.` : null,
        address.last_name,
      ].filter(Boolean);
      return parts.length > 0 ? parts.join(' ') : address.username;
    };
  
    return (
      <div className="addresses-page">
        <Header />
        <div className="addresses-layout">
          <SideMenuProfile />
          <div className="addresses-content">
            <div className="addresses-container">
              <div className="addresses-header">
                <h2>My Addresses</h2>
                <button className="add-address-btn" onClick={handleAddAddress}>
                  Add New Address
                </button>
              </div>
              <h3>Addresses</h3>
              {addresses.length === 0 ? (
                <p>No addresses found.</p>
              ) : (
                addresses.map((address) => (
                  <div key={address.address_id} className="address-item">
                    <div className="address-details">
                      <p>
                        <strong>{formatUserName(address)}</strong>
                      </p>
                      <p>
                        {address.barangay}, {address.city}, {address.province},{' '}
                        {address.country}
                      </p>
                      {address.is_default && <span className="default-label">Default</span>}
                    </div>
                    <div className="address-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEditAddress(address)}
                      >
                        Edit
                      </button>
                      {!address.is_default && (
                        <>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteAddress(address.address_id)}
                          >
                            Delete
                          </button>
                          <button
                            className="set-default-btn"
                            onClick={() => handleSetDefault(address.address_id)}
                          >
                            Set as default
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
              {error && <p className="error-message">{error}</p>}
            </div>
          </div>
        </div>
        <MyAddressModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          address={editingAddress}
          onSave={handleSaveAddress}
        />
      </div>
    );
  };
  
  export default MyAddresses;