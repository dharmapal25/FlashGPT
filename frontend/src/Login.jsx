import { GitBranchPlus } from 'lucide-react';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="loginContainer">
      <div className="loginBox">
        <div className="loginHeader">
          <h1>Welcome to AI Chat</h1>
          <p>Sign in to get started</p>
        </div>

        <button 
          className="googleLoginBtn"
          onClick={handleGoogleLogin}
        >
          <GitBranchPlus/>
          Sign in with Google
        </button>

        <p className="loginFooter">
          We only support Google login for now
        </p>
      </div>
    </div>
  );
};

export default Login;
