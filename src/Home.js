import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import { useAuth } from "./AuthContext"; // Contexto de autenticación
import { useNavigate } from "react-router-dom";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./Css/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const { auth } = useAuth(); // Contexto que almacena la autenticación
  const [showLearningDialog, setShowLearningDialog] = useState(false); // Para el diálogo de objeto de aprendizaje
  const [showRepositoryDialog, setShowRepositoryDialog] = useState(false); // Para el diálogo de repositorio
  const [showContactDialog, setShowContactDialog] = useState(false); // Para contacto (sólo para verificadores)

  // Función para verificar el rol del usuario
  const hasRole = (role) => auth?.user?.rol?.toUpperCase() === role.toUpperCase();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Bienvenido a la Plataforma de Gestión Educativa</h1>
          <p>
            {auth?.user
              ? "Accede, gestiona y crea recursos educativos de calidad desde un solo lugar."
              : "Explora nuestra plataforma para descubrir recursos educativos de calidad."}
          </p>
          {!auth?.user && ( 
            <Button
              label="Descubre mas"
              className="p-button-rounded p-button-primary"
              icon="pi pi-search"
              onClick={() => navigate("/login")}
            />
          )}
        </div>
        <div className="hero-image">
          <img src="/oa.png" alt="Educación Creativa" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">¿Qué puedes hacer aquí?</h2>
        <div className="features-grid">
          {/* Opciones para usuarios no logueados */}
          {!auth?.user && (
            <>
              <Card
                title="Explorar Recursos"
                subTitle="Descubre recursos educativos de calidad."
                className="feature-card"
                footer={
                  <Button
                    label="Explorar"
                    icon="pi pi-search"
                    className="p-button-primary"
                    onClick={() => navigate("/login")} 
                  />
                }
              >
                <p>Accede a nuestro repositorio digital para explorar lo que ofrecemos.</p>
              </Card>

              <Card
                title="Crear tu Cuenta"
                subTitle="Únete a nuestra comunidad educativa."
                className="feature-card"
                footer={
                  <Button
                    label="Crear Cuenta"
                    icon="pi pi-user-plus"
                    onClick={() => navigate("/register")}
                    className="p-button-primary"
                  />
                }
              >
                <p>
                  Regístrate y comienza a crear, gestionar y compartir objetos de aprendizaje.
                </p>
              </Card>
            </>
          )}

          {/* Opciones para usuarios logueados con rol MAESTRO o ADMINISTRADOR */}
          {(hasRole("MAESTRO") || hasRole("ADMINISTRADOR")) && (
            <>
              <Card
                title="Crear Objetos de Aprendizaje"
                subTitle="Personaliza tus recursos educativos."
                className="feature-card"
                footer={
                  <Button
                    label="Ir a Crear"
                    icon="pi pi-pencil"
                    onClick={() => navigate("/guiones")}
                  />
                }
              >
                <p>Diseña actividades interactivas y personalizadas para tus estudiantes.</p>
              </Card>

              <Card
                title="Explorar Repositorio"
                subTitle="Descubre recursos listos para usar."
                className="feature-card"
                footer={
                  <Button
                    label="Explorar"
                    icon="pi pi-search"
                    onClick={() => navigate("/descargas")}
                  />
                }
              >
                <p>Encuentra recursos educativos aprobados para enriquecer tus clases.</p>
              </Card>

              {hasRole("ADMINISTRADOR") && (
                <Card
                  title="Revisar Objetos"
                  subTitle="Asegura la calidad del contenido."
                  className="feature-card"
                  footer={
                    <Button
                      label="Revisar"
                      icon="pi pi-check-circle"
                      onClick={() => navigate("/review")}
                    />
                  }
                >
                  <p>Verifica los recursos creados por los usuarios antes de publicarlos.</p>
                </Card>
              )}
            </>
          )}

          {/* Opciones específicas para VERIFICADOROA */}
          {hasRole("VERIFICADOROA") && (
            <>
              <Card
                title="Aprobar Guiones"
                subTitle="Evalúa y aprueba los guiones enviados."
                className="feature-card"
                footer={
                  <Button
                    label="Aprobar"
                    icon="pi pi-check"
                    onClick={() => navigate("/aprobar-guion")}
                  />
                }
              >
                <p>Revisa los guiones propuestos para garantizar la calidad educativa.</p>
              </Card>

              <Card
                title="Subir Objeto de Aprendizaje"
                subTitle="Carga nuevos objetos al sistema."
                className="feature-card"
                footer={
                  <Button
                    label="Subir"
                    icon="pi pi-upload"
                    onClick={() => navigate("/objetos-aprendizaje")}
                  />
                }
              >
                <p>Comparte recursos educativos para que otros puedan utilizarlos.</p>
              </Card>

              <Card
                title="Contacto"
                subTitle="Consulta información para ayuda o soporte."
                className="feature-card"
                footer={
                  <Button
                    label="Contacto"
                    icon="pi pi-info-circle"
                    onClick={() => setShowContactDialog(true)}
                  />
                }
              >
                <p>Accede a los datos de contacto en caso de dudas o soporte técnico.</p>
              </Card>
            </>
          )}
        </div>
      </section>

      {/* Information Section for Non-Logged Users */}
      {!auth?.user && (
        <section className="info-section">
          <div className="info-grid">
            <div className="info-item">
              <h2>¿Qué es un Objeto de Aprendizaje?</h2>
              <p>
                Un recurso educativo diseñado para enseñar un tema específico. Aprende más aquí.
              </p>
              <Button
                label="Más Información"
                className="p-button-outlined p-button-primary"
                icon="pi pi-info-circle"
                onClick={() => setShowLearningDialog(true)}
              />
            </div>

            <div className="info-item">
              <h2>¿Qué es un Repositorio Digital?</h2>
              <p>
                Una colección organizada de recursos digitales accesibles en línea. Aprende más aquí.
              </p>
              <Button
                label="Más Información"
                className="p-button-outlined"
                icon="pi pi-info-circle"
                onClick={() => setShowRepositoryDialog(true)}
              />
            </div>
          </div>
        </section>
      )}

      {/* Dialogs */}
      <Dialog
        header="¿Qué es un Objeto de Aprendizaje?"
        visible={showLearningDialog}
        style={{ width: "40vw" }}
        footer={
          <Button
            label="Cerrar"
            icon="pi pi-times"
            className="p-button-text"
            onClick={() => setShowLearningDialog(false)}
          />
        }
        onHide={() => setShowLearningDialog(false)}
      >
        <p>
          Un objeto de aprendizaje es un recurso digital que facilita el aprendizaje de un tema
          específico. Ejemplos incluyen actividades interactivas, videos, cuestionarios, y más.
        </p>
      </Dialog>

      <Dialog
        header="¿Qué es un Repositorio Digital?"
        visible={showRepositoryDialog}
        style={{ width: "40vw" }}
        footer={
          <Button
            label="Cerrar"
            icon="pi pi-times"
            className="p-button-text"
            onClick={() => setShowRepositoryDialog(false)}
          />
        }
        onHide={() => setShowRepositoryDialog(false)}
      >
        <p>
          Los repositorios digitales son espacios virtuales diseñados para almacenar, organizar y
          compartir recursos educativos accesibles para docentes.
        </p>
      </Dialog>

      {/* Contact Dialog */}
      <Dialog
        header="Contacto"
        visible={showContactDialog}
        style={{ width: "30vw" }}
        footer={
          <Button
            label="Cerrar"
            icon="pi pi-times"
            className="p-button-text"
            onClick={() => setShowContactDialog(false)}
          />
        }
        onHide={() => setShowContactDialog(false)}
      >
        <p>Correo: verificador@example.com</p>
        <p>Teléfono: +52 987 654 3210</p>
      </Dialog>
    </div>
  );
};

export default Home;
