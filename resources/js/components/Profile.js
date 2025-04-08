import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../../sass/components/Profile.scss';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("You are not logged in. Please log in first.");
      return;
    }

    axios
      .get("http://localhost:8000/api/profile", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        if (response.data.success) {
          setProfile(response.data.data);
          setFormData(response.data.data);
        } else {
          setError("Profile not found.");
        }
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          setError("Unauthorized. Please log in again.");
        } else {
          setError("Failed to load profile.");
        }
        console.error("Error fetching profile:", err);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put("http://localhost:8000/api/profile", formData, {
        headers: {
          Authorization: token,
        },
      });
      if (response.data.success) {
        setProfile(response.data.data);
        setEditMode(false);
        setError("");
      }
    } catch (err) {
      setError("Failed to update profile.");
      console.error("Update error:", err);
    }
  };

  if (!profile) {
    return (
      <div className="profile-container">
        <h2>My Profile</h2>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>My Profile</h2>

      <div className="profile-card">
        <img
          className="profile-image"
          src={
            formData.profile_picture?.trim()
              ? formData.profile_picture
              : "/default-avatar.png"
          }
          alt="Profile"
        />

        <div className="profile-fields">
          <div>
            <label>Username</label>
            <input type="text" name="username" value={formData.username || ''} onChange={handleChange} readOnly={!editMode} />
          </div>
          <div>
            <label>Email</label>
            <input type="email" name="email" value={formData.email || ''} onChange={handleChange} readOnly={!editMode} />
          </div>
          <div>
            <label>First Name</label>
            <input type="text" name="first_name" value={formData.first_name || ''} onChange={handleChange} readOnly={!editMode} />
          </div>
          <div>
            <label>Last Name</label>
            <input type="text" name="last_name" value={formData.last_name || ''} onChange={handleChange} readOnly={!editMode} />
          </div>
          <div>
            <label>Birthdate</label>
            <input type="date" name="birthdate" value={formData.birthdate || ''} onChange={handleChange} readOnly={!editMode} />
          </div>
          <div>
            <label>Phone Number</label>
            <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} readOnly={!editMode} />
          </div>
          <div>
            <label>Profile Picture URL</label>
            <input type="text" name="profile_picture" value={formData.profile_picture || ''} onChange={handleChange} readOnly={!editMode} />
          </div>

          {editMode && (
            <>
              <button className="toggle-password" onClick={() => setShowPasswordFields(!showPasswordFields)}>
                {showPasswordFields ? "Cancel Password Change" : "Change Password"}
              </button>

              {showPasswordFields && (
                <>
                  <div>
                    <label>New Password</label>
                    <input type="password" name="password" onChange={handleChange} />
                  </div>
                </>
              )}
              <button className="update-btn" onClick={handleUpdate}>Save Changes</button>
            </>
          )}
        </div>

        {!editMode ? (
          <button className="edit-btn" onClick={() => setEditMode(true)}>✏️ Edit Profile</button>
        ) : (
          <button className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
        )}

        <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Profile;
