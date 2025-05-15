import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../../sass/components/Profile.scss';
import Header from './Header/header';
import SideMenuProfile from './SideMenuProfile/sidemenuprofile';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("You are not logged in. Please log in first.");
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get("http://localhost:8000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        console.log("Fetched profile data:", response.data.data);
        setProfile(response.data.data);
        setFormData({
          username: response.data.data.username || '',
          email: response.data.data.email || '',
          first_name: response.data.data.first_name || '',
          middle_initial: response.data.data.middle_initial || '',
          last_name: response.data.data.last_name || '',
          birthdate: response.data.data.birthdate || '',
          phone: response.data.data.phone || '',
          profile_picture: response.data.data.profile_picture || null,
        });
        if (response.data.data.profile_picture) {
          setPreviewImage(`http://localhost:8000/${response.data.data.profile_picture}`);
        }
      } else {
        setError("Profile not found.");
      }
    } catch (err) {
      console.error("Error fetching profile:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        setError("Unauthorized. Please log in again.");
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        navigate('/login');
      } else {
        setError("Failed to load profile.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file:", file);
      setFormData((prev) => ({ ...prev, profile_picture: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.username) errors.username = "Username is required.";
    if (!formData.email) errors.email = "Email is required.";
    return errors;
  };

  const handleUpdate = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const data = new FormData();
      data.append('_method', 'PUT');
      data.append('username', formData.username || '');
      data.append('email', formData.email || '');
      data.append('first_name', formData.first_name || '');
      data.append('middle_initial', formData.middle_initial || '');
      data.append('last_name', formData.last_name || '');
      data.append('birthdate', formData.birthdate || '');
      data.append('phone', formData.phone || '');
      if (formData.profile_picture instanceof File) {
        console.log("Appending profile_picture to FormData:", formData.profile_picture);
        data.append('profile_picture', formData.profile_picture);
      }
      if (formData.password) {
        data.append('password', formData.password);
      }

      console.log("FormData before sending:", Object.fromEntries(data));

      const response = await axios.post("http://localhost:8000/api/profile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        console.log("Profile update response:", response.data);
        setProfile(response.data.data);
        setFormData({ ...response.data.data, profile_picture: null, password: '' });
        if (response.data.data.profile_picture) {
          setPreviewImage(`http://localhost:8000/${response.data.data.profile_picture}`);
        }
        setEditMode(false);
        setError("");
        setValidationErrors({});
        setShowPasswordFields(false);
        await fetchProfile();
      } else {
        setError(response.data.message || "Failed to update profile.");
      }
    } catch (err) {
      if (err.response?.status === 422) {
        setValidationErrors(err.response.data.errors || {});
        setError("Please fix the errors in the form.");
      } else {
        setError(err.response?.data?.message || "Failed to update profile.");
      }
      console.error("Update error:", err.response?.data || err);
    }
  };

  if (!profile) {
    return (
      <div className="profile-page">
        <Header />
        <div className="profile-container">
          <h2>My Profile</h2>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Header />
      <div className="profile-layout">
        <SideMenuProfile />
        <div className="profile-content">
          <div className="profile-container">
            <h2>My Profile</h2>
            <div className="profile-card">
              <div className="profile-picture-section">
                {previewImage ? (
                  <img className="profile-image" src={previewImage} alt="Profile" />
                ) : (
                  <img className="profile-image" src="/default-avatar.png" alt="Profile" />
                )}
                {editMode && (
                  <div>
                    <input
                      type="file"
                      id="profile_picture"
                      accept="image/jpeg,image/png"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="profile_picture" className="select-image-btn">
                      Select Image
                    </label>
                    <small>File size: maximum 1 MB</small>
                    <br />
                    <small>File extension: .JPEG, .PNG</small>
                  </div>
                )}
              </div>

              <div className="profile-fields">
                <div>
                  <label>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username || ''}
                    onChange={handleChange}
                    readOnly={!editMode}
                  />
                  {validationErrors.username && (
                    <span className="error-message">{validationErrors.username}</span>
                  )}
                </div>
                <div>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    readOnly={!editMode}
                  />
                  {validationErrors.email && (
                    <span className="error-message">{validationErrors.email}</span>
                  )}
                </div>
                <div>
                  <label>First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name || ''}
                    onChange={handleChange}
                    readOnly={!editMode}
                  />
                  {validationErrors.first_name && (
                    <span className="error-message">{validationErrors.first_name}</span>
                  )}
                </div>
                <div>
                  <label>Middle Initial</label>
                  <input
                    type="text"
                    name="middle_initial"
                    value={formData.middle_initial || ''}
                    onChange={handleChange}
                    readOnly={!editMode}
                    maxLength="1"
                  />
                </div>
                <div>
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name || ''}
                    onChange={handleChange}
                    readOnly={!editMode}
                  />
                  {validationErrors.last_name && (
                    <span className="error-message">{validationErrors.last_name}</span>
                  )}
                </div>
                <div>
                  <label>Birthdate</label>
                  <input
                    type="date"
                    name="birthdate"
                    value={formData.birthdate || ''}
                    onChange={handleChange}
                    readOnly={!editMode}
                  />
                </div>
                <div>
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    readOnly={!editMode}
                  />
                </div>

                {editMode && (
                  <>
                    <button
                      className="toggle-password"
                      onClick={() => setShowPasswordFields(!showPasswordFields)}
                    >
                      {showPasswordFields ? "Cancel Password Change" : "Change Password"}
                    </button>

                    {showPasswordFields && (
                      <>
                        <div>
                          <label>New Password</label>
                          <input
                            type="password"
                            name="password"
                            value={formData.password || ''}
                            onChange={handleChange}
                          />
                        </div>
                      </>
                    )}
                    <button className="update-btn" onClick={handleUpdate}>
                      Save Changes
                    </button>
                  </>
                )}
              </div>

              {!editMode ? (
                <button className="edit-btn" onClick={() => setEditMode(true)}>
                  ✏️ Edit Profile
                </button>
              ) : (
                <button className="cancel-btn" onClick={() => { setEditMode(false); fetchProfile(); }}>
                  Cancel
                </button>
              )}

              <button className="logout-btn" onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>

            {error && <p className="error-message">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;