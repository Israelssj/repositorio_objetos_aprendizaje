import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import { Toast } from 'primereact/toast';
import axios from 'axios';

const EvaluacionCrud = () => {
    const [evaluaciones, setEvaluaciones] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentEvaluacion, setCurrentEvaluacion] = useState({ idEvaluacion: null, nota: '', comentario: '' });
    const toast = useRef(null);

    useEffect(() => {
        fetchEvaluaciones();
    }, []);

    const fetchEvaluaciones = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/evaluaciones/');
            setEvaluaciones(response.data);
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al obtener evaluaciones', life: 3000 });
        }
    };

    const handleSaveEvaluacion = async () => {
        if (!currentEvaluacion.nota) {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'La nota es obligatoria', life: 3000 });
            return;
        }

        try {
            if (currentEvaluacion.idEvaluacion) {
                await axios.put(`http://localhost:8080/api/evaluaciones/${currentEvaluacion.idEvaluacion}`, currentEvaluacion);
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Evaluación actualizada correctamente', life: 3000 });
            } else {
                await axios.post('http://localhost:8080/api/evaluaciones/', currentEvaluacion);
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Evaluación creada correctamente', life: 3000 });
            }
            fetchEvaluaciones();
            setShowModal(false);
            setCurrentEvaluacion({ idEvaluacion: null, nota: '', comentario: '' });
        } catch (error) {
            console.error("Error saving evaluacion:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al guardar la evaluación', life: 3000 });
        }
    };

    const handleDeleteEvaluacion = async (evaluacionId) => {
        try {
            await axios.delete(`http://localhost:8080/api/evaluaciones/${evaluacionId}`);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Evaluación eliminada correctamente', life: 3000 });
            fetchEvaluaciones();
        } catch (error) {
            console.error("Error deleting evaluacion:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar la evaluación', life: 3000 });
        }
    };

    const handleEditEvaluacion = (evaluacion) => {
        setCurrentEvaluacion(evaluacion);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setCurrentEvaluacion({ idEvaluacion: null, nota: '', comentario: '' });
    };

    return (
        <div className="container mt-4">
            <Toast ref={toast} />
            <h2>Gestión de Evaluaciones</h2>
            <Button variant="primary" onClick={() => setShowModal(true)}>Nueva Evaluación</Button>
            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nota</th>
                        <th>Comentario</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {evaluaciones.map(evaluacion => (
                        <tr key={evaluacion.idEvaluacion}>
                            <td>{evaluacion.idEvaluacion}</td>
                            <td>{evaluacion.nota}</td>
                            <td>{evaluacion.comentario}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleEditEvaluacion(evaluacion)}>Editar</Button>
                                <Button variant="danger" onClick={() => handleDeleteEvaluacion(evaluacion.idEvaluacion)}>Borrar</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentEvaluacion.idEvaluacion ? 'Editar Evaluación' : 'Nueva Evaluación'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="nota">
                            <Form.Label>Nota</Form.Label>
                            <Form.Control
                                type="number"
                                value={currentEvaluacion.nota}
                                onChange={(e) => setCurrentEvaluacion({ ...currentEvaluacion, nota: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="comentario">
                            <Form.Label>Comentario</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentEvaluacion.comentario}
                                onChange={(e) => setCurrentEvaluacion({ ...currentEvaluacion, comentario: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>Cancelar</Button>
                    <Button variant="primary" onClick={handleSaveEvaluacion}>Guardar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default EvaluacionCrud;
