import React, { useState } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';

const ObjetoAprendizajeCrud = () => {
    const [objetos, setObjetos] = useState([]);
    const toast = React.useRef(null);

    const onUpload = async (event) => {
        const file = event.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8080/api/objetos-aprendizaje/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Archivo subido correctamente' });
            setObjetos([...objetos, response.data]);
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al subir el archivo' });
        }
    };

    return (
        <div className="container mt-4">
            <Toast ref={toast} />
            <h2>Subir Objeto de Aprendizaje</h2>
            <FileUpload name="file" accept=".h5p" maxFileSize={10000000} customUpload uploadHandler={onUpload} auto />
            <h3 className="mt-4">Objetos de Aprendizaje Subidos</h3>
            <ul>
                {objetos.map((obj, index) => (
                    <li key={index}>{obj.archivo}</li>
                ))}
            </ul>
        </div>
    );
};

export default ObjetoAprendizajeCrud;
