import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Login from './components/Login.jsx'
import Chats from './pages/Chats.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import PublicRoute from './routes/PublicRoute.jsx'
import Profile from './pages/Profile.jsx'


const routers = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/login" />
    },

    {
        path: "/login",
        element:
            <PublicRoute>
                <Login />
            </PublicRoute>
    },

    {
        path: "/profile",
        element:
            <ProtectedRoute>
                <Profile />
            </ProtectedRoute>
    },

    {
        path: "/chat",
        element:
            <ProtectedRoute>
                <Chats />
            </ProtectedRoute>
    },

    {
        path: "/chat/:chatId",
        element:
            <ProtectedRoute>
                <Chats />
            </ProtectedRoute>
    },
])



createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <RouterProvider router={routers} />
    </AuthProvider>
)
