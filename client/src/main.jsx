import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Login from './components/Login.jsx'
import Chats from './pages/Chats.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import PublicRoute from './routes/PublicRoute.jsx'
import Profile from './pages/Profile.jsx'

import { registerSW } from 'virtual:pwa-register'
import { ChatsProvider } from './context/chatsContext.jsx'
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// // Set GSAP defaults for smooth scrolling
// gsap.defaults({
//     ease: "power2.inOut"
// });

// This actually activates the service worker.
// { immediate: true } means: register it as soon as the app loads
registerSW({ immediate: true })

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
                <ChatsProvider>
                    <Chats />
                </ChatsProvider>
            </ProtectedRoute>
    },

    {
        path: "/chat/:chatId",
        element:
            <ProtectedRoute>
                <ChatsProvider>
                    <Chats />
                </ChatsProvider>
            </ProtectedRoute>
    },
])



createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <RouterProvider router={routers} />
    </AuthProvider>
)
