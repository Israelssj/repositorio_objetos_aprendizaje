import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import { Paginator } from "primereact/paginator";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import { useNavigate } from "react-router-dom";
import "./Css/EstadoGuion.css";

function EstadoGuion() {
  const [guiones, setGuiones] = useState([]);
  const [filteredGuiones, setFilteredGuiones] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);
  const toast = useRef(null);
  const navigate = useNavigate();

  // Obtener información del usuario desde localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      console.error("El ID del usuario no está definido.");
      return;
    }

    const fetchGuiones = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/guiones/usuario/${userId}`);
        const data = Array.isArray(response.data) ? response.data : [];
        setGuiones(data);
        setFilteredGuiones(data);
      } catch (error) {
        console.error("Error al obtener los guiones del usuario:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudieron cargar los guiones.",
          life: 3000,
        });
        setGuiones([]);
        setFilteredGuiones([]);
      }
    };

    fetchGuiones();
  }, [userId]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === "") {
      setFilteredGuiones(guiones);
    } else {
      setFilteredGuiones(
        guiones.filter(
          (guion) =>
            guion.titulo?.toLowerCase().includes(term) ||
            guion.descripcion?.toLowerCase().includes(term) ||
            guion.nombreDocente?.toLowerCase().includes(term)
        )
      );
    }

    setFirst(0);
  };

  const renderGuionDetails = (guion) => (
    <Panel header={guion.titulo || "Título no disponible"} key={guion.idGuion} className="guion-panel">
      <div className="guion-details">
        <p><strong>Descripción:</strong> {guion.descripcion || "No disponible"}</p>
        <p><strong>Materia:</strong> {guion.materia || "No especificada"}</p>
        <p><strong>Fecha de Creación:</strong> {guion.fechaCreacion ? new Date(guion.fechaCreacion).toLocaleDateString() : "Desconocida"}</p>
        <p><strong>Semestre:</strong> {guion.semestre || "No especificado"}</p>
        <p>
          <strong>Estado:</strong>{" "}
          <span className={`estado estado-${guion.estado?.toLowerCase()}`}>{guion.estado || "Desconocido"}</span>
        </p>
        <p>
          <strong>Docente:</strong> {guion.nombreDocente || "No especificado"}
        </p>
        <p>
          <strong>Nombre de la Materia:</strong> {guion.nombreMateria || "No especificada"}
        </p>
        <p>
          <strong>Nombre del Tema:</strong> {guion.nombreTema || "No especificado"}
        </p>
        <p>
          <strong>Nombre del Subtema:</strong> {guion.nombreSubtema || "No especificado"}
        </p>
        <p>
          <strong>Nombre del usuario que creó el guion:</strong> {`${guion.usuario?.nombreUsuario || ''} ${guion.usuario?.apellidoPaterno || ''}`}
        </p>

        {/* Si el guion está denegado, mostrar la observación y el botón para editar */}
        {guion.estado?.toLowerCase() === "denegado" && (
          <div className="observacion">
            <p><strong>Observación:</strong> {guion.observacion || "Sin observaciones"}</p>
            {/* Botón para editar el guion */}
            <Button
              label="Editar Guion"
              icon="pi pi-pencil"
              className="p-button-warning mt-2"
              onClick={() => navigate(`/editar-guion/${guion.idGuion}`)}
            />
          </div>
        )}

        {/* Clasificación por tipo de objeto de aprendizaje */}
        <h4>Detalles de los Objetos de Aprendizaje</h4>
        <Accordion multiple>
          {/* Cuestionarios */}
          {guion.cuestionarios?.length > 0 && (
            <AccordionTab header={`Cuestionarios (${guion.cuestionarios.length})`}>
              {guion.cuestionarios.map((cuestionario, index) => (
                <div key={index} className="oa-item">
                  <h5>Cuestionario {index + 1}</h5>
                  {cuestionario.elementosCuestionario?.map((elemento, idx) => (
                    <div key={idx} className="mb-3">
                      <p><strong>Pregunta {idx + 1}:</strong> {elemento.pregunta}</p>
                      <p><strong>Tipo de Pregunta:</strong> {elemento.tipoPregunta === 1 ? "Abierta" : "Opción Múltiple"}</p>
                      {elemento.tipoPregunta === 2 && elemento.respuestasCuestionario?.length > 0 && (
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
                </div>
              ))}
            </AccordionTab>
          )}

          {/* Videos Interactivos */}
          {guion.videosInteractivos?.length > 0 && (
            <AccordionTab header={`Videos Interactivos (${guion.videosInteractivos.length})`}>
              {guion.videosInteractivos.map((video, index) => (
                <div key={index} className="oa-item">
                  <p><strong>URL del Video:</strong> {video.urlVideo || "No disponible"}</p>
                  <h6>Elementos del Video:</h6>
                  <ul>
                    {video.elementosVideoInteractivo?.map((elemento, idx) => (
                      <li key={idx}>
                        <strong>Minuto:</strong> {elemento.minutoVideo}, <strong>Pregunta:</strong> {elemento.pregunta}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </AccordionTab>
          )}

          {/* Crucigramas */}
          {guion.crucigramas?.length > 0 && (
            <AccordionTab header={`Crucigramas (${guion.crucigramas.length})`}>
              {guion.crucigramas.map((crucigrama, index) => (
                <div key={index} className="oa-item">
                  <p><strong>Contenido:</strong> {crucigrama.contenido || "No disponible"}</p>
                  <h6>Elementos del Crucigrama:</h6>
                  <ul>
                    {crucigrama.elementosCrucigrama?.map((elemento, idx) => (
                      <li key={idx}>
                        <strong>Pista:</strong> {elemento.pista}, <strong>Pregunta:</strong> {elemento.pregunta}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </AccordionTab>
          )}

          {/* Arrastrar Palabras */}
          {guion.arrastrarPalabras?.length > 0 && (
            <AccordionTab header={`Arrastrar Palabras (${guion.arrastrarPalabras.length})`}>
              {guion.arrastrarPalabras.map((arrastrar, index) => (
                <div key={index} className="oa-item">
                  <p><strong>Texto Base:</strong> {arrastrar.textoBase || "No disponible"}</p>
                  <h6>Elementos:</h6>
                  <ul>
                    {arrastrar.elementosArrastrarPalabras?.map((elemento, idx) => (
                      <li key={idx}>
                        <strong>Palabras:</strong> {elemento.palabras}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </AccordionTab>
          )}

          {/* Elección Múltiple */}
          {guion.eleccionesMultiples?.length > 0 && (
            <AccordionTab header={`Elección Múltiple (${guion.eleccionesMultiples.length})`}>
              {guion.eleccionesMultiples.map((eleccion, index) => (
                <div key={index} className="oa-item">
                  {eleccion.elementosEleccionMultiple?.map((elemento, idx) => (
                    <div key={idx} className="mb-3">
                      <p><strong>Pregunta:</strong> {elemento.pregunta}</p>
                      <h6>Respuestas:</h6>
                      <ul>
                        {elemento.respuestas?.map((respuesta, rIdx) => (
                          <li key={rIdx}>
                            {respuesta.textoRespuesta}{' '}
                            {respuesta.correcta && <strong style={{ color: "green" }}>(Correcta)</strong>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </AccordionTab>
          )}

          {/* Presentaciones de Curso */}
          {guion.presentacionesCurso?.length > 0 && (
            <AccordionTab header={`Presentaciones de Curso (${guion.presentacionesCurso.length})`}>
              {guion.presentacionesCurso.map((presentacion, index) => (
                <div key={index} className="oa-item">
                  <h5>Presentación {index + 1}</h5>
                  <h6>Diapositivas:</h6>
                  <ul>
                    {presentacion.diapositivas?.map((diapositiva, idx) => (
                      <li key={idx}>
                        <strong>Descripción:</strong> {diapositiva.descripcion || "No disponible"}, <strong>Interacciones:</strong> {diapositiva.interacciones || "No disponibles"}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </AccordionTab>
          )}
        </Accordion>
      </div>
    </Panel>
  );

  const onPageChange = (e) => {
    setFirst(e.first);
    setRows(e.rows);
  };

  const displayedGuiones = filteredGuiones.slice(first, first + rows);

  return (
    <div className="container">
      <Toast ref={toast} />
      <h2 className="title">Estado de tus Guiones</h2>

      <div className="search-bar">
        <InputText
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Buscar guiones por título, descripción o docente"
          className="search-input"
        />
      </div>

      {displayedGuiones.length > 0 ? (
        <>
          {displayedGuiones.map((guion) => (
            <div key={guion.idGuion}>{renderGuionDetails(guion)}</div>
          ))}
          <Paginator
            first={first}
            rows={rows}
            totalRecords={filteredGuiones.length}
            rowsPerPageOptions={[5, 10, 15]}
            onPageChange={onPageChange}
            className="mt-3"
          />
        </>
      ) : (
        <p className="no-results">No se encontraron guiones.</p>
      )}
    </div>
  );
}

export default EstadoGuion;
