
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../sass/components/Profile.scss';

const Profile = () => {
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        middle_initial: '',
        phone: '',
        birthdate: '',
        profile_picture: null,
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Fetch profile data on component mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/api/profile', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Updated to match your auth token key
                    },
                });
                setProfile(response.data.data);
                if (response.data.data.profile_picture) {
                    setPreviewImage(`/storage/${response.data.data.profile_picture}`);
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to load profile.');
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    // Handle file input for profile picture
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfile({ ...profile, profile_picture: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const formData = new FormData();
        formData.append('username', profile.username);
        formData.append('email', profile.email);
        formData.append('first_name', profile.first_name);
        formData.append('last_name', profile.last_name);
        formData.append('middle_initial', profile.middle_initial || '');
        formData.append('phone', profile.phone || '');
        formData.append('birthdate', profile.birthdate || '');
        if (profile.profile_picture instanceof File) {
            formData.append('profile_picture', profile.profile_picture);
        }

        try {
            const response = await axios.put('/api/profile', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSuccess('Profile updated successfully!');
            setProfile(response.data.data);
            if (response.data.data.profile_picture) {
                setPreviewImage(`/storage/${response.data.data.profile_picture}`);
            }
        } catch (err) {
            setError('Failed to update profile.');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="profile-container">
            <h2>My Profile</h2>
            <p>Manage and protect your account</p>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-left">
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={profile.username}
                            onChange={handleChange}
                            required
                        />
                        <small>Username can only be changed once.</small>
                    </div>

                    <div className="form-group">
                        <label>Name</label>
                        <div className="name-group">
                            <input
                                type="text"
                                name="first_name"
                                placeholder="First Name"
                                value={profile.first_name}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="middle_initial"
                                placeholder="M.I."
                                value={profile.middle_initial || ''}
                                onChange={handleChange}
                                maxLength="1"
                            />
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Last Name"
                                value={profile.last_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={profile.email}
                            onChange={handleChange}
                            required
                        />
                        <button type="button" className="change-btn">Change</button>
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            value={profile.phone || ''}
                            onChange={handleChange}
                        />
                        <button type="button" className="change-btn">Change</button>
                    </div>

                    <div className="form-group">
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            name="birthdate"
                            value={profile.birthdate || ''}
                            onChange={handleChange}
                        />
                        <button type="button" className="change-btn">Change</button>
                    </div>
                </div>

                <div className="form-right">
                    <div className="profile-picture">
                        {previewImage ? (
                            <img src={previewImage} alt="Profile" />
                        ) : (
                            <div className="placeholder">No Image</div>
                        )}
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
                        <small>File extension: .JPEG, .PNG</small>
                    </div>
                </div>

                <button type="submit" className="save-btn">Save</button>
            </form>
        </div>
    );
};

export default Profile;