// AprobarGuion.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GuionDetalle from './GuionDetalle';

const AprobarGuion = () => {
  const [guiones, setGuiones] = useState([]);
  const [guionSeleccionado, setGuionSeleccionado] = useState(null);

  useEffect(() => {
    const fetchGuiones = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/guiones/pendientes');
        setGuiones(response.data);
      } catch (error) {
        console.error('Error al obtener los guiones pendientes:', error);
      }
    };

    fetchGuiones();
  }, []);

  const handleAprobar = async (idGuion) => {
    try {
      await axios.post(`http://localhost:8080/api/guiones/aprobar/${idGuion}`);
      alert('Guion aprobado exitosamente');
      setGuiones(guiones.filter(guion => guion.idGuion !== idGuion));
    } catch (error) {
      console.error('Error al aprobar el guion:', error);
    }
  };

  const handleDenegar = async (idGuion) => {
    try {
      await axios.post(`http://localhost:8080/api/guiones/denegar/${idGuion}`);
      alert('Guion denegado exitosamente');
      setGuiones(guiones.filter(guion => guion.idGuion !== idGuion));
    } catch (error) {
      console.error('Error al denegar el guion:', error);
    }
  };

  return (
    <div className="aprobar-guion">
      <h2>Aprobar o Denegar Guiones</h2>
      {guiones.length === 0 ? (
        <p>No hay guiones pendientes.</p>
      ) : (
        <div className="lista-guiones">
          {guiones.map(guion => (
            <div
              key={guion.idGuion}
              onClick={() => setGuionSeleccionado(guion)}
              className="guion-resumen"
            >
              <h4>{guion.titulo}</h4>
              <p>{guion.descripcion}</p>
            </div>
          ))}
        </div>
      )}
      {guionSeleccionado && (
        <GuionDetalle
          guion={guionSeleccionado}
          onAprobar={handleAprobar}
          onDenegar={handleDenegar}
        />
      )}
    </div>
  );
};

export default AprobarGuion;
