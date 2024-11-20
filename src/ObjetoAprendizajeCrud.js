import React, { useState } from 'react';
import axios from 'axios';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Paginator } from 'primereact/paginator';
import './Css/App.css'; 

const ObjetoAprendizajeCrud = () => {
    const [objetos, setObjetos] = useState([]);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10); 
    const toast = React.useRef(null);

    const onUpload = async (event) => {
        const file = event.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8080/api/objetos-aprendizaje/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.current.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Archivo subido correctamente',
            });
            setObjetos([...objetos, { ...response.data, estado: 'Subido correctamente' }]);
        } catch (error) {
            console.error('Error al subir el archivo:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al subir el archivo',
            });
        }
    };

    return (
        <div className="container mt-4">
            <Toast ref={toast} />
            <h2 className="text-center">Subir Objeto de Aprendizaje</h2>
            <Card className="mb-4">
                <FileUpload
                    name="file"
                    accept=".h5p"
                    maxFileSize={10000000}
                    customUpload
                    uploadHandler={onUpload}
                    auto
                    chooseLabel="Seleccionar archivo"
                    uploadLabel="Subir"
                    cancelLabel="Cancelar"
                />
            </Card>

            <h3 className="text-center">Objetos de Aprendizaje Subidos</h3>
            <div className="grid">
                {objetos.slice(first, first + rows).map((obj, index) => (
                    <div className="col-12 md:col-4" key={index}>
                        <Card title={obj.archivo} className="mb-4 card-style">
                            <p>
                                <strong>Estado:</strong> {obj.estado || 'Pending'}
                            </p>
                        </Card>
                    </div>
                ))}
            </div>

            {objetos.length > 0 && (
                <Paginator
                    first={first}
                    rows={rows}
                    totalRecords={objetos.length}
                    onPageChange={(e) => setFirst(e.first)}
                    className="mt-4"
                />
            )}
            {objetos.length === 0 && (
                <p className="text-center">No se encontraron objetos de aprendizaje subidos.</p>
            )}
        </div>
    );
};

export default ObjetoAprendizajeCrud;
