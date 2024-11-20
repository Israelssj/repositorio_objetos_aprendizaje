import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function NavbarVerificadorOA() {
  const navigate = useNavigate();
  const [contactDialogVisible, setContactDialogVisible] = useState(false);

  const items = [
    { label: "Aprobar Guiones", icon: "pi pi-check", command: () => navigate("/aprobar-guion") },
    { label: "Subir Objeto de Aprendizaje", icon: "pi pi-upload", command: () => navigate("/objetos-aprendizaje") },
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

      {/* Modal de contacto */}
      <Modal show={contactDialogVisible} onHide={() => setContactDialogVisible(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Contacto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Correo: verificador@example.com</p>
          <p>Teléfono: +52 987 654 3210</p>
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
