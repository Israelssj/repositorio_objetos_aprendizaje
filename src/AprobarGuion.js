// src/AprobarGuion.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';

function AprobarGuion() {
  const [guiones, setGuiones] = useState([]);
  const [observacion, setObservacion] = useState('');

  
  useEffect(() => {
    axios.get('http://localhost:8080/api/guiones')
      .then(response => {
        if (Array.isArray(response.data)) {
          setGuiones(response.data);
        } else {
          setGuiones([]);
        }
      })
      .catch(error => {
        console.error('Error al obtener los guiones:', error);
        setGuiones([]);
      });
  }, []);

  
  const handleAprobar = (id) => {
    axios.put(`http://localhost:8080/api/guiones/${id}`, { estado: 'aprobado', observacion })
      .then(() => {
        alert('Guion aprobado exitosamente');
        setGuiones(guiones.filter(guion => guion.idGuion !== id));
        setObservacion('');
      })
      .catch(error => console.error('Error al aprobar el guion:', error));
  };

  
  const handleDenegar = (id) => {
    axios.put(`http://localhost:8080/api/guiones/${id}`, { estado: 'denegado', observacion })
      .then(() => {
        alert('Guion denegado exitosamente');
        setGuiones(guiones.filter(guion => guion.idGuion !== id));
        setObservacion('');
      })
      .catch(error => console.error('Error al denegar el guion:', error));
  };

  return (
    <div>
      <h2>Aprobar o Denegar Guiones</h2>
      {guiones.length > 0 ? (
        guiones.map(guion => (
          <div key={guion.idGuion} className="card mt-3">
            <div className="card-body">
              <h5 className="card-title">{guion.titulo}</h5>
              <p className="card-text">{guion.descripcion}</p>
              <p className="card-text"><strong>Estado:</strong> {guion.estado}</p>
              <InputTextarea
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
                rows={3}
                cols={30}
                placeholder="Escribe una observación..."
              />
              <Button label="Aprobar" className="p-button-success mt-2" onClick={() => handleAprobar(guion.idGuion)} />
              <Button label="Denegar" className="p-button-danger mt-2 ml-2" onClick={() => handleDenegar(guion.idGuion)} />
            </div>
          </div>
        ))
      ) : (
        <p>No hay guiones disponibles.</p>
      )}
    </div>
  );
}

export default AprobarGuion;
