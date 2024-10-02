import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GuionForm = () => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fechaCreacion: '',
    materia: '',
    nombreDocente: '',
    nombreMateria: '',
    nombreTema: '',
    nombreSubtema: '',
    semestre: '',
    tipoObjeto: '', 
    objetoAprendizaje: {}, 
  });

  const [respuestas, setRespuestas] = useState([{ textoRespuesta: '', correcta: false }]);
  const [preguntasCuestionario, setPreguntasCuestionario] = useState([{ pregunta: '', tipoPregunta: '' }]);
  const [diapositivas, setDiapositivas] = useState([{ descripcion: '', interacciones: '' }]);

  const navigate = useNavigate();

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 
  const handleObjetoChange = (e) => {
    setFormData({
      ...formData,
      objetoAprendizaje: { ...formData.objetoAprendizaje, [e.target.name]: e.target.value },
    });
  };


  const handleRespuestaChange = (index, e) => {
    const newRespuestas = [...respuestas];
    newRespuestas[index][e.target.name] = e.target.value;
    setRespuestas(newRespuestas);
  };

  const addRespuesta = () => {
    setRespuestas([...respuestas, { textoRespuesta: '', correcta: false }]);
  };

  const removeRespuesta = (index) => {
    const newRespuestas = [...respuestas];
    newRespuestas.splice(index, 1);
    setRespuestas(newRespuestas);
  };


  const handlePreguntaCuestionarioChange = (index, e) => {
    const newPreguntas = [...preguntasCuestionario];
    newPreguntas[index][e.target.name] = e.target.value;
    setPreguntasCuestionario(newPreguntas);
  };

  const addPreguntaCuestionario = () => {
    setPreguntasCuestionario([...preguntasCuestionario, { pregunta: '', tipoPregunta: '' }]);
  };

  const removePreguntaCuestionario = (index) => {
    const newPreguntas = [...preguntasCuestionario];
    newPreguntas.splice(index, 1);
    setPreguntasCuestionario(newPreguntas);
  };


  const handleDiapositivaChange = (index, e) => {
    const newDiapositivas = [...diapositivas];
    newDiapositivas[index][e.target.name] = e.target.value;
    setDiapositivas(newDiapositivas);
  };

  const addDiapositiva = () => {
    setDiapositivas([...diapositivas, { descripcion: '', interacciones: '' }]);
  };

  const removeDiapositiva = (index) => {
    const newDiapositivas = [...diapositivas];
    newDiapositivas.splice(index, 1);
    setDiapositivas(newDiapositivas);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      if (formData.tipoObjeto === 'eleccionMultiple') {
        formData.objetoAprendizaje.respuestas = respuestas;
      }

     
      if (formData.tipoObjeto === 'cuestionario') {
        formData.objetoAprendizaje.preguntasCuestionario = preguntasCuestionario;
      }

     
      if (formData.tipoObjeto === 'presentacionCurso') {
        formData.objetoAprendizaje.diapositivas = diapositivas;
      }

      const response = await axios.post('http://localhost:8080/api/guiones', formData);
      if (response.status === 201) {
        navigate('/guiones'); 
      }
    } catch (error) {
      console.error('Error al guardar el guion:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Crear Guion</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Título</label>
          <input
            type="text"
            className="form-control"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <input
            type="text"
            className="form-control"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Fecha de Creación</label>
          <input
            type="date"
            className="form-control"
            name="fechaCreacion"
            value={formData.fechaCreacion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Materia</label>
          <input
            type="text"
            className="form-control"
            name="materia"
            value={formData.materia}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Nombre del Docente</label>
          <input
            type="text"
            className="form-control"
            name="nombreDocente"
            value={formData.nombreDocente}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Tipo de Objeto de Aprendizaje</label>
          <select
            className="form-control"
            name="tipoObjeto"
            value={formData.tipoObjeto}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un tipo</option>
            <option value="videoInteractivo">Video Interactivo</option>
            <option value="crucigrama">Crucigrama</option>
            <option value="arrastrarPalabras">Arrastrar Palabras</option>
            <option value="eleccionMultiple">Elección Múltiple</option>
            <option value="cuestionario">Cuestionario</option>
            <option value="presentacionCurso">Presentación de Curso</option>
          </select>
        </div>

        {/* Mostrar campos de Video Interactivo si el tipo es "videoInteractivo" */}
        {formData.tipoObjeto === 'videoInteractivo' && (
          <>
            <div className="form-group">
              <label>URL del Video</label>
              <input
                type="text"
                className="form-control"
                name="urlVideo"
                value={formData.objetoAprendizaje.urlVideo || ''}
                onChange={handleObjetoChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Minuto del Video</label>
              <input
                type="text"
                className="form-control"
                name="minutoVideo"
                value={formData.objetoAprendizaje.minutoVideo || ''}
                onChange={handleObjetoChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Pregunta del Video</label>
              <input
                type="text"
                className="form-control"
                name="pregunta"
                value={formData.objetoAprendizaje.pregunta || ''}
                onChange={handleObjetoChange}
                required
              />
            </div>
          </>
        )}

        {/* Mostrar campos de Crucigrama si el tipo es "crucigrama" */}
        {formData.tipoObjeto === 'crucigrama' && (
          <>
            <div className="form-group">
              <label>Contenido del Crucigrama</label>
              <textarea
                className="form-control"
                name="contenido"
                value={formData.objetoAprendizaje.contenido || ''}
                onChange={handleObjetoChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Pregunta</label>
              <input
                type="text"
                className="form-control"
                name="pregunta"
                value={formData.objetoAprendizaje.pregunta || ''}
                onChange={handleObjetoChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Pista</label>
              <input
                type="text"
                className="form-control"
                name="pista"
                value={formData.objetoAprendizaje.pista || ''}
                onChange={handleObjetoChange}
                required
              />
            </div>
          </>
        )}

        {/* Mostrar campos de Arrastrar Palabras si el tipo es "arrastrarPalabras" */}
        {formData.tipoObjeto === 'arrastrarPalabras' && (
          <>
            <div className="form-group">
              <label>Texto Base</label>
              <textarea
                className="form-control"
                name="textoBase"
                value={formData.objetoAprendizaje.textoBase || ''}
                onChange={handleObjetoChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Palabras para Arrastrar</label>
              <textarea
                className="form-control"
                name="palabras"
                value={formData.objetoAprendizaje.palabras || ''}
                onChange={handleObjetoChange}
                required
              />
            </div>
          </>
        )}

        {/* Mostrar campos de Elección Múltiple si el tipo es "eleccionMultiple" */}
        {formData.tipoObjeto === 'eleccionMultiple' && (
          <>
            <div className="form-group">
              <label>Pregunta de Elección Múltiple</label>
              <input
                type="text"
                className="form-control"
                name="pregunta"
                value={formData.objetoAprendizaje.pregunta || ''}
                onChange={handleObjetoChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Respuestas</label>
              {respuestas.map((respuesta, index) => (
                <div className="input-group mb-2" key={index}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Respuesta ${index + 1}`}
                    name="textoRespuesta"
                    value={respuesta.textoRespuesta}
                    onChange={(e) => handleRespuestaChange(index, e)}
                    required
                  />
                  <select
                    name="correcta"
                    value={respuesta.correcta}
                    onChange={(e) => handleRespuestaChange(index, e)}
                    className="form-control"
                  >
                    <option value={false}>Incorrecta</option>
                    <option value={true}>Correcta</option>
                  </select>
                  <div className="input-group-append">
                    {index > 0 && (
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => removeRespuesta(index)}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button type="button" className="btn btn-secondary" onClick={addRespuesta}>
                Agregar Respuesta
              </button>
            </div>
          </>
        )}

        {/* Mostrar campos de Cuestionario si el tipo es "cuestionario" */}
        {formData.tipoObjeto === 'cuestionario' && (
          <>
            <div className="form-group">
              <label>Preguntas del Cuestionario</label>
              {preguntasCuestionario.map((pregunta, index) => (
                <div className="input-group mb-2" key={index}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Pregunta ${index + 1}`}
                    name="pregunta"
                    value={pregunta.pregunta}
                    onChange={(e) => handlePreguntaCuestionarioChange(index, e)}
                    required
                  />
                  <select
                    name="tipoPregunta"
                    value={pregunta.tipoPregunta}
                    onChange={(e) => handlePreguntaCuestionarioChange(index, e)}
                    className="form-control"
                  >
                    <option value="">Tipo de Pregunta</option>
                    <option value="multiple">Opción Múltiple</option>
                    <option value="verdaderoFalso">Verdadero/Falso</option>
                  </select>
                  <div className="input-group-append">
                    {index > 0 && (
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => removePreguntaCuestionario(index)}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button type="button" className="btn btn-secondary" onClick={addPreguntaCuestionario}>
                Agregar Pregunta
              </button>
            </div>
          </>
        )}

        {/* Mostrar campos de Presentación de Curso si el tipo es "presentacionCurso" */}
        {formData.tipoObjeto === 'presentacionCurso' && (
          <>
            <div className="form-group">
              <label>Diapositivas</label>
              {diapositivas.map((diapositiva, index) => (
                <div className="input-group mb-2" key={index}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Descripción Diapositiva ${index + 1}`}
                    name="descripcion"
                    value={diapositiva.descripcion}
                    onChange={(e) => handleDiapositivaChange(index, e)}
                    required
                  />
                  <textarea
                    className="form-control"
                    placeholder="Interacciones"
                    name="interacciones"
                    value={diapositiva.interacciones}
                    onChange={(e) => handleDiapositivaChange(index, e)}
                    required
                  />
                  <div className="input-group-append">
                    {index > 0 && (
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => removeDiapositiva(index)}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button type="button" className="btn btn-secondary" onClick={addDiapositiva}>
                Agregar Diapositiva
              </button>
            </div>
          </>
        )}

        <button type="submit" className="btn btn-primary mt-3">
          Guardar Guion
        </button>
      </form>
    </div>
  );
};

export default GuionForm;
