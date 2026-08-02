import React from 'react';
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import '../App.css'; 

const Login = () => {
    const navigate = useNavigate();

    const LoginGoogle = () => {
        // Redirect to Backend Google Auth URL
        window.location.href = "http://localhost:5000/api/auth/google";
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">Welcome Back</h1>
                <p className="login-subtitle">Please sign in to continue</p>

                <button className="google-btn" onClick={LoginGoogle}>
                    <FcGoogle className="google-icon" />
                    <span>Login with Google</span>
                </button>
            </div>
        </div>
    );
};

export default Login;