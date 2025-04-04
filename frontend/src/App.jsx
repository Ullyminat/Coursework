import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import CabinetSchema from './components/CabinetSchema';
import ProtectedRoute from './components/ProtectedRoute';
import useAuthStore from './store/authStore';
import { useEffect } from 'react';
import Home from './pages/Home';
import { Navigate } from 'react-router-dom';
import Gendocx from './pages/Gendocx';
import Profile from './pages/Profile';
import AdminRoute from './components/AdminRoute';
import AdminPanel from './pages/AdminPanel';
import AdminPanelCabinet from './pages/AdminPanelCabinet';
import AdminPanelSpec from './pages/AdminPanelSpec';
import AdminPanelUMK from './pages/AdminPanelUMK';

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  return (
    <Router>
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/login" element={<Login />} />
        
        {/* Защищенные маршруты */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/editor" element={<CabinetSchema />} />
          <Route path="/gendocx" element={<Gendocx />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin/users" element={<AdminPanel />} />
          <Route path="/admin/cabinets" element={<AdminPanelCabinet />} />
          <Route path="/admin/specs" element={<AdminPanelSpec />} />
          <Route path="/admin/umks" element={<AdminPanelUMK />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;