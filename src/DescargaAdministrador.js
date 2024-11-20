import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Paginator } from 'primereact/paginator';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';

const GestionObjetosCrud = () => {
    const [objetos, setObjetos] = useState([]);
    const [filteredObjetos, setFilteredObjetos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(9);
    const [selectedObjeto, setSelectedObjeto] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        const fetchObjetos = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/objetos-aprendizaje/');
                setObjetos(response.data);
                setFilteredObjetos(response.data);
            } catch (error) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al obtener los objetos de aprendizaje',
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
            obj.archivo.toLowerCase().includes(term)
        );
        setFilteredObjetos(filtered);
        setFirst(0);
    };

    const confirmDeleteObjeto = (obj) => {
        if (!obj || !obj.idObjetoAprendizaje) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'El objeto no tiene un ID válido.',
            });
            return;
        }
        setSelectedObjeto(obj);
        setShowDeleteDialog(true);
    };

    const deleteObjeto = async () => {
        if (!selectedObjeto || !selectedObjeto.idObjetoAprendizaje) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se seleccionó un objeto válido para eliminar.',
            });
            return;
        }

        try {
            await axios.delete(`http://localhost:8080/api/objetos-aprendizaje/${selectedObjeto.idObjetoAprendizaje}`);
            toast.current.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Objeto de aprendizaje eliminado correctamente',
            });
            setObjetos((prev) => prev.filter((obj) => obj.idObjetoAprendizaje !== selectedObjeto.idObjetoAprendizaje));
            setFilteredObjetos((prev) => prev.filter((obj) => obj.idObjetoAprendizaje !== selectedObjeto.idObjetoAprendizaje));
            setShowDeleteDialog(false);
            setSelectedObjeto(null);
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al eliminar el objeto de aprendizaje',
            });
        }
    };

    return (
        <div className="gestion-objetos-container">
            <Toast ref={toast} />
            <h2 className="text-center">Gestión de Objetos de Aprendizaje</h2>
            <div className="filters mb-4">
                <InputText
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Buscar por nombre de archivo..."
                    className="search-bar"
                />
            </div>
            <DataTable
                value={filteredObjetos.slice(first, first + rows)}
                paginator
                rows={rows}
                responsiveLayout="scroll"
                className="mt-4"
            >
                <Column field="idObjetoAprendizaje" header="ID" />
                <Column field="archivo" header="Nombre del Archivo" />
                <Column
                    header="Acciones"
                    body={(rowData) => (
                        <>
                            <Button
                                icon="pi pi-download"
                                className="p-button-rounded p-button-primary mr-2"
                                onClick={() => handleDownload(rowData.archivo)}
                            />
                            <Button
                                icon="pi pi-trash"
                                className="p-button-rounded p-button-danger"
                                onClick={() => confirmDeleteObjeto(rowData)}
                            />
                        </>
                    )}
                />
            </DataTable>

            {filteredObjetos.length === 0 && (
                <p className="text-center">No se encontraron objetos de aprendizaje.</p>
            )}

            <Dialog
                header="Confirmar Eliminación"
                visible={showDeleteDialog}
                style={{ width: '30vw' }}
                footer={
                    <>
                        <Button
                            label="No"
                            icon="pi pi-times"
                            className="p-button-text"
                            onClick={() => setShowDeleteDialog(false)}
                        />
                        <Button
                            label="Sí"
                            icon="pi pi-check"
                            className="p-button-danger"
                            onClick={deleteObjeto}
                        />
                    </>
                }
                onHide={() => setShowDeleteDialog(false)}
            >
                <p>¿Está seguro de que desea eliminar el objeto "{selectedObjeto?.archivo}"?</p>
            </Dialog>
        </div>
    );
};

export default GestionObjetosCrud;
