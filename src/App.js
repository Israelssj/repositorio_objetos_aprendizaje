import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Button } from 'react-bootstrap'; 
import RolCrud from './RolCrud';
import UsuarioCrud from './UsuarioCrud';
import DescargaCrud from './DescargaCrud';
import ObjetoAprendizajeCrud from './ObjetoAprendizajeCrud';
import GuionForm from './GuionForm';  // Importar el formulario de guiones
import Login from './Login';
import Register from './Register';
import Home from './Home';
import { AuthProvider, useAuth } from './AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

// Componente para proteger rutas
const PrivateRoute = ({ children }) => {
  const { auth } = useAuth();
  return auth.isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const { auth, logout } = useAuth();

  return (
    <Router>
      <div className="container mt-4">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <NavLink className="navbar-brand" to="/">
            <i className="pi pi-home" style={{ marginRight: '0.5rem' }}></i>
            Gestión de Aplicación
          </NavLink>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              {auth.isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <NavLink 
                      className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} 
                      to="/roles">
                      <i className="pi pi-users" style={{ marginRight: '0.5rem' }}></i>
                      Gestión de Roles
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink 
                      className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} 
                      to="/usuarios">
                      <i className="pi pi-user-edit" style={{ marginRight: '0.5rem' }}></i>
                      Gestión de Usuarios
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink 
                      className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} 
                      to="/descargas">
                      <i className="pi pi-download" style={{ marginRight: '0.5rem' }}></i>
                      Gestión de Descargas
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink 
                      className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} 
                      to="/objetos-aprendizaje">
                      <i className="pi pi-upload" style={{ marginRight: '0.5rem' }}></i>
                      Subir Objeto de Aprendizaje
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink 
                      className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} 
                      to="/guiones">
                      <i className="pi pi-file" style={{ marginRight: '0.5rem' }}></i>
                      Gestión de Guiones
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <Button className="nav-link btn btn-link" onClick={logout}>
                      <i className="pi pi-sign-out" style={{ marginRight: '0.5rem' }}></i>
                      Cerrar Sesión
                    </Button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink 
                      className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} 
                      to="/login">
                      <i className="pi pi-sign-in" style={{ marginRight: '0.5rem' }}></i>
                      Iniciar Sesión
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink 
                      className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} 
                      to="/register">
                      <i className="pi pi-user-plus" style={{ marginRight: '0.5rem' }}></i>
                      Registrarse
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Rutas protegidas */}
          <Route path="/roles" element={<PrivateRoute><RolCrud /></PrivateRoute>} />
          <Route path="/usuarios" element={<PrivateRoute><UsuarioCrud /></PrivateRoute>} />
          <Route path="/descargas" element={<PrivateRoute><DescargaCrud /></PrivateRoute>} />
          <Route path="/objetos-aprendizaje" element={<PrivateRoute><ObjetoAprendizajeCrud /></PrivateRoute>} />
          <Route path="/guiones" element={<PrivateRoute><GuionForm /></PrivateRoute>} />
          <Route path="*" element={<h2>Página no encontrada</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default function WrappedApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
