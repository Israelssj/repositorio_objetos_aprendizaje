import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function NavbarAdministrador() {
  const navigate = useNavigate();
  const [contactDialogVisible, setContactDialogVisible] = useState(false);

  const sections = [
    {
      title: "Gestión",
      items: [
        { label: "Gestión de Roles", icon: "pi pi-users", command: () => navigate("/roles") },
        { label: "Gestión de Usuarios", icon: "pi pi-user-edit", command: () => navigate("/usuarios") },
      ],
    },
    {
      title: "Descargas",
      items: [
        { label: "Descargas", icon: "pi pi-cloud-download", command: () => navigate("/descargas") },
        {
          label: "Gestión Administrativa de Descargas",
          icon: "pi pi-cog",
          command: () => navigate("/descargas-admin"),
        },
      ],
    },
    {
      title: "Proyectos",
      items: [
        { label: "Subir Objeto de Aprendizaje", icon: "pi pi-upload", command: () => navigate("/objetos-aprendizaje") },
        { label: "Gestión de Guiones", icon: "pi pi-file", command: () => navigate("/guiones") },
        { label: "Aprobar Guiones", icon: "pi pi-check-circle", command: () => navigate("/aprobar-guion") },
        {
          label: "Gestión de Estado de Guiones",
          icon: "pi pi-info-circle",
          command: () => navigate("/guion-status"),
        },
      ],
    },
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
            
            {/* Secciones con menús desplegables */}
            {sections.map((section, sectionIndex) => (
              <li className="nav-item dropdown text-center" key={sectionIndex}>
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id={`dropdown${sectionIndex}`}
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {section.title}
                </a>
                <ul className="dropdown-menu text-center" aria-labelledby={`dropdown${sectionIndex}`}>
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={() => item.command()}
                      >
                        <i className={item.icon}></i> {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          {/* Contacto */}
          <ul className="navbar-nav">
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
          <p>Correo: admin@gmail.com</p>
          <p>Teléfono: 231</p>
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
