import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { useAuth } from './AuthContext';

const EditarGuion = () => {
  const { auth } = useAuth();
  const { id } = useParams(); 
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
    
    videoInteractivo: { idVideoInteractivo: null, urlVideo: '', elementos: [] },
    crucigrama: { idCrucigrama: null, contenido: '', elementosCrucigrama: [] },
    arrastrarPalabras: { idArrastrarPalabras: null, textoBase: '', elementosArrastrarPalabras: [] },
    cuestionario: { idCuestionario: null, elementosCuestionario: [] },
    eleccionMultiple: { idEleccionMultiple: null, elementosEleccionMultiple: [] },
    presentacionCurso: { idPresentacionCurso: null, diapositivas: [] },
    // observacion: '', 
  });

  const navigate = useNavigate();
  const toast = useRef(null);

  const tipoPreguntaMap = {
    Abierta: 1,
    'Opción Múltiple': 2,
  };

  const tipoPreguntaMapInvertido = {
    1: 'Abierta',
    2: 'Opción Múltiple',
  };

  
  useEffect(() => {
    const fetchGuion = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/guiones/${id}`);
        const data = response.data;

        
        const mapTipoPregunta = (tipo) => {
          const map = {
            1: 'Abierta',
            2: 'Opción Múltiple',
          };
          return map[tipo] || '';
        };

        setFormData({
          titulo: data.titulo || '',
          descripcion: data.descripcion || '',
          fechaCreacion: data.fechaCreacion || '',
          materia: data.materia || '',
          nombreDocente: data.nombreDocente || '',
          nombreMateria: data.nombreMateria || '',
          nombreTema: data.nombreTema || '',
          nombreSubtema: data.nombreSubtema || '',
          semestre: data.semestre || '',
          tipoObjeto: data.tipoObjeto || '',
          // observacion: data.observacion || '', 
          videoInteractivo:
            data.videosInteractivos && data.videosInteractivos.length > 0
              ? {
                  idVideoInteractivo: data.videosInteractivos[0].idVideoInteractivo || null,
                  urlVideo: data.videosInteractivos[0].urlVideo || '',
                  elementos: data.videosInteractivos[0].elementosVideoInteractivo || [],
                }
              : { idVideoInteractivo: null, urlVideo: '', elementos: [] },
          crucigrama:
            data.crucigramas && data.crucigramas.length > 0
              ? {
                  idCrucigrama: data.crucigramas[0].idCrucigrama || null,
                  contenido: data.crucigramas[0].contenido || '',
                  elementosCrucigrama: data.crucigramas[0].elementosCrucigrama || [],
                }
              : { idCrucigrama: null, contenido: '', elementosCrucigrama: [] },
          arrastrarPalabras:
            data.arrastrarPalabras && data.arrastrarPalabras.length > 0
              ? {
                  idArrastrarPalabras: data.arrastrarPalabras[0].idArrastrarPalabras || null,
                  textoBase: data.arrastrarPalabras[0].textoBase || '',
                  elementosArrastrarPalabras: data.arrastrarPalabras[0].elementosArrastrarPalabras || [],
                }
              : { idArrastrarPalabras: null, textoBase: '', elementosArrastrarPalabras: [] },
          cuestionario:
            data.cuestionarios && data.cuestionarios.length > 0
              ? {
                  idCuestionario: data.cuestionarios[0].idCuestionario || null,
                  elementosCuestionario: data.cuestionarios[0].elementosCuestionario
                    ? data.cuestionarios[0].elementosCuestionario.map((elem) => ({
                        ...elem,
                        
                        respuestasCuestionario: elem.respuestasCuestionario || [],
                        tipoPregunta: mapTipoPregunta(elem.tipoPregunta),
                      }))
                    : [],
                }
              : { idCuestionario: null, elementosCuestionario: [] },
          eleccionMultiple:
            data.eleccionesMultiples && data.eleccionesMultiples.length > 0
              ? {
                  idEleccionMultiple: data.eleccionesMultiples[0].idEleccionMultiple || null,
                  elementosEleccionMultiple: data.eleccionesMultiples[0].elementosEleccionMultiple || [],
                }
              : { idEleccionMultiple: null, elementosEleccionMultiple: [] },
          presentacionCurso:
            data.presentacionesCurso && data.presentacionesCurso.length > 0
              ? {
                  idPresentacionCurso: data.presentacionesCurso[0].idPresentacionCurso || null,
                  diapositivas: data.presentacionesCurso[0].diapositivas || [],
                }
              : { idPresentacionCurso: null, diapositivas: [] },
        });
      } catch (error) {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo obtener el guion.',
          life: 3000,
        });
      }
    };

    fetchGuion();
  }, [id]);

  
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

  const handlePreguntaCuestionarioChange = (index, e) => {
    const newElementos = [...formData.cuestionario.elementosCuestionario];
    newElementos[index][e.target.name] = e.target.value;
    setFormData({
      ...formData,
      cuestionario: { ...formData.cuestionario, elementosCuestionario: newElementos },
    });
  };

  const handleTipoPreguntaCuestionarioChange = (index, e) => {
    const newElementos = [...formData.cuestionario.elementosCuestionario];
    newElementos[index].tipoPregunta = e.target.value;
    
    if (e.target.value === 'Abierta') {
      newElementos[index].respuestasCuestionario = [];
    }
    setFormData({
      ...formData,
      cuestionario: { ...formData.cuestionario, elementosCuestionario: newElementos },
    });
  };

  const handleRespuestaCuestionarioChange = (indexElemento, indexRespuesta, e) => {
    const newElementos = [...formData.cuestionario.elementosCuestionario];
    if (
      newElementos[indexElemento].respuestasCuestionario &&
      newElementos[indexElemento].respuestasCuestionario[indexRespuesta]
    ) {
      newElementos[indexElemento].respuestasCuestionario[indexRespuesta].texto = e.target.value;
      setFormData({
        ...formData,
        cuestionario: { ...formData.cuestionario, elementosCuestionario: newElementos },
      });
    }
  };

  const handleCorrectaCuestionarioChange = (indexElemento, indexRespuesta, e) => {
    const newElementos = [...formData.cuestionario.elementosCuestionario];
    if (
      newElementos[indexElemento].respuestasCuestionario &&
      newElementos[indexElemento].respuestasCuestionario[indexRespuesta]
    ) {
      newElementos[indexElemento].respuestasCuestionario[indexRespuesta].correcta = e.target.checked;
      setFormData({
        ...formData,
        cuestionario: { ...formData.cuestionario, elementosCuestionario: newElementos },
      });
    }
  };

  const handlePreguntaEleccionChange = (index, e) => {
    const newElementos = [...formData.eleccionMultiple.elementosEleccionMultiple];
    newElementos[index][e.target.name] = e.target.value;
    setFormData({
      ...formData,
      eleccionMultiple: { ...formData.eleccionMultiple, elementosEleccionMultiple: newElementos },
    });
  };

  const handleRespuestaEleccionChange = (indexElemento, indexRespuesta, e) => {
    const newElementos = [...formData.eleccionMultiple.elementosEleccionMultiple];
    if (
      newElementos[indexElemento].respuestas &&
      newElementos[indexElemento].respuestas[indexRespuesta]
    ) {
      newElementos[indexElemento].respuestas[indexRespuesta][e.target.name] = e.target.value;
      setFormData({
        ...formData,
        eleccionMultiple: { ...formData.eleccionMultiple, elementosEleccionMultiple: newElementos },
      });
    }
  };

  const handleCorrectaEleccionChange = (indexElemento, indexRespuesta, e) => {
    const newElementos = [...formData.eleccionMultiple.elementosEleccionMultiple];
    if (
      newElementos[indexElemento].respuestas &&
      newElementos[indexElemento].respuestas[indexRespuesta]
    ) {
      newElementos[indexElemento].respuestas[indexRespuesta].correcta = e.target.checked;
      setFormData({
        ...formData,
        eleccionMultiple: { ...formData.eleccionMultiple, elementosEleccionMultiple: newElementos },
      });
    }
  };

  const handleDiapositivaChange = (index, e) => {
    const newDiapositivas = [...formData.presentacionCurso.diapositivas];
    newDiapositivas[index][e.target.name] = e.target.value;
    setFormData({
      ...formData,
      presentacionCurso: { ...formData.presentacionCurso, diapositivas: newDiapositivas },
    });
  };

  
  
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

  const removeElementoVideo = (index) => {
    const newElementos = [...formData.videoInteractivo.elementos];
    newElementos.splice(index, 1);
    setFormData({
      ...formData,
      videoInteractivo: { ...formData.videoInteractivo, elementos: newElementos },
    });
  };

  // Crucigrama
  const addElementoCrucigrama = () => {
    setFormData({
      ...formData,
      crucigrama: {
        ...formData.crucigrama,
        elementosCrucigrama: [...formData.crucigrama.elementosCrucigrama, { pista: '', pregunta: '' }],
      },
    });
  };

  const removeElementoCrucigrama = (index) => {
    const newElementos = [...formData.crucigrama.elementosCrucigrama];
    newElementos.splice(index, 1);
    setFormData({
      ...formData,
      crucigrama: { ...formData.crucigrama, elementosCrucigrama: newElementos },
    });
  };

  // Arrastrar Palabras
  const addElementoArrastrarPalabras = () => {
    setFormData({
      ...formData,
      arrastrarPalabras: {
        ...formData.arrastrarPalabras,
        elementosArrastrarPalabras: [...formData.arrastrarPalabras.elementosArrastrarPalabras, { palabras: '' }],
      },
    });
  };

  const removeElementoArrastrarPalabras = (index) => {
    const newElementos = [...formData.arrastrarPalabras.elementosArrastrarPalabras];
    newElementos.splice(index, 1);
    setFormData({
      ...formData,
      arrastrarPalabras: { ...formData.arrastrarPalabras, elementosArrastrarPalabras: newElementos },
    });
  };

  // Cuestionario
  const addElementoCuestionario = () => {
    setFormData({
      ...formData,
      cuestionario: {
        ...formData.cuestionario,
        elementosCuestionario: [
          ...formData.cuestionario.elementosCuestionario,
          {
            pregunta: '',
            tipoPregunta: 'Abierta',
            respuestasCuestionario: [], 
          },
        ],
      },
    });
  };

  const removeElementoCuestionario = (index) => {
    const newElementos = [...formData.cuestionario.elementosCuestionario];
    newElementos.splice(index, 1);
    setFormData({
      ...formData,
      cuestionario: { ...formData.cuestionario, elementosCuestionario: newElementos },
    });
  };

  const addRespuestaCuestionario = (index) => {
    const newElementos = [...formData.cuestionario.elementosCuestionario];
    if (!newElementos[index].respuestasCuestionario) {
      newElementos[index].respuestasCuestionario = [];
    }
    newElementos[index].respuestasCuestionario.push({ texto: '', correcta: false });
    setFormData({
      ...formData,
      cuestionario: { ...formData.cuestionario, elementosCuestionario: newElementos },
    });
  };

  const removeRespuestaCuestionario = (indexElemento, indexRespuesta) => {
    const newElementos = [...formData.cuestionario.elementosCuestionario];
    if (newElementos[indexElemento].respuestasCuestionario) {
      newElementos[indexElemento].respuestasCuestionario.splice(indexRespuesta, 1);
      setFormData({
        ...formData,
        cuestionario: { ...formData.cuestionario, elementosCuestionario: newElementos },
      });
    }
  };

  // Elección Múltiple
  const addElementoEleccionMultiple = () => {
    setFormData({
      ...formData,
      eleccionMultiple: {
        ...formData.eleccionMultiple,
        elementosEleccionMultiple: [
          ...formData.eleccionMultiple.elementosEleccionMultiple,
          { pregunta: '', respuestas: [{ textoRespuesta: '', correcta: false }] },
        ],
      },
    });
  };

  const removeElementoEleccionMultiple = (index) => {
    const newElementos = [...formData.eleccionMultiple.elementosEleccionMultiple];
    newElementos.splice(index, 1);
    setFormData({
      ...formData,
      eleccionMultiple: { ...formData.eleccionMultiple, elementosEleccionMultiple: newElementos },
    });
  };

  const addRespuestaEleccion = (index) => {
    const newElementos = [...formData.eleccionMultiple.elementosEleccionMultiple];
    if (!newElementos[index].respuestas) {
      newElementos[index].respuestas = [];
    }
    newElementos[index].respuestas.push({ textoRespuesta: '', correcta: false });
    setFormData({
      ...formData,
      eleccionMultiple: { ...formData.eleccionMultiple, elementosEleccionMultiple: newElementos },
    });
  };

  const removeRespuestaEleccion = (indexElemento, indexRespuesta) => {
    const newElementos = [...formData.eleccionMultiple.elementosEleccionMultiple];
    if (newElementos[indexElemento].respuestas) {
      newElementos[indexElemento].respuestas.splice(indexRespuesta, 1);
      setFormData({
        ...formData,
        eleccionMultiple: { ...formData.eleccionMultiple, elementosEleccionMultiple: newElementos },
      });
    }
  };

  // Presentación Curso
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

  // Manejo del envio del formulario para actualizar el guion
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      await axios.put(`http://localhost:8080/api/guiones/${id}`, {
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
        idUsuario: auth.user.id,                      
        estado: 'pendiente',                          
        observacion: null,                            
        
      });

      
      switch (formData.tipoObjeto) {
        case 'videoInteractivo':
          await handleUpdateVideoInteractivo();
          break;
        case 'crucigrama':
          await handleUpdateCrucigrama();
          break;
        case 'arrastrarPalabras':
          await handleUpdateArrastrarPalabras();
          break;
        case 'cuestionario':
          await handleUpdateCuestionario();
          break;
        case 'eleccionMultiple':
          await handleUpdateEleccionMultiple();
          break;
        case 'presentacionCurso':
          await handleUpdatePresentacionCurso();
          break;
        default:
          break;
      }

      toast.current.show({
        severity: 'success',
        summary: 'Guion actualizado',
        detail: 'El guion fue actualizado exitosamente y está pendiente de revisión.',
        life: 3000,
      });

      // Redirigir al usuario después de actualizar
      setTimeout(() => navigate('/guion-status'), 3000);
    } catch (error) {
      console.error('Error al actualizar el guion:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Ocurrió un error al actualizar el guion.',
        life: 3000,
      });
    }
  };

  
  const handleUpdateVideoInteractivo = async () => {
    if (formData.videoInteractivo.idVideoInteractivo) {
      // Actualizar video interactivo existente
      await axios.put(`http://localhost:8080/api/videos-interactivos/${formData.videoInteractivo.idVideoInteractivo}`, {
        urlVideo: formData.videoInteractivo.urlVideo,  
        idGuion: id,                                  
      });
    } else {
      // Crear nuevo video interactivo
      const videoResponse = await axios.post('http://localhost:8080/api/videos-interactivos', {
        urlVideo: formData.videoInteractivo.urlVideo,  
        idGuion: id,                                  
      });
      setFormData((prevState) => ({
        ...prevState,
        videoInteractivo: { 
          ...prevState.videoInteractivo, 
          idVideoInteractivo: videoResponse.data.idVideoInteractivo 
        },
      }));
    }

    // Actualizar elementos de video interactivo
    await axios.delete(`http://localhost:8080/api/elementos-video-interactivo/guion/${id}`);
    for (const elemento of formData.videoInteractivo.elementos) {
      await axios.post('http://localhost:8080/api/elementos-video-interactivo', {
        minutoVideo: elemento.minutoVideo,         
        pregunta: elemento.pregunta,               
        tipoPregunta: elemento.tipoPregunta,       
        idVideoInteractivo: formData.videoInteractivo.idVideoInteractivo,  
      });
    }
  };

  const handleUpdateCrucigrama = async () => {
    if (formData.crucigrama.idCrucigrama) {
      // Actualizar crucigrama existente
      await axios.put(`http://localhost:8080/api/crucigramas/${formData.crucigrama.idCrucigrama}`, {
        contenido: formData.crucigrama.contenido,  
        idGuion: id,                               
      });
    } else {
      // Crear nuevo crucigrama
      const crucigramaResponse = await axios.post('http://localhost:8080/api/crucigramas', {
        contenido: formData.crucigrama.contenido,  
        idGuion: id,                               
      });
      setFormData((prevState) => ({
        ...prevState,
        crucigrama: { 
          ...prevState.crucigrama, 
          idCrucigrama: crucigramaResponse.data.idCrucigrama 
        },
      }));
    }

    // Actualizar elementos del crucigrama
    await axios.delete(`http://localhost:8080/api/elementos-crucigrama/guion/${id}`);
    for (const elemento of formData.crucigrama.elementosCrucigrama) {
      await axios.post('http://localhost:8080/api/elementos-crucigrama', {
        pista: elemento.pista,                       
        pregunta: elemento.pregunta,                 
        idCrucigrama: formData.crucigrama.idCrucigrama,  
      });
    }
  };

  const handleUpdateArrastrarPalabras = async () => {
    if (formData.arrastrarPalabras.idArrastrarPalabras) {
      // Actualizar arrastrar palabras existente
      await axios.put(`http://localhost:8080/api/arrastrar-palabras/${formData.arrastrarPalabras.idArrastrarPalabras}`, {
        textoBase: formData.arrastrarPalabras.textoBase,  
        idGuion: id,                                     
      });
    } else {
      // Crear nuevo arrastrar palabras
      const arrastrarPalabrasResponse = await axios.post('http://localhost:8080/api/arrastrar-palabras', {
        textoBase: formData.arrastrarPalabras.textoBase,  
        idGuion: id,                                     
      });
      setFormData((prevState) => ({
        ...prevState,
        arrastrarPalabras: { 
          ...prevState.arrastrarPalabras, 
          idArrastrarPalabras: arrastrarPalabrasResponse.data.idArrastrarPalabras 
        },
      }));
    }

    // Actualizar elementos de arrastrar palabras
    await axios.delete(`http://localhost:8080/api/elementos-arrastrar-palabras/guion/${id}`);
    for (const elemento of formData.arrastrarPalabras.elementosArrastrarPalabras) {
      await axios.post('http://localhost:8080/api/elementos-arrastrar-palabras', {
        palabras: elemento.palabras,                             
        idArrastrarPalabras: formData.arrastrarPalabras.idArrastrarPalabras,  
      });
    }
  };

  const handleUpdateCuestionario = async () => {
    if (formData.cuestionario.idCuestionario) {
      // Actualizar cuestionario existente
      await axios.put(`http://localhost:8080/api/cuestionarios/${formData.cuestionario.idCuestionario}`, {
        idGuion: id,  
      });
    } else {
      // Crear nuevo cuestionario
      const cuestionarioResponse = await axios.post('http://localhost:8080/api/cuestionarios', {
        idGuion: id,  
      });
      setFormData((prevState) => ({
        ...prevState,
        cuestionario: { 
          ...prevState.cuestionario, 
          idCuestionario: cuestionarioResponse.data.idCuestionario 
        },
      }));
    }

    // Actualizar elementos del cuestionario
    await axios.delete(`http://localhost:8080/api/elementos-cuestionario/guion/${id}`);
    for (const elemento of formData.cuestionario.elementosCuestionario) {
      const elementoResponse = await axios.post('http://localhost:8080/api/elementos-cuestionario', {
        pregunta: elemento.pregunta,                                 
        tipoPregunta: tipoPreguntaMapInvertido[elemento.tipoPregunta],  
        idCuestionario: formData.cuestionario.idCuestionario,       
      });

      const elementoId = elementoResponse.data.idElementosCuestionario;

      for (const respuesta of elemento.respuestasCuestionario) {
        if (!respuesta.texto || typeof respuesta.correcta === 'undefined') {
          console.error('Faltan datos en la respuesta:', respuesta);
          continue; 
        }

        await axios.post('http://localhost:8080/api/respuestas-cuestionario', {
          texto: respuesta.texto,                                     
          correcta: respuesta.correcta ? 1 : 0,                      
          idElementosCuestionario: elementoId,                       
        });
      }
    }
  };

  const handleUpdateEleccionMultiple = async () => {
    if (formData.eleccionMultiple.idEleccionMultiple) {
      // Actualizar elección múltiple existente
      await axios.put(`http://localhost:8080/api/eleccion-multiple/${formData.eleccionMultiple.idEleccionMultiple}`, {
        idGuion: id,  
      });
    } else {
      // Crear nueva elección múltiple
      const eleccionMultipleResponse = await axios.post('http://localhost:8080/api/eleccion-multiple', {
        idGuion: id,  
      });
      setFormData((prevState) => ({
        ...prevState,
        eleccionMultiple: { 
          ...prevState.eleccionMultiple, 
          idEleccionMultiple: eleccionMultipleResponse.data.idEleccionMultiple 
        },
      }));
    }

    // Actualizar elementos de elección múltiple
    await axios.delete(`http://localhost:8080/api/elementos-eleccion-multiple/guion/${id}`);
    for (const elemento of formData.eleccionMultiple.elementosEleccionMultiple) {
      const elementoResponse = await axios.post('http://localhost:8080/api/elementos-eleccion-multiple', {
        pregunta: elemento.pregunta,                               
        idEleccionMultiple: formData.eleccionMultiple.idEleccionMultiple,  
      });

      const elementoId = elementoResponse.data.idElementosEleccionMultiple;

      for (const respuesta of elemento.respuestas) {
        await axios.post('http://localhost:8080/api/respuestas-eleccion-multiple', {
          textoRespuesta: respuesta.textoRespuesta,                   
          correcta: respuesta.correcta ? 1 : 0,                       
          idElementosEleccionMultiple: elementoId,                    
        });
      }
    }
  };

  const handleUpdatePresentacionCurso = async () => {
    if (formData.presentacionCurso.idPresentacionCurso) {
      // Actualizar presentación curso existente
      await axios.put(`http://localhost:8080/api/presentaciones-curso/${formData.presentacionCurso.idPresentacionCurso}`, {
        idGuion: id,  
      });
    } else {
      // Crear nueva presentación curso
      const presentacionCursoResponse = await axios.post('http://localhost:8080/api/presentaciones-curso', {
        idGuion: id,  
      });
      setFormData((prevState) => ({
        ...prevState,
        presentacionCurso: { 
          ...prevState.presentacionCurso, 
          idPresentacionCurso: presentacionCursoResponse.data.idPresentacionCurso 
        },
      }));
    }

    // Actualizar diapositivas
    await axios.delete(`http://localhost:8080/api/diapositivas/guion/${id}`);
    for (const diapositiva of formData.presentacionCurso.diapositivas) {
      await axios.post('http://localhost:8080/api/diapositivas', {
        descripcion: diapositiva.descripcion,           
        interacciones: diapositiva.interacciones,       
        idPresentacionCurso: formData.presentacionCurso.idPresentacionCurso,  
      });
    }
  };

  return (
    <div className="container mt-4">
      <Toast ref={toast} />
      <h2>Editar Guion</h2>
      <form onSubmit={handleSubmit}>
        {/* Campos Generales */}
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

        {/* Nota: Eliminado el campo de selección de 'estado' */}

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

        {/* Campos Específicos según el tipo de objeto */}
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
              {formData.videoInteractivo.elementos && formData.videoInteractivo.elementos.length > 0 ? (
                formData.videoInteractivo.elementos.map((elemento, index) => (
                  <div key={index} className="mb-2 border p-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Minuto del Video"
                      name="minutoVideo"
                      value={elemento.minutoVideo}
                      onChange={(e) => {
                        const updatedElementos = [...formData.videoInteractivo.elementos];
                        updatedElementos[index].minutoVideo = e.target.value;
                        setFormData({
                          ...formData,
                          videoInteractivo: { ...formData.videoInteractivo, elementos: updatedElementos },
                        });
                      }}
                      required
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Pregunta"
                      name="pregunta"
                      value={elemento.pregunta}
                      onChange={(e) => {
                        const updatedElementos = [...formData.videoInteractivo.elementos];
                        updatedElementos[index].pregunta = e.target.value;
                        setFormData({
                          ...formData,
                          videoInteractivo: { ...formData.videoInteractivo, elementos: updatedElementos },
                        });
                      }}
                      required
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Tipo de Pregunta"
                      name="tipoPregunta"
                      value={elemento.tipoPregunta}
                      onChange={(e) => {
                        const updatedElementos = [...formData.videoInteractivo.elementos];
                        updatedElementos[index].tipoPregunta = e.target.value;
                        setFormData({
                          ...formData,
                          videoInteractivo: { ...formData.videoInteractivo, elementos: updatedElementos },
                        });
                      }}
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
                ))
              ) : (
                <p>No hay elementos de video interactivo.</p>
              )}
              <button type="button" className="btn btn-secondary mt-2" onClick={addElementoVideo}>
                Agregar Elemento
              </button>
            </div>
          </>
        )}

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
              {formData.crucigrama.elementosCrucigrama && formData.crucigrama.elementosCrucigrama.length > 0 ? (
                formData.crucigrama.elementosCrucigrama.map((elemento, index) => (
                  <div key={index} className="mb-2 border p-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Pista"
                      name="pista"
                      value={elemento.pista}
                      onChange={(e) => {
                        const updatedElementos = [...formData.crucigrama.elementosCrucigrama];
                        updatedElementos[index].pista = e.target.value;
                        setFormData({
                          ...formData,
                          crucigrama: { ...formData.crucigrama, elementosCrucigrama: updatedElementos },
                        });
                      }}
                      required
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Pregunta"
                      name="pregunta"
                      value={elemento.pregunta}
                      onChange={(e) => {
                        const updatedElementos = [...formData.crucigrama.elementosCrucigrama];
                        updatedElementos[index].pregunta = e.target.value;
                        setFormData({
                          ...formData,
                          crucigrama: { ...formData.crucigrama, elementosCrucigrama: updatedElementos },
                        });
                      }}
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
                ))
              ) : (
                <p>No hay elementos de crucigrama.</p>
              )}
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
              {formData.arrastrarPalabras.elementosArrastrarPalabras &&
              formData.arrastrarPalabras.elementosArrastrarPalabras.length > 0 ? (
                formData.arrastrarPalabras.elementosArrastrarPalabras.map((elemento, index) => (
                  <div key={index} className="mb-2 border p-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Palabras"
                      name="palabras"
                      value={elemento.palabras}
                      onChange={(e) => {
                        const updatedElementos = [...formData.arrastrarPalabras.elementosArrastrarPalabras];
                        updatedElementos[index].palabras = e.target.value;
                        setFormData({
                          ...formData,
                          arrastrarPalabras: { ...formData.arrastrarPalabras, elementosArrastrarPalabras: updatedElementos },
                        });
                      }}
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
                ))
              ) : (
                <p>No hay elementos de arrastrar palabras.</p>
              )}
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

        {formData.tipoObjeto === 'cuestionario' && (
          <>
            <div className="form-group">
              <label>Elementos del Cuestionario</label>
              {formData.cuestionario.elementosCuestionario &&
              formData.cuestionario.elementosCuestionario.length > 0 ? (
                formData.cuestionario.elementosCuestionario.map((elemento, indexElemento) => (
                  <div key={indexElemento} className="mb-2 border p-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Pregunta"
                      name="pregunta"
                      value={elemento.pregunta}
                      onChange={(e) => handlePreguntaCuestionarioChange(indexElemento, e)}
                      required
                    />
                    <select
                      className="form-control mt-2"
                      name="tipoPregunta"
                      value={elemento.tipoPregunta}
                      onChange={(e) => handleTipoPreguntaCuestionarioChange(indexElemento, e)}
                      required
                    >
                      <option value="Abierta">Abierta</option>
                      <option value="Opción Múltiple">Opción Múltiple</option>
                    </select>
                    {elemento.tipoPregunta === 'Opción Múltiple' && (
                      <div className="mt-2">
                        <label>Respuestas</label>
                        {elemento.respuestasCuestionario &&
                        elemento.respuestasCuestionario.length > 0 ? (
                          elemento.respuestasCuestionario.map((respuesta, indexRespuesta) => (
                            <div key={indexRespuesta} className="mb-1">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Respuesta"
                                value={respuesta.texto}
                                onChange={(e) =>
                                  handleRespuestaCuestionarioChange(indexElemento, indexRespuesta, e)
                                }
                                required
                              />
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={respuesta.correcta}
                                  onChange={(e) =>
                                    handleCorrectaCuestionarioChange(indexElemento, indexRespuesta, e)
                                  }
                                  id={`cuestionario-${indexElemento}-respuesta-${indexRespuesta}`}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`cuestionario-${indexElemento}-respuesta-${indexRespuesta}`}
                                >
                                  Correcta
                                </label>
                              </div>
                              <button
                                type="button"
                                className="btn btn-danger mt-1"
                                onClick={() => removeRespuestaCuestionario(indexElemento, indexRespuesta)}
                              >
                                Eliminar Respuesta
                              </button>
                            </div>
                          ))
                        ) : (
                          <p>No hay respuestas disponibles.</p>
                        )}
                        <button
                          type="button"
                          className="btn btn-secondary mt-2"
                          onClick={() => addRespuestaCuestionario(indexElemento)}
                        >
                          Agregar Respuesta
                        </button>
                      </div>
                    )}
                    <button
                      type="button"
                      className="btn btn-danger mt-2"
                      onClick={() => removeElementoCuestionario(indexElemento)}
                    >
                      Eliminar Elemento
                    </button>
                  </div>
                ))
              ) : (
                <p>No hay elementos de cuestionario.</p>
              )}
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

        {formData.tipoObjeto === 'eleccionMultiple' && (
          <>
            <div className="form-group">
              <label>Elementos de Elección Múltiple</label>
              {formData.eleccionMultiple.elementosEleccionMultiple &&
              formData.eleccionMultiple.elementosEleccionMultiple.length > 0 ? (
                formData.eleccionMultiple.elementosEleccionMultiple.map((elemento, indexElemento) => (
                  <div key={indexElemento} className="mb-2 border p-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Pregunta"
                      name="pregunta"
                      value={elemento.pregunta}
                      onChange={(e) => handlePreguntaEleccionChange(indexElemento, e)}
                      required
                    />
                    <div className="mt-2">
                      <label>Respuestas</label>
                      {elemento.respuestas && elemento.respuestas.length > 0 ? (
                        elemento.respuestas.map((respuesta, indexRespuesta) => (
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
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={respuesta.correcta}
                                onChange={(e) =>
                                  handleCorrectaEleccionChange(indexElemento, indexRespuesta, e)
                                }
                                id={`eleccion-${indexElemento}-respuesta-${indexRespuesta}`}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`eleccion-${indexElemento}-respuesta-${indexRespuesta}`}
                              >
                                Correcta
                              </label>
                            </div>
                            <button
                              type="button"
                              className="btn btn-danger mt-1"
                              onClick={() => removeRespuestaEleccion(indexElemento, indexRespuesta)}
                            >
                              Eliminar Respuesta
                            </button>
                          </div>
                        ))
                      ) : (
                        <p>No hay respuestas disponibles.</p>
                      )}
                      <button
                        type="button"
                        className="btn btn-secondary mt-2"
                        onClick={() => addRespuestaEleccion(indexElemento)}
                      >
                        Agregar Respuesta
                      </button>
                    </div>
                    <button
                      type="button"
                      className="btn btn-danger mt-2"
                      onClick={() => removeElementoEleccionMultiple(indexElemento)}
                    >
                      Eliminar Elemento
                    </button>
                  </div>
                ))
              ) : (
                <p>No hay elementos de elección múltiple.</p>
              )}
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
              {formData.presentacionCurso.diapositivas && formData.presentacionCurso.diapositivas.length > 0 ? (
                formData.presentacionCurso.diapositivas.map((diapositiva, index) => (
                  <div key={index} className="mb-2 border p-2">
                    <textarea
                      className="form-control"
                      placeholder="Descripción"
                      name="descripcion"
                      value={diapositiva.descripcion}
                      onChange={(e) => handleDiapositivaChange(index, e)}
                      required
                    ></textarea>
                    <textarea
                      className="form-control mt-2"
                      placeholder="Interacciones"
                      name="interacciones"
                      value={diapositiva.interacciones}
                      onChange={(e) => handleDiapositivaChange(index, e)}
                    ></textarea>
                    <button
                      type="button"
                      className="btn btn-danger mt-1"
                      onClick={() => removeDiapositiva(index)}
                    >
                      Eliminar Diapositiva
                    </button>
                  </div>
                ))
              ) : (
                <p>No hay diapositivas.</p>
              )}
              <button type="button" className="btn btn-secondary mt-2" onClick={addDiapositiva}>
                Agregar Diapositiva
              </button>
            </div>
          </>
        )}

        {/* Botón para enviar el formulario */}
        <button type="submit" className="btn btn-primary mt-3">
          Actualizar Guion
        </button>
      </form>
    </div>
  );
};

export default EditarGuion;
