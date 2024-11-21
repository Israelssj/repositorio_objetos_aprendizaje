import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import './Css/App.css'; 

const ObjetoAprendizajeCrud = () => {
    const [objetos, setObjetos] = useState([]);
    const [guionesAprobados, setGuionesAprobados] = useState([]);
    const [selectedGuion, setSelectedGuion] = useState(null);
    const toast = useRef(null);

    useEffect(() => {
        const fetchObjetos = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/objetos-aprendizaje/');
                setObjetos(response.data);
            } catch (error) {
                console.error('Error al obtener objetos de aprendizaje:', error);
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron obtener los objetos de aprendizaje.',
                    life: 3000,
                });
            }
        };

        const fetchGuionesAprobados = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/guiones/aprobados');
                setGuionesAprobados(response.data);
            } catch (error) {
                console.error('Error al obtener guiones aprobados:', error);
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron obtener los guiones aprobados.',
                    life: 3000,
                });
            }
        };

        fetchObjetos();
        fetchGuionesAprobados();
    }, []);

    const onUpload = async (event) => {
        if (!selectedGuion) {
            toast.current.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe seleccionar un guion aprobado antes de subir un archivo.',
                life: 3000,
            });
            return;
        }

        const file = event.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('idGuion', selectedGuion.idGuion);

        try {
            const response = await axios.post('http://localhost:8080/api/objetos-aprendizaje/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.current.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Archivo subido y guion publicado correctamente',
                life: 3000,
            });

           
            setObjetos([...objetos, response.data]);

            
            setGuionesAprobados(guionesAprobados.filter(g => g.idGuion !== selectedGuion.idGuion));
            setSelectedGuion(null);
        } catch (error) {
            console.error('Error al subir el archivo:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Ocurrió un error al subir el archivo.',
                life: 3000,
            });
        }
    };

    const handleDownload = (fileName) => {
        axios({
            url: `http://localhost:8080/api/objetos-aprendizaje/descargar/${fileName}`,
            method: 'GET',
            responseType: 'blob',
        })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
                toast.current.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Archivo descargado correctamente',
                });
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al descargar el archivo',
                });
            });
    };

    return (
        <div className="container">
            <Toast ref={toast} />
            <h2 className="title">Subir Objeto de Aprendizaje</h2>
            
            {/* Selección de Guion Aprobado */}
            <div className="form-group">
                <label htmlFor="guionDropdown" className="form-label">Seleccionar Guion Aprobado</label>
                <Dropdown
                    id="guionDropdown"
                    value={selectedGuion}
                    options={guionesAprobados}
                    onChange={(e) => setSelectedGuion(e.value)}
                    optionLabel="titulo"
                    placeholder="Seleccione un guion aprobado"
                    className="dropdown mb-3"
                    required
                />
            </div>

            {/* Formulario de Subida */}
            <Card className="upload-card">
                <FileUpload
                    name="file"
                    accept=".h5p,.pdf,.doc,.docx,.ppt,.pptx,.zip,.rar"
                    maxFileSize={10000000} 
                    customUpload
                    uploadHandler={onUpload}
                    auto
                    chooseLabel="Seleccionar archivo"
                    uploadLabel="Subir"
                    cancelLabel="Cancelar"
                    disabled={!selectedGuion}
                    className="file-upload"
                />
                {!selectedGuion && (
                    <small className="warning-text">Seleccione un guion aprobado antes de subir un archivo.</small>
                )}
            </Card>

            {/* Objetos de Aprendizaje Recientes */}
            <h3 className="subtitle">Objeto de Aprendizaje Subido Recientemente</h3>
            <div className="recent-uploads">
                {objetos.slice(-1).map((obj, index) => (
                    <Card title={<div className="card-title">{obj.archivo}</div>} className="recent-card" key={index}>
                        <p>
                            <strong>Estado:</strong> {obj.guion && obj.guion.estado ? obj.guion.estado : 'Pendiente'}
                        </p>
                        <Button
                            label="Descargar"
                            icon="pi pi-download"
                            className="download-button"
                            onClick={() => handleDownload(obj.archivo)}
                        />
                    </Card>
                ))}
            </div>

            {objetos.length === 0 && (
                <p className="no-uploads">No se encontraron objetos de aprendizaje subidos.</p>
            )}
        </div>
    );
};

export default ObjetoAprendizajeCrud;
