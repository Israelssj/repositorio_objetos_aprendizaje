import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Paginator } from 'primereact/paginator';
import { InputText } from 'primereact/inputtext';
import './Css/Descargas.css'; 

const DescargaCrud = () => {
    const [objetos, setObjetos] = useState([]);
    const [filteredObjetos, setFilteredObjetos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(9); 
    const toast = useRef(null);

    useEffect(() => {
        const fetchObjetos = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/objetos-aprendizaje/');
                setObjetos(response.data);
                setFilteredObjetos(response.data); 
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

        fetchObjetos();
    }, []);

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

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = objetos.filter((obj) =>
            (obj.archivo && obj.archivo.toLowerCase().includes(term)) ||
            (obj.guion && obj.guion.tipoObjeto && obj.guion.tipoObjeto.toLowerCase().includes(term)) ||
            (obj.guion && obj.guion.descripcion && obj.guion.descripcion.toLowerCase().includes(term)) ||
            (obj.guion && obj.guion.nombreMateria && obj.guion.nombreMateria.toLowerCase().includes(term))
        );
        setFilteredObjetos(filtered);
        setFirst(0); 
    };

    return (
        <div className="descargas-container">
            <Toast ref={toast} />
            <h2 className="text-center">Descargas de Objetos de Aprendizaje</h2>
            <div className="filters mb-4">
                <InputText
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Buscar por nombre, tipo, descripción o materia..."
                    className="search-bar"
                />
            </div>
            <div className="descargas-grid">
                {filteredObjetos.slice(first, first + rows).map((obj, index) => (
                    <div className="descarga-card" key={index}>
                        <div className="descarga-card-title">{obj.archivo}</div>
                        
                        {obj.guion && (
                            <div className="descarga-card-details">
                                <p><strong>Tipo:</strong> {obj.guion.tipoObjeto || 'N/A'}</p>
                                <p><strong>Descripción:</strong> {obj.guion.descripcion || 'N/A'}</p>
                                <p><strong>Materia:</strong> {obj.guion.nombreMateria || 'N/A'}</p>
                            </div>
                        )}
                        <Button
                            label="Descargar"
                            icon="pi pi-download"
                            className="p-button-primary"
                            onClick={() => handleDownload(obj.archivo)}
                        />
                    </div>
                ))}
            </div>
            {filteredObjetos.length > 0 && (
                <Paginator
                    first={first}
                    rows={rows}
                    totalRecords={filteredObjetos.length}
                    onPageChange={(e) => setFirst(e.first)}
                    className="mt-4"
                />
            )}
            {filteredObjetos.length === 0 && (
                <p className="text-center">No se encontraron objetos de aprendizaje.</p>
            )}
        </div>
    );
};

export default DescargaCrud;
