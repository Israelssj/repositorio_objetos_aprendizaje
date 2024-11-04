import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';

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
    videoInteractivo: { urlVideo: '', elementos: [] },
    crucigrama: { contenido: '', elementos: [] },
    arrastrarPalabras: { textoBase: '', elementos: [] },
    cuestionario: { elementos: [] },
    eleccionMultiple: { elementos: [] },
    presentacionCurso: { diapositivas: [] },
  });

  const navigate = useNavigate();
  const toast = useRef(null);

  const tipoPreguntaMap = {
    Abierta: 1,
    'Opción Múltiple': 2,
  };

  // Manejadores de cambio
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVideoInteractivoChange = (e) => {
    setFormData({
      ...formData,
      videoInteractivo: { ...formData.videoInteractivo, [e.target.name]: e.target.value },
    });
  };

  const handleCrucigramaChange = (e) => {
    setFormData({
      ...formData,
      crucigrama: { ...formData.crucigrama, [e.target.name]: e.target.value },
    });
  };

  const handleArrastrarPalabrasChange = (e) => {
    setFormData({
      ...formData,
      arrastrarPalabras: { ...formData.arrastrarPalabras, [e.target.name]: e.target.value },
    });
  };

  const handleCuestionarioChange = (index, e) => {
    const newElementos = [...formData.cuestionario.elementos];
    newElementos[index][e.target.name] = e.target.value;
    setFormData({
      ...formData,
      cuestionario: { ...formData.cuestionario, elementos: newElementos },
    });
  };

  const handleRespuestaChange = (indexElemento, indexRespuesta, e) => {
    const newElementos = [...formData.cuestionario.elementos];
    newElementos[indexElemento].respuestas[indexRespuesta] = e.target.value;
    setFormData({
      ...formData,
      cuestionario: { ...formData.cuestionario, elementos: newElementos },
    });
  };

  

  const handleEleccionMultipleChange = (index, e) => {
    const newElementos = [...formData.eleccionMultiple.elementos];
    newElementos[index][e.target.name] = e.target.value;
    setFormData({
      ...formData,
      eleccionMultiple: { ...formData.eleccionMultiple, elementos: newElementos },
    });
  };

  const handleRespuestaEleccionChange = (indexElemento, indexRespuesta, e) => {
    const newElementos = [...formData.eleccionMultiple.elementos];
    newElementos[indexElemento].respuestas[indexRespuesta][e.target.name] = e.target.value;
    setFormData({
      ...formData,
      eleccionMultiple: { ...formData.eleccionMultiple, elementos: newElementos },
    });
  };

  const handleCorrectaChange = (indexElemento, indexRespuesta, e) => {
    const newElementos = [...formData.eleccionMultiple.elementos];
    newElementos[indexElemento].respuestas[indexRespuesta].correcta = e.target.checked;
    setFormData({
      ...formData,
      eleccionMultiple: { ...formData.eleccionMultiple, elementos: newElementos },
    });
  };
  const handlePresentacionCursoChange = (index, e) => {
    const newDiapositivas = [...formData.presentacionCurso.diapositivas];
    newDiapositivas[index][e.target.name] = e.target.value;
    setFormData({
      ...formData,
      presentacionCurso: { ...formData.presentacionCurso, diapositivas: newDiapositivas },
    });
  };
  
  // Añadir y eliminar diapositivas
  const addDiapositiva = () => {
    setFormData({
      ...formData,
      presentacionCurso: {
        ...formData.presentacionCurso,
        diapositivas: [...formData.presentacionCurso.diapositivas, { descripcion: '', interacciones: '' }],
      },
    });
  };
  
  const removeDiapositiva = (index) => {
    const newDiapositivas = [...formData.presentacionCurso.diapositivas];
    newDiapositivas.splice(index, 1);
    setFormData({
      ...formData,
      presentacionCurso: { ...formData.presentacionCurso, diapositivas: newDiapositivas },
    });
  };
  

  // Manejadores de elementos
  const handleElementosVideoChange = (index, e) => {
    const newElementos = [...formData.videoInteractivo.elementos];
    newElementos[index][e.target.name] = e.target.value;
    setFormData({
      ...formData,
      videoInteractivo: { ...formData.videoInteractivo, elementos: newElementos },
    });
  };

  const handleElementosCrucigramaChange = (index, e) => {
    const newElementos = [...formData.crucigrama.elementos];
    newElementos[index][e.target.name] = e.target.value;
    setFormData({
      ...formData,
      crucigrama: { ...formData.crucigrama, elementos: newElementos },
    });
  };

  const handleElementosArrastrarPalabrasChange = (index, e) => {
    const newElementos = [...formData.arrastrarPalabras.elementos];
    newElementos[index][e.target.name] = e.target.value;
    setFormData({
      ...formData,
      arrastrarPalabras: { ...formData.arrastrarPalabras, elementos: newElementos },
    });
  };

  // Añadir y eliminar elementos
  const addElementoVideo = () => {
    setFormData({
      ...formData,
      videoInteractivo: {
        ...formData.videoInteractivo,
        elementos: [
          ...formData.videoInteractivo.elementos,
          { minutoVideo: '', pregunta: '', tipoPregunta: '' },
        ],
      },
    });
  };

  const addElementoCrucigrama = () => {
    setFormData({
      ...formData,
      crucigrama: {
        ...formData.crucigrama,
        elementos: [...formData.crucigrama.elementos, { pista: '', pregunta: '' }],
      },
    });
  };

  const addElementoArrastrarPalabras = () => {
    setFormData({
      ...formData,
      arrastrarPalabras: {
        ...formData.arrastrarPalabras,
        elementos: [...formData.arrastrarPalabras.elementos, { palabras: '' }],
      },
    });
  };

  const removeElementoVideo = (index) => {
    const newElementos = [...formData.videoInteractivo.elementos];
    newElementos.splice(index, 1);
    setFormData({
      ...formData,
      videoInteractivo: { ...formData.videoInteractivo, elementos: newElementos },
    });
  };

  const removeElementoCrucigrama = (index) => {
    const newElementos = [...formData.crucigrama.elementos];
    newElementos.splice(index, 1);
    setFormData({
      ...formData,
      crucigrama: { ...formData.crucigrama, elementos: newElementos },
    });
  };

  const removeElementoArrastrarPalabras = (index) => {
    const newElementos = [...formData.arrastrarPalabras.elementos];
    newElementos.splice(index, 1);
    setFormData({
      ...formData,
      arrastrarPalabras: { ...formData.arrastrarPalabras, elementos: newElementos },
    });
  };


  
  // Añadir y eliminar elementos de cuestionario
  const addElementoCuestionario = () => {
    setFormData({
      ...formData,
      cuestionario: {
        ...formData.cuestionario,
        elementos: [...formData.cuestionario.elementos, { pregunta: '', tipoPregunta: 'Abierta', respuestas: [''] }],
      },
    });
  };

  const removeElementoCuestionario = (index) => {
    const newElementos = [...formData.cuestionario.elementos];
    newElementos.splice(index, 1);
    setFormData({
      ...formData,
      cuestionario: { ...formData.cuestionario, elementos: newElementos },
    });
  };

  const addRespuesta = (index) => {
    const newElementos = [...formData.cuestionario.elementos];
    newElementos[index].respuestas.push('');
    setFormData({
      ...formData,
      cuestionario: { ...formData.cuestionario, elementos: newElementos },
    });
  };

  const removeRespuesta = (indexElemento, indexRespuesta) => {
    const newElementos = [...formData.cuestionario.elementos];
    newElementos[indexElemento].respuestas.splice(indexRespuesta, 1);
    setFormData({
      ...formData,
      cuestionario: { ...formData.cuestionario, elementos: newElementos },
    });
  };

    // Añadir y eliminar elementos de elección múltiple
    const addElementoEleccionMultiple = () => {
      setFormData({
        ...formData,
        eleccionMultiple: {
          ...formData.eleccionMultiple,
          elementos: [...formData.eleccionMultiple.elementos, { pregunta: '', respuestas: [{ textoRespuesta: '', correcta: false }] }],
        },
      });
    };
  
    const removeElementoEleccionMultiple = (index) => {
      const newElementos = [...formData.eleccionMultiple.elementos];
      newElementos.splice(index, 1);
      setFormData({
        ...formData,
        eleccionMultiple: { ...formData.eleccionMultiple, elementos: newElementos },
      });
    };
  
    const addRespuestaEleccion = (index) => {
      const newElementos = [...formData.eleccionMultiple.elementos];
      newElementos[index].respuestas.push({ textoRespuesta: '', correcta: false });
      setFormData({
        ...formData,
        eleccionMultiple: { ...formData.eleccionMultiple, elementos: newElementos },
      });
    };
  
    const removeRespuestaEleccion = (indexElemento, indexRespuesta) => {
      const newElementos = [...formData.eleccionMultiple.elementos];
      newElementos[indexElemento].respuestas.splice(indexRespuesta, 1);
      setFormData({
        ...formData,
        eleccionMultiple: { ...formData.eleccionMultiple, elementos: newElementos },
      });
    };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const guionResponse = await axios.post('http://localhost:8080/api/guiones', {
        // Datos del guion
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        fechaCreacion: formData.fechaCreacion,
        materia: formData.materia,
        nombreDocente: formData.nombreDocente,
        nombreMateria: formData.nombreMateria,
        nombreTema: formData.nombreTema,
        nombreSubtema: formData.nombreSubtema,
        semestre: formData.semestre,
        tipoObjeto: formData.tipoObjeto,
        objetoAprendizaje: '',
      });

      const guionId = guionResponse.data.idGuion;

      if (formData.tipoObjeto === 'videoInteractivo') {
        const videoResponse = await axios.post('http://localhost:8080/api/videos-interactivos', {
          urlVideo: formData.videoInteractivo.urlVideo,
          guion: { idGuion: guionId },
        });

        const videoId = videoResponse.data.idVideoInteractivo;

        for (const elemento of formData.videoInteractivo.elementos) {
          await axios.post('http://localhost:8080/api/elementos-video-interactivo', {
            minutoVideo: elemento.minutoVideo,
            pregunta: elemento.pregunta,
            tipoPregunta: elemento.tipoPregunta,
            videoInteractivo: { idVideoInteractivo: videoId },
          });
        }
      } else if (formData.tipoObjeto === 'crucigrama') {
        const crucigramaResponse = await axios.post('http://localhost:8080/api/crucigramas', {
          contenido: formData.crucigrama.contenido,
          guion: { idGuion: guionId },
        });

        const crucigramaId = crucigramaResponse.data.idCrucigrama;

        for (const elemento of formData.crucigrama.elementos) {
          await axios.post('http://localhost:8080/api/elementos-crucigrama', {
            pista: elemento.pista,
            pregunta: elemento.pregunta,
            crucigrama: { idCrucigrama: crucigramaId },
          });
        }
      } else if (formData.tipoObjeto === 'arrastrarPalabras') {
        const arrastrarPalabrasResponse = await axios.post(
          'http://localhost:8080/api/arrastrar-palabras',
          {
            textoBase: formData.arrastrarPalabras.textoBase,
            guion: { idGuion: guionId },
          }
        );

        const arrastrarPalabrasId = arrastrarPalabrasResponse.data.idArrastarPalabras;

        for (const elemento of formData.arrastrarPalabras.elementos) {
          await axios.post('http://localhost:8080/api/elementos-arrastrar-palabras', {
            palabras: elemento.palabras,
            arrastrarPalabras: { idArrastarPalabras: arrastrarPalabrasId },
          });
        }
      } else if (formData.tipoObjeto === 'cuestionario') {
        const cuestionarioResponse = await axios.post('http://localhost:8080/api/cuestionarios', {
          guion: { idGuion: guionId },
        });

        const cuestionarioId = cuestionarioResponse.data.idCuestionario;

        for (const elemento of formData.cuestionario.elementos) {
          const elementoResponse = await axios.post('http://localhost:8080/api/elementos-cuestionario', {
            pregunta: elemento.pregunta,
            tipoPregunta: tipoPreguntaMap[elemento.tipoPregunta], 
            cuestionario: { idCuestionario: cuestionarioId },
          });

          const elementoId = elementoResponse.data.idElementosCuestionario;

          for (const respuesta of elemento.respuestas) {
            await axios.post('http://localhost:8080/api/respuestas-cuestionario', {
              texto: respuesta,
              elementosCuestionario: { idElementosCuestionario: elementoId },
            });
          }
        }
      }

      

      if (formData.tipoObjeto === 'eleccionMultiple') {
        const eleccionMultipleResponse = await axios.post(
          'http://localhost:8080/api/eleccion-multiple',
          {
            guion: { idGuion: guionId },
          }
        );

        const eleccionMultipleId = eleccionMultipleResponse.data.idEleccionMultiple;

        for (const elemento of formData.eleccionMultiple.elementos) {
          const elementoResponse = await axios.post(
            'http://localhost:8080/api/elementos-eleccion-multiple',
            {
              pregunta: elemento.pregunta,
              eleccionMultiple: { idEleccionMultiple: eleccionMultipleId },
            }
          );

          const elementoId = elementoResponse.data.idElementosEleccionMultiple;

          for (const respuesta of elemento.respuestas) {
            await axios.post('http://localhost:8080/api/respuestas-eleccion-multiple', {
              textoRespuesta: respuesta.textoRespuesta,
              correcta: respuesta.correcta,
              elementosEleccionMultiple: { idElementosEleccionMultiple: elementoId },
            });
          }
        }
      }

      if (formData.tipoObjeto === 'presentacionCurso') {
        const presentacionCursoResponse = await axios.post('http://localhost:8080/api/presentaciones-curso', {
          guion: { idGuion: guionId },
        });
      
        const presentacionCursoId = presentacionCursoResponse.data.idPresentacionCurso;
      
        for (const diapositiva of formData.presentacionCurso.diapositivas) {
          await axios.post('http://localhost:8080/api/diapositivas', {
            descripcion: diapositiva.descripcion,
            interacciones: diapositiva.interacciones,
            presentacionCurso: { idPresentacionCurso: presentacionCursoId },
          });
        }
      }
      
      

      toast.current.show({
        severity: 'success',
        summary: 'Guion guardado',
        detail: 'El guion y sus objetos fueron guardados exitosamente.',
        life: 3000,
      });

      // restablece el formulario
      setFormData({
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
        videoInteractivo: { urlVideo: '', elementos: [] },
        crucigrama: { contenido: '', elementos: [] },
        arrastrarPalabras: { textoBase: '', elementos: [] },
        cuestionario: { elementos: [] },
        eleccionMultiple: { elementos: [] },
        presentacionCurso: { diapositivas: [] },
      });

      setTimeout(() => navigate('/guiones'), 3000);
    } catch (error) {
      console.error('Error al guardar el guion:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Ocurrió un error al guardar el guion.',
        life: 3000,
      });
    }
  };

  return (
    <div className="container mt-4">
      <Toast ref={toast} />
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
          <label>Nombre Materia</label>
          <input
            type="text"
            className="form-control"
            name="nombreMateria"
            value={formData.nombreMateria}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Nombre Tema</label>
          <input
            type="text"
            className="form-control"
            name="nombreTema"
            value={formData.nombreTema}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Nombre Subtema</label>
          <input
            type="text"
            className="form-control"
            name="nombreSubtema"
            value={formData.nombreSubtema}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Semestre</label>
          <input
            type="text"
            className="form-control"
            name="semestre"
            value={formData.semestre}
            onChange={handleChange}
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
    <option value="cuestionario">Cuestionario</option> 
    <option value="arrastrarPalabras">Arrastrar Palabras</option>
    <option value="eleccionMultiple">Elección Múltiple</option>
    <option value="presentacionCurso">Presentación Curso</option> 

    
  </select>
</div>


        {/* Campos específicos para VideoInteractivo */}
        {formData.tipoObjeto === 'videoInteractivo' && (
          <>
            <div className="form-group">
              <label>URL del Video</label>
              <input
                type="text"
                className="form-control"
                name="urlVideo"
                value={formData.videoInteractivo.urlVideo}
                onChange={handleVideoInteractivoChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Elementos de Video Interactivo</label>
              {formData.videoInteractivo.elementos.map((elemento, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Minuto del Video"
                    name="minutoVideo"
                    value={elemento.minutoVideo}
                    onChange={(e) => handleElementosVideoChange(index, e)}
                    required
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Pregunta"
                    name="pregunta"
                    value={elemento.pregunta}
                    onChange={(e) => handleElementosVideoChange(index, e)}
                    required
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tipo de Pregunta"
                    name="tipoPregunta"
                    value={elemento.tipoPregunta}
                    onChange={(e) => handleElementosVideoChange(index, e)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-danger mt-1"
                    onClick={() => removeElementoVideo(index)}
                  >
                    Eliminar Elemento
                  </button>
                </div>
              ))}
              <button type="button" className="btn btn-secondary mt-2" onClick={addElementoVideo}>
                Agregar Elemento
              </button>
            </div>
          </>
        )}

        {/* Campos específicos para Crucigrama */}
        {formData.tipoObjeto === 'crucigrama' && (
          <>
            <div className="form-group">
              <label>Contenido del Crucigrama</label>
              <textarea
                className="form-control"
                name="contenido"
                value={formData.crucigrama.contenido}
                onChange={handleCrucigramaChange}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label>Elementos del Crucigrama</label>
              {formData.crucigrama.elementos.map((elemento, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Pista"
                    name="pista"
                    value={elemento.pista}
                    onChange={(e) => handleElementosCrucigramaChange(index, e)}
                    required
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Pregunta"
                    name="pregunta"
                    value={elemento.pregunta}
                    onChange={(e) => handleElementosCrucigramaChange(index, e)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-danger mt-1"
                    onClick={() => removeElementoCrucigrama(index)}
                  >
                    Eliminar Elemento
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary mt-2"
                onClick={addElementoCrucigrama}
              >
                Agregar Elemento
              </button>
            </div>
          </>
        )}

        {/* Campos específicos para Arrastrar Palabras */}
        {formData.tipoObjeto === 'arrastrarPalabras' && (
          <>
            <div className="form-group">
              <label>Texto Base</label>
              <textarea
                className="form-control"
                name="textoBase"
                value={formData.arrastrarPalabras.textoBase}
                onChange={handleArrastrarPalabrasChange}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label>Elementos de Arrastrar Palabras</label>
              {formData.arrastrarPalabras.elementos.map((elemento, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Palabras"
                    name="palabras"
                    value={elemento.palabras}
                    onChange={(e) => handleElementosArrastrarPalabrasChange(index, e)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-danger mt-1"
                    onClick={() => removeElementoArrastrarPalabras(index)}
                  >
                    Eliminar Elemento
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary mt-2"
                onClick={addElementoArrastrarPalabras}
              >
                Agregar Elemento
              </button>
            </div>
          </>
        )}

        {/* Campos específicos para Cuestionario */}
        {formData.tipoObjeto === 'cuestionario' && (
          <>
            <div className="form-group">
              <label>Elementos del Cuestionario</label>
              {formData.cuestionario.elementos.map((elemento, indexElemento) => (
                <div key={indexElemento} className="mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Pregunta"
                    name="pregunta"
                    value={elemento.pregunta}
                    onChange={(e) => handleCuestionarioChange(indexElemento, e)}
                    required
                  />
                  <select
                    className="form-control mt-2"
                    name="tipoPregunta"
                    value={elemento.tipoPregunta}
                    onChange={(e) => handleCuestionarioChange(indexElemento, e)}
                    required
                  >
                    <option value="Abierta">Abierta</option>
                    <option value="Opción Múltiple">Opción Múltiple</option>
                    {/* Agrega más tipos de pregunta según sea necesario */}
                  </select>
                  <label className="mt-2">Respuestas</label>
                  {elemento.tipoPregunta === 'Opción Múltiple' && (
                    <>
                      {elemento.respuestas.map((respuesta, indexRespuesta) => (
                        <div key={indexRespuesta} className="mb-1">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Respuesta"
                            value={respuesta}
                            onChange={(e) =>
                              handleRespuestaChange(indexElemento, indexRespuesta, e)
                            }
                            required
                          />
                          <button
                            type="button"
                            className="btn btn-danger mt-1"
                            onClick={() => removeRespuesta(indexElemento, indexRespuesta)}
                          >
                            Eliminar Respuesta
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-secondary mt-2"
                        onClick={() => addRespuesta(indexElemento)}
                      >
                        Agregar Respuesta
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    className="btn btn-danger mt-2"
                    onClick={() => removeElementoCuestionario(indexElemento)}
                  >
                    Eliminar Elemento
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary mt-2"
                onClick={addElementoCuestionario}
              >
                Agregar Elemento
              </button>
            </div>
          </>
        )}

        {/* Campos específicos para Elección Múltiple */}
{formData.tipoObjeto === 'eleccionMultiple' && (
  <>
    <div className="form-group">
      <label>Elementos de Elección Múltiple</label>
      {formData.eleccionMultiple.elementos.map((elemento, indexElemento) => (
        <div key={indexElemento} className="mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Pregunta"
            name="pregunta"
            value={elemento.pregunta}
            onChange={(e) => handleEleccionMultipleChange(indexElemento, e)}
            required
          />
          <label className="mt-2">Respuestas</label>
          {elemento.respuestas.map((respuesta, indexRespuesta) => (
            <div key={indexRespuesta} className="mb-1">
              <input
                type="text"
                className="form-control"
                placeholder="Texto de la Respuesta"
                name="textoRespuesta"
                value={respuesta.textoRespuesta}
                onChange={(e) =>
                  handleRespuestaEleccionChange(indexElemento, indexRespuesta, e)
                }
                required
              />
              <label>
                <input
                  type="checkbox"
                  checked={respuesta.correcta}
                  onChange={(e) => handleCorrectaChange(indexElemento, indexRespuesta, e)}
                />
                Correcta
              </label>
              <button
                type="button"
                className="btn btn-danger mt-1"
                onClick={() => removeRespuestaEleccion(indexElemento, indexRespuesta)}
              >
                Eliminar Respuesta
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary mt-2"
            onClick={() => addRespuestaEleccion(indexElemento)}
          >
            Agregar Respuesta
          </button>
          <button
            type="button"
            className="btn btn-danger mt-2"
            onClick={() => removeElementoEleccionMultiple(indexElemento)}
          >
            Eliminar Elemento
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-secondary mt-2"
        onClick={addElementoEleccionMultiple}
      >
        Agregar Elemento
      </button>
    </div>
  </>
)}
{formData.tipoObjeto === 'presentacionCurso' && (
  <>
    <div className="form-group">
      <label>Diapositivas</label>
      {formData.presentacionCurso.diapositivas.map((diapositiva, index) => (
        <div key={index} className="mb-2">
          <textarea
            className="form-control"
            placeholder="Descripción"
            name="descripcion"
            value={diapositiva.descripcion}
            onChange={(e) => handlePresentacionCursoChange(index, e)}
            required
          ></textarea>
          <textarea
            className="form-control mt-2"
            placeholder="Interacciones"
            name="interacciones"
            value={diapositiva.interacciones}
            onChange={(e) => handlePresentacionCursoChange(index, e)}
          ></textarea>
          <button
            type="button"
            className="btn btn-danger mt-1"
            onClick={() => removeDiapositiva(index)}
          >
            Eliminar Diapositiva
          </button>
        </div>
      ))}
      <button type="button" className="btn btn-secondary mt-2" onClick={addDiapositiva}>
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
