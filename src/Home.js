import React from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useNavigate } from 'react-router-dom';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './Home.css'; // Asegúrate de tener un archivo CSS para estilizar tu Home.

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">Bienvenido a la Plataforma de Gestión Educativa</h1>
        <p className="hero-subtitle">Facilitando la creación y gestión de objetos de aprendizaje para maestros de Telebachilleratos.</p>
        <Button
          label="Comenzar"
          icon="pi pi-arrow-right"
          className="p-button-raised p-button-rounded hero-button"
          onClick={() => navigate('/guiones')}
        />
      </div>

      <div className="features-section">
        <Card title="Crear objetos de aprendizaje" className="feature-card">
          <p className="feature-description">
            Desarrolle objetos de aprendizaje para planificar lecciones interactivas que involucren a los estudiantes.
          </p>
          <Button label="Crear objeto de aprendizaje" icon="pi pi-pencil" className="p-button-outlined" onClick={() => navigate('/guiones')} />
        </Card>

        <Card title="Mis Guiones" className="feature-card">
          <p className="feature-description">
          Revisa y administra si tus guiones creados fueron aprobados.
          </p>
          <Button label="Revisar OA" icon="pi pi-check" className="p-button-outlined" onClick={() => navigate('/revisar-oa')} />
        </Card>

        <Card title="Descargar Recursos" className="feature-card">
          <p className="feature-description">
            Explore y descargue objetos de aprendizaje aprobados para usar en sus clases.
          </p>
          <Button label="Descargar OA" icon="pi pi-download" className="p-button-outlined" onClick={() => navigate('/descargas')} />
        </Card>
      </div>
    </div>
  );
};

export default Home;
