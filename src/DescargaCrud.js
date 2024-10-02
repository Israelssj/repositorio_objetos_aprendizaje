import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const DescargaCrud = () => {
    const [descargas, setDescargas] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef(null);

    useEffect(() => {
        fetchDescargas();
    }, []);

    const fetchDescargas = async () => {
        try {
            const response = await axios.get('http://localhost:8080/descarga');
            setDescargas(response.data);
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al obtener descargas', life: 3000 });
        }
    };

    const handleSearch = (e) => {
        setGlobalFilter(e.target.value);
    };

    return (
        <div className="container mt-4">
            <Toast ref={toast} />
            <h2 className="text-center">Gestión de Descargas</h2>
            <div className="p-inputgroup mb-3">
                <InputText placeholder="Buscar..." value={globalFilter} onChange={handleSearch} />
                <Button icon="pi pi-search" />
            </div>
            <DataTable value={descargas} paginator rows={10} globalFilter={globalFilter} responsiveLayout="scroll" className="p-datatable-striped">
                <Column field="idDescarga" header="ID Descarga" sortable filter />
                <Column field="fecha" header="Fecha" sortable filter />
                <Column field="usuario.nombreUsuario" header="Usuario" sortable filter />
                <Column field="objetoAprendizaje.archivo" header="Archivo Subido" sortable filter />
                <Column field="objetoAprendizaje.fecha" header="Fecha Subida" sortable filter />
            </DataTable>
        </div>
    );
};

export default DescargaCrud;
