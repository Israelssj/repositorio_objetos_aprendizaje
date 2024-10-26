import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

const DescargaCrud = () => {
    const [objetos, setObjetos] = useState([]);
    const toast = React.useRef(null);

    useEffect(() => {
        const fetchObjetos = async () => {
            const response = await axios.get('http://localhost:8080/api/objetos-aprendizaje/');
            setObjetos(response.data);
        };

        fetchObjetos();
    }, []);

    const handleDownload = (fileName) => {
        axios({
            url: `http://localhost:8080/api/objetos-aprendizaje/descargar/${fileName}`,
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Archivo descargado correctamente' });
        }).catch((error) => {
            console.error('Error downloading file:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al descargar el archivo' });
        });
    };

    return (
        <div className="container mt-4">
            <Toast ref={toast} />
            <h2 className="text-center">Descargas de Objetos de Aprendizaje</h2>
            <div className="grid">
                {objetos.map((obj, index) => (
                    <div className="col-12 md:col-4" key={index}>
                        <Card title={obj.archivo} className="mb-4">
                            <Button label="Descargar" icon="pi pi-download" onClick={() => handleDownload(obj.archivo)} />
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DescargaCrud;
