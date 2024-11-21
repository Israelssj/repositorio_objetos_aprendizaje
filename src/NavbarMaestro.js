import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function NavbarMaestro() {
  const navigate = useNavigate();
  const [contactDialogVisible, setContactDialogVisible] = useState(false);

  const items = [
    { label: "Crear Guion", icon: "pi pi-pencil", command: () => navigate("/guiones") },
    { label: "Descargar OA", icon: "pi pi-cloud-download", command: () => navigate("/descargas") },
    { label: "Estados de tus Guiones", icon: "pi pi-check-square", command: () => navigate("/guion-status") },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid justify-content-center">
        {/* Botón hamburguesa */}
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

        {/* Opciones del menú */}
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav">
            {items.map((item, index) => (
              <li className="nav-item text-center" key={index}>
                <a
                  className="nav-link"
                  href="#"
                  onClick={() => item.command()}
                >
                  <i className={item.icon}></i> {item.label}
                </a>
              </li>
            ))}
            {/* Contacto */}
            <li className="nav-item text-center">
              <a
                className="nav-link"
                href="#"
                onClick={() => setContactDialogVisible(true)}
              >
                <i className="pi pi-envelope"></i> Contacto
              </a>
            </li>
          </ul>
        </div>
      </div>

    
      <Modal show={contactDialogVisible} onHide={() => setContactDialogVisible(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Contacto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Correo: maestro@example.com</p>
          <p>Teléfono: +52 123 456 7890</p>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => setContactDialogVisible(false)}>
            Cerrar
          </button>
        </Modal.Footer>
      </Modal>
    </nav>
  );
}
