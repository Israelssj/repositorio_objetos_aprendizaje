import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import axios from 'axios';

const RolCrud = () => {
    const [roles, setRoles] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [currentRol, setCurrentRol] = useState({ idRol: null, nombreRol: '', descripcion: '' });
    const toast = useRef(null);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await axios.get('http://localhost:8080/rol');
            setRoles(response.data);
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al obtener roles', life: 3000 });
        }
    };

    const saveRol = async () => {
        if (!currentRol.nombreRol || !currentRol.descripcion) {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Todos los campos son obligatorios', life: 3000 });
            return;
        }

        try {
            if (currentRol.idRol) {
                await axios.put(`http://localhost:8080/rol/${currentRol.idRol}`, currentRol);
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Rol actualizado correctamente', life: 3000 });
            } else {
                await axios.post('http://localhost:8080/rol', currentRol);
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Rol creado correctamente', life: 3000 });
            }
            fetchRoles();
            setShowDialog(false);
            setCurrentRol({ idRol: null, nombreRol: '', descripcion: '' });
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al guardar el rol', life: 3000 });
        }
    };

    const deleteRol = async (idRol) => {
        try {
            await axios.delete(`http://localhost:8080/rol/${idRol}`);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Rol eliminado correctamente', life: 3000 });
            fetchRoles();
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el rol', life: 3000 });
        }
    };

    const editRol = (rol) => {
        setCurrentRol(rol);
        setShowDialog(true);
    };

    const openNew = () => {
        setCurrentRol({ idRol: null, nombreRol: '', descripcion: '' });
        setShowDialog(true);
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <h2>Gestión de Roles</h2>
            <Button label="Nuevo Rol" icon="pi pi-plus" onClick={openNew} />
            <DataTable value={roles} responsiveLayout="scroll" className="mt-4">
                <Column field="idRol" header="ID" />
                <Column field="nombreRol" header="Nombre del Rol" />
                <Column field="descripcion" header="Descripción" />
                <Column
                    header="Acciones"
                    body={(rowData) => (
                        <>
                            <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning mr-2" onClick={() => editRol(rowData)} />
                            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteRol(rowData.idRol)} />
                        </>
                    )}
                />
            </DataTable>

            <Dialog visible={showDialog} header={currentRol.idRol ? 'Editar Rol' : 'Nuevo Rol'} modal onHide={() => setShowDialog(false)}>
                <div className="p-fluid">
                    <div className="field">
                        <label htmlFor="nombreRol">Nombre del Rol</label>
                        <InputText id="nombreRol" value={currentRol.nombreRol} onChange={(e) => setCurrentRol({ ...currentRol, nombreRol: e.target.value })} />
                    </div>
                    <div className="field">
                        <label htmlFor="descripcion">Descripción</label>
                        <InputText id="descripcion" value={currentRol.descripcion} onChange={(e) => setCurrentRol({ ...currentRol, descripcion: e.target.value })} />
                    </div>
                </div>
                <Button label="Guardar" icon="pi pi-check" onClick={saveRol} autoFocus />
            </Dialog>
        </div>
    );
};

export default RolCrud;
