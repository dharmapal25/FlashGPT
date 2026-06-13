import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '../context/AppContext';
import LoginPage    from '../pages/LoginPage';
import ChatPage     from '../pages/ChatPage';
import SettingsPage from '../pages/SettingsPage';

const Router = () => (
  <BrowserRouter>
    {/* AppProvider wraps everything — user/theme sirf ek baar load hoga */}
    <AppProvider>
      <Routes>
        <Route path="/login"            element={<LoginPage />} />
        <Route path="/settings"         element={<SettingsPage />} />   {/* ✅ Fixed */}
        <Route path="/chat/new"         element={<ChatPage />} />
        <Route path="/chat/:id"         element={<ChatPage />} />
        <Route path="/chat/:id/:action" element={<ChatPage />} />
        <Route path="/chat"             element={<ChatPage />} />
        <Route path="/"                 element={<Navigate to="/chat/new" replace />} />
        <Route path="*"                 element={<Navigate to="/chat/new" replace />} />
      </Routes>
    </AppProvider>
  </BrowserRouter>
);

export default Router;