import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import App from './App';
import Login from './Login';
import api from './api';

const AuthGuard = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // verify session by hitting profile
        const res = await api.get('/auth/profile');
        if (res.data?.user) {
          if (mounted) navigate('/chat/new', { replace: true });
          return;
        }
      } catch (err) {
        // refresh failed
      }
      if (mounted) navigate('/login', { replace: true });
    })().finally(() => { if (mounted) setChecking(false); });
    return () => { mounted = false; };
  }, [navigate]);

  return checking ? null : null;
};

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AuthGuard />} />
        <Route path="/chat" element={<App />} />
        <Route path="/chat/new" element={<App />} />
        <Route path="/chat/:id" element={<App />} />
        <Route path="/chat/:id/:action" element={<App />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
