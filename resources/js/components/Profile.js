import React, { useState, useEffect } from 'react';
import { useNavigate }            from 'react-router-dom';
import axios                       from 'axios';
import '../../sass/components/Profile.scss';
import Header                      from '../components/Header/header';
import SideMenuProfile             from './SideMenuProfile/sidemenuprofile';

// ── NO baseURL here! We’ll call /api/… relatively ─────────────────────────────
axios.defaults.withCredentials = true;

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile]               = useState(null);
  const [editMode, setEditMode]             = useState(false);
  const [formData, setFormData]             = useState({});
  const [error, setError]                   = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [previewImage, setPreviewImage]     = useState(null);

  // ── Load the profile once on mount ──────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('You are not logged in. Please log in first.');
      return;
    }

    axios
      .get('/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(({ data }) => {
        if (data.success) {
          const d = data.data;
          setProfile(d);
          setFormData({
            username:       d.username || '',
            email:          d.email || '',
            first_name:     d.first_name || '',
            middle_initial: d.middle_initial || '',
            last_name:      d.last_name || '',
            birthdate:      d.birthdate || '',
            phone:          d.phone || '',
            profile_picture:d.profile_picture || null,
          });
          if (d.profile_picture) {
            setPreviewImage(`${window.location.origin}/storage/${d.profile_picture}`);
          }
        } else {
          setError('Profile not found.');
        }
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          setError('Unauthorized. Please log in again.');
        } else {
          setError('Failed to load profile.');
        }
        console.error('Error fetching profile:', err);
      });
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
    setValidationErrors(v => ({ ...v, [name]: '' }));
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      setFormData(f => ({ ...f, profile_picture: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.username)   errs.username   = 'Username is required.';
    if (!formData.email)      errs.email      = 'Email is required.';
    if (!formData.first_name) errs.first_name = 'First name is required.';
    if (!formData.last_name)  errs.last_name  = 'Last name is required.';
    return errs;
  };

  // ── Submit updates ──────────────────────────────────────────────────────────
  const handleUpdate = async () => {
    const errs = validateForm();
    if (Object.keys(errs).length) {
      setValidationErrors(errs);
      setError('Please fill in all required fields.');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const data  = new FormData();

      data.append('_method', 'PUT');               // ← override to PUT
      data.append('username',       formData.username);
      data.append('email',          formData.email);
      data.append('first_name',     formData.first_name);
      data.append('middle_initial', formData.middle_initial || '');
      data.append('last_name',      formData.last_name);
      data.append('birthdate',      formData.birthdate);
      data.append('phone',          formData.phone);
      if (formData.profile_picture instanceof File) {
        data.append('profile_picture', formData.profile_picture);
      }
      if (formData.password) {
        data.append('password', formData.password);
      }

      const res = await axios.post(
        '/api/profile',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      if (res.data.success) {
        const d = res.data.data;
        setProfile(d);
        setFormData({
          username:       d.username,
          email:          d.email,
          first_name:     d.first_name,
          middle_initial: d.middle_initial,
          last_name:      d.last_name,
          birthdate:      d.birthdate,
          phone:          d.phone,
          profile_picture: null,                  // clear old File
        });
        setPreviewImage(
          d.profile_picture
            ? `${window.location.origin}/storage/${d.profile_picture}`
            : '/default-avatar.png'
        );
        setEditMode(false);
        setError('');
        setValidationErrors({});
      }
    } catch (err) {
      if (err.response?.status === 422) {
        setValidationErrors(err.response.data.errors);
        setError('Please fix the errors in the form.');
      } else {
        setError('Failed to update profile.');
      }
      console.error('Update error:', err);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
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
                {previewImage
                  ? <img className="profile-image" src={previewImage} alt="Profile" />
                  : <img className="profile-image" src="/default-avatar.png" alt="Profile" />
                }
                {editMode && (
                  <>
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
                    <small>Max size: 1 MB • JPEG, PNG</small>
                  </>
                )}
              </div>

              <div className="profile-fields">
                {/* … your form fields … */}
              </div>

              {editMode ? (
                <>
                  <button
                    className="toggle-password"
                    onClick={() => setShowPasswordFields(!showPasswordFields)}
                  >
                    {showPasswordFields ? 'Cancel Password Change' : 'Change Password'}
                  </button>
                  {showPasswordFields && (
                    <div>
                      <label>New Password</label>
                      <input type="password" name="password" onChange={handleChange} />
                    </div>
                  )}
                  <button className="update-btn" onClick={handleUpdate}>
                    Save Changes
                  </button>
                  <button className="cancel-btn" onClick={() => setEditMode(false)}>
                    Cancel
                  </button>
                </>
              ) : (
                <button className="edit-btn" onClick={() => setEditMode(true)}>
                  ✏️ Edit Profile
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
