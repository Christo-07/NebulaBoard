// src/router.jsx
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import AuthRoute from './components/AuthRoute';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Board from './pages/Board';
import Users from './pages/Users';
import Login from './pages/Login';
import Register from './pages/Register';

function AdminLayout() {
  return <div className="container"><Outlet /></div>;
}

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },

  {
    path: '/app',
    element: (
      <AuthRoute>
        <AdminLayout />
      </AuthRoute>
    ),
    children: [
      { path: 'projects', element: <Projects /> },          // USER or ADMIN
      { path: 'projects/:id', element: <Board /> },         // USER or ADMIN
      { path: 'users', element: (<AdminRoute><Users /></AdminRoute>) }, // ADMIN only
    ],
  },

  { path: '/', element: <Home /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
