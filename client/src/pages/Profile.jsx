import React, { useEffect, useState } from 'react';
import API from '../services/api';
import '../style/Profile.css';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [Loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    let navigate = useNavigate()

    async function fetcUserInfo() {
        try {
            setLoading(true);
            const { data } = await API.get("/auth/profile", { withCredentials: true });

            setUser(data);
            console.log(data);

        } catch (error) {
            console.log("error : ", error);
        } finally {
            setLoading(false);
        }
    }

    async function HandleLogout() {
        try {
            setLoading(true);
            await API.get("/auth/logout", { withCredentials: true });

            navigate("/login")

        } catch (error) {
            console.log("error : ", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetcUserInfo();
    }, []);

    // Total Chats Array / 2 Calculation
    const totalChatsCount = user?.TotalChats ? Math.floor(user.TotalChats.length) : 0;
    const userData = user?.user;

    localStorage.setItem("image",userData?.profilePicture)

    return (
        <div className="profile-wrapper">
            {Loading ? (
                <div className="loading-container">
                    <h2>Loading Profile...</h2>
                </div>
            ) : (
                <div className="profile-card">
                    {/* Top Banner */}
                    <div className="profile-banner">
                        <div className="new-demo">

                            <button className="back-home-btn" onClick={() => window.history.back()}>
                                ← Back to home
                            </button>
                        </div>
                    </div>

                    {/* Profile Header & Info */}
                    <div className="profile-body">
                        <div className="avatar-wrapper">
                            <img
                                src={userData?.profilePicture || "https://via.placeholder.com/100"}
                                alt="User Avatar"
                                className="profile-avatar"
                            />
                        </div>

                        <div className="user-primary-info">
                            <div className="name-email-container">
                                <h2 className="user-display-name">
                                    {userData?.displayName}
                                </h2>
                                <p className="user-email-text">
                                    {userData?.email}
                                </p>
                            </div>

                            <button
                                className="logout-btn-ui"
                                onClick={HandleLogout}
                            >
                                Logout
                            </button>
                        </div>

                        {/* Stats & Account Info Section */}
                        <div className="stats-row">
                            <div className="info-box">
                                <span className="info-label">Account type</span>
                                <span className="info-value">User</span>
                            </div>

                            <div className="info-box total-chats-box">
                                <span className="info-label">Total Chats</span>
                                <span className="info-value-highlight">{totalChatsCount}</span>
                            </div>
                        </div>

                        {/* Your Memory Section */}
                        <div className="memory-section">
                            <h3 className="memory-title">Your memory</h3>
                            <div className="memory-content-box">
                                <p className="memory-placeholder">

                                    {null}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;