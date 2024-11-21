import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Panel } from 'primereact/panel';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Paginator } from 'primereact/paginator';
import { InputText } from 'primereact/inputtext';
import './Css/AprobarGuion.css'; 

function AprobarGuion() {
  const [guiones, setGuiones] = useState([]);
  const [filteredGuiones, setFilteredGuiones] = useState([]);
  const [observacion, setObservacion] = useState('');
  const [selectedGuionId, setSelectedGuionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5); 
  const toast = useRef(null);

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/guiones/pendientes')
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        setGuiones(data);
        setFilteredGuiones(data);
      })
      .catch((error) => {
        console.error('Error al obtener los guiones:', error);
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo obtener la lista de guiones',
          life: 3000,
        });
        setGuiones([]);
        setFilteredGuiones([]);
      });
  }, []);

  const handleAprobar = (id) => {
    axios
      .post(`http://localhost:8080/api/guiones/aprobar/${id}`)
      .then(() => {
        toast.current.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Guion aprobado exitosamente',
          life: 3000,
        });
        const updatedGuiones = guiones.filter((guion) => guion.idGuion !== id);
        setGuiones(updatedGuiones);
        setFilteredGuiones(updatedGuiones.filter((guion) =>
          guion.titulo.toLowerCase().includes(searchTerm.toLowerCase())
        ));
      })
      .catch((error) => console.error('Error al aprobar el guion:', error));
  };

  const handleDenegar = (id) => {
    if (observacion.trim() === '') {
      toast.current.show({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Proporciona una observación para denegar el guion',
        life: 3000,
      });
      return;
    }
    axios
      .post(`http://localhost:8080/api/guiones/denegar/${id}`, observacion, {
        headers: { 'Content-Type': 'text/plain' },
      })
      .then(() => {
        toast.current.show({
          severity: 'info',
          summary: 'Denegado',
          detail: 'Guion denegado exitosamente',
          life: 3000,
        });
        const updatedGuiones = guiones.filter((guion) => guion.idGuion !== id);
        setGuiones(updatedGuiones);
        setFilteredGuiones(updatedGuiones.filter((guion) =>
          guion.titulo.toLowerCase().includes(searchTerm.toLowerCase())
        ));
        setObservacion('');
      })
      .catch((error) => console.error('Error al denegar el guion:', error));
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredGuiones(
      guiones.filter((guion) =>
        guion.titulo.toLowerCase().includes(term) ||
        guion.descripcion.toLowerCase().includes(term) ||
        guion.nombreDocente.toLowerCase().includes(term)
      )
    );
    setFirst(0); 
  };

  const renderGuionDetalles = (guion) => (
    <Panel header={guion.titulo} key={guion.idGuion} className="mb-3 guion-panel">
      <div className="p-fluid">
        <p>
          <strong>Descripción:</strong> {guion.descripcion}
        </p>
        <p>
          <strong>Fecha de Creación:</strong> {guion.fechaCreacion}
        </p>

        <p>
          <strong>Docente:</strong> {guion.nombreDocente}
        </p>
        <p>
          <strong>Nombre de la Materia:</strong> {guion.nombreMateria}
        </p>
        <p>
          <strong>Nombre del Tema:</strong> {guion.nombreTema}
        </p>
        <p>
          <strong>Nombre del Subtema:</strong> {guion.nombreSubtema}
        </p>
        <p>
          <strong>Semestre:</strong> {guion.semestre}
        </p>
        <p>
          <strong>Tipo de Objeto de Aprendizaje:</strong> {guion.tipoObjeto}
        </p>
        <p>
          <strong>Nombre del usuario que creo el guion:</strong> {`${guion.usuario?.nombreUsuario || ''} ${guion.usuario?.apellidoPaterno || ''}`}
        </p>
        <Accordion>
          {/* Cuestionarios */}
          {guion.cuestionarios?.map((cuestionario, index) => (
            <AccordionTab key={index} header={`Cuestionario ${index + 1}`}>
              {cuestionario.elementosCuestionario?.map((elemento, idx) => (
                <div key={idx} className="mb-3">
                  <h6>Pregunta {idx + 1}:</h6>
                  <p><strong>Texto:</strong> {elemento.pregunta}</p>
                  <p><strong>Tipo de Pregunta:</strong> {elemento.tipoPregunta === 1 ? 'Abierta' : 'Opción Múltiple'}</p>
                  {elemento.tipoPregunta === 2 && (
                    <>
                      <h6>Respuestas:</h6>
                      <ul>
                        {elemento.respuestasCuestionario.map((respuesta, rIdx) => (
                          <li key={rIdx}>
                            {respuesta.texto}{' '}
                            {respuesta.correcta && <strong style={{ color: 'green' }}>(Correcta)</strong>}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              ))}
            </AccordionTab>
          ))}

          {/* Videos Interactivos */}
          {guion.videosInteractivos?.map((video, index) => (
            <AccordionTab key={index} header={`Video Interactivo ${index + 1}`}>
              <p><strong>URL del Video:</strong> {video.urlVideo}</p>
              <h6>Elementos del Video:</h6>
              <ul>
                {video.elementosVideoInteractivo?.map((elemento, idx) => (
                  <li key={idx}>
                    <strong>Minuto:</strong> {elemento.minutoVideo}, <strong>Pregunta:</strong> {elemento.pregunta}
                  </li>
                ))}
              </ul>
            </AccordionTab>
          ))}

          {/* Crucigramas */}
          {guion.crucigramas?.map((crucigrama, index) => (
            <AccordionTab key={index} header={`Crucigrama ${index + 1}`}>
              <p><strong>Contenido:</strong> {crucigrama.contenido}</p>
              <h6>Elementos del Crucigrama:</h6>
              <ul>
                {crucigrama.elementosCrucigrama?.map((elemento, idx) => (
                  <li key={idx}>
                    <strong>Pista:</strong> {elemento.pista}, <strong>Pregunta:</strong> {elemento.pregunta}
                  </li>
                ))}
              </ul>
            </AccordionTab>
          ))}

          {/* Arrastrar Palabras */}
          {guion.arrastrarPalabras?.map((arrastrar, index) => (
            <AccordionTab key={index} header={`Arrastrar Palabras ${index + 1}`}>
              <p><strong>Texto Base:</strong> {arrastrar.textoBase}</p>
              <h6>Elementos:</h6>
              <ul>
                {arrastrar.elementosArrastrarPalabras?.map((elemento, idx) => (
                  <li key={idx}>
                    <strong>Palabras:</strong> {elemento.palabras}
                  </li>
                ))}
              </ul>
            </AccordionTab>
          ))}

          {/* Elección Múltiple */}
          {guion.eleccionesMultiples?.map((eleccion, index) => (
            <AccordionTab key={index} header={`Elección Múltiple ${index + 1}`}>
              {eleccion.elementosEleccionMultiple?.map((elemento, idx) => (
                <div key={idx}>
                  <h6>Pregunta:</h6>
                  <p>{elemento.pregunta}</p>
                  <h6>Respuestas:</h6>
                  <ul>
                    {elemento.respuestas?.map((respuesta, rIdx) => (
                      <li key={rIdx}>
                        {respuesta.textoRespuesta}{' '}
                        {respuesta.correcta && <strong style={{ color: 'green' }}>(Correcta)</strong>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </AccordionTab>
          ))}

          {/* Presentaciones de Curso */}
          {guion.presentacionesCurso?.map((presentacion, index) => (
            <AccordionTab key={index} header={`Presentación ${index + 1}`}>
              <h6>Diapositivas:</h6>
              <ul>
                {presentacion.diapositivas?.map((diapositiva, idx) => (
                  <li key={idx}>
                    <strong>Descripción:</strong> {diapositiva.descripcion}, <strong>Interacciones:</strong> {diapositiva.interacciones}
                  </li>
                ))}
              </ul>
            </AccordionTab>
          ))}
        </Accordion>

        <h6>Observación:</h6>
        <InputTextarea
          value={selectedGuionId === guion.idGuion ? observacion : ''}
          onChange={(e) => {
            setSelectedGuionId(guion.idGuion);
            setObservacion(e.target.value);
          }}
          rows={3}
          cols={30}
          placeholder="Escribe una observación si se va a denegar..."
        />
        <div className="button-group mt-2">
          <Button
            label="Aprobar"
            className="p-button-success mr-2"
            onClick={() => handleAprobar(guion.idGuion)}
          />
          <Button
            label="Denegar"
            className="p-button-danger"
            onClick={() => handleDenegar(guion.idGuion)}
          />
        </div>
      </div>
    </Panel>
  );

  return (
    <div className="container">
      <Toast ref={toast} />
      <h2 className="title">Aprobar o Denegar Guiones</h2>
      <div className="mb-3">
        <InputText
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Buscar por título, descripción o docente..."
          className="w-full"
        />
      </div>
      {filteredGuiones.slice(first, first + rows).map((guion) => renderGuionDetalles(guion))}
      {filteredGuiones.length === 0 && <p>No hay guiones que coincidan con la búsqueda.</p>}
      <Paginator
        first={first}
        rows={rows}
        totalRecords={filteredGuiones.length}
        onPageChange={(e) => setFirst(e.first)}
        className="mt-3"
      />
    </div>
  );
}

export default AprobarGuion;
