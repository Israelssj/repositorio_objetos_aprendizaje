import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import RolCrud from "./RolCrud";
import UsuarioCrud from "./UsuarioCrud";
import DescargaCrud from "./DescargaCrud";
import ObjetoAprendizajeCrud from "./ObjetoAprendizajeCrud";
import GuionForm from "./GuionForm";
import Login from "./Login";
import "bootstrap/dist/css/bootstrap.min.css"; 
import "bootstrap/dist/js/bootstrap.bundle.min.js"; 
import Register from "./Register";
import Home from "./Home";
import AprobarGuion from "./AprobarGuion";
import NoAutorizado from "./NoAutorizado";
import EditarGuion from "./EditarGuion";
import NavbarAdministrador from "./NavbarAdministrador";
import NavbarMaestro from "./NavbarMaestro";
import NavbarVerificadorOA from "./NavbarVerificadorOA";
import GuionStatus from "./EstadoGuion";
import DescargaAdministrador from "./DescargaAdministrador";
import { useAuth } from "./AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Css/App.css";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { auth, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;

  return auth.isAuthenticated && allowedRoles.includes(auth.user?.rol)
    ? children
    : <Navigate to="/no-autorizado" />;
};

function App() {
  const { auth, logout, loading } = useAuth();
  const [showHelpModal, setShowHelpModal] = useState(false);

  const renderNavbar = () => {
    if (loading) return null;

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
  <div className="container-fluid">
    {/* Marca o logo */}
    <NavLink className="navbar-brand" to="/">
      <i className="pi pi-home"></i> Inicio
    </NavLink>


    <button
      className="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>

 
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav me-auto">
        {!auth.isAuthenticated && (
          <>
            <li className="nav-item">
              <NavLink className="nav-link" to="/login">
                Iniciar Sesión
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/register">
                Registrarse
              </NavLink>
            </li>
          </>
        )}
        {auth.isAuthenticated && (
          <>
            {auth.user.rol === "ADMINISTRADOR" && <NavbarAdministrador logout={logout} />}
            {auth.user.rol === "MAESTRO" && <NavbarMaestro logout={logout} />}
            {auth.user.rol === "VERIFICADOROA" && <NavbarVerificadorOA logout={logout} />}
          </>
        )}
      </ul>

      {/* Botones a la derecha */}
      <ul className="navbar-nav ms-auto">
        <li className="nav-item">
          <Button
            variant="outline-light"
            className="nav-link"
            onClick={() => setShowHelpModal(true)}
          >
            <i className="pi pi-info-circle"></i> Ayuda
          </Button>
        </li>
        {auth.isAuthenticated && (
          <li className="nav-item">
            <Button
              variant="outline-light"
              className="nav-link"
              onClick={logout}
            >
              <i className="pi pi-sign-out"></i> Cerrar Sesión
            </Button>
          </li>
        )}
      </ul>
    </div>
  </div>
</nav>

    );
  };

  return (
    <Router>
      <div>
        {renderNavbar()}

        
        <Modal show={showHelpModal} onHide={() => setShowHelpModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Ayuda</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>¿Cómo utilizar la plataforma?</h5>
            <p>
              Navega a través de las diferentes secciones según tu rol para crear, aprobar o
              descargar objetos de aprendizaje. Si necesitas más información, contáctanos a
              soporte@example.com.
            </p>
            <h5>Roles y Accesos</h5>
            <ul>
              <li><b>Administrador:</b> Puede gestionar usuarios, roles y descargas.</li>
              <li><b>Maestro:</b> Puede crear y descargar objetos de aprendizaje.</li>
              <li><b>Verificador OA:</b> Puede aprobar guiones y subir objetos de aprendizaje.</li>
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowHelpModal(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rutas protegidas */}
            <Route path="/roles" element={<PrivateRoute allowedRoles={['ADMINISTRADOR']}><RolCrud /></PrivateRoute>} />
            <Route path="/usuarios" element={<PrivateRoute allowedRoles={['ADMINISTRADOR']}><UsuarioCrud /></PrivateRoute>} />
            <Route path="/descargas-admin" element={<PrivateRoute allowedRoles={['ADMINISTRADOR']}><DescargaAdministrador /></PrivateRoute>} />
            <Route path="/descargas" element={<PrivateRoute allowedRoles={['ADMINISTRADOR', 'MAESTRO']}><DescargaCrud /></PrivateRoute>} />
            <Route path="/objetos-aprendizaje" element={<PrivateRoute allowedRoles={['ADMINISTRADOR', 'VERIFICADOROA']}><ObjetoAprendizajeCrud /></PrivateRoute>} />
            <Route path="/guiones" element={<PrivateRoute allowedRoles={['MAESTRO', 'ADMINISTRADOR']}><GuionForm /></PrivateRoute>} />
            <Route path="/editar-guion/:id" element={<PrivateRoute allowedRoles={['MAESTRO', 'ADMINISTRADOR']}><EditarGuion /></PrivateRoute>} />
            <Route path="/aprobar-guion" element={<PrivateRoute allowedRoles={['VERIFICADOROA', 'ADMINISTRADOR']}><AprobarGuion /></PrivateRoute>} />
            <Route path="/guion-status" element={<PrivateRoute allowedRoles={['ADMINISTRADOR', 'MAESTRO']}><GuionStatus /></PrivateRoute>} />


            <Route path="/no-autorizado" element={<NoAutorizado />} />
            <Route path="*" element={<h2>Página no encontrada</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
