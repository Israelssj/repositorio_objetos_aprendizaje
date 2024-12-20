import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { Toast } from 'primereact/toast';
import axios from 'axios';

const UsuarioCrud = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [filteredUsuarios, setFilteredUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentUsuario, setCurrentUsuario] = useState({
        idUsuario: null,
        nombreUsuario: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        email: '',
        password: '',
        rol: { idRol: '', nombreRol: '' }
    });
    const [errors, setErrors] = useState({});
    const toast = useRef(null);

    useEffect(() => {
        fetchUsuarios();
        fetchRoles();
    }, []);

    const fetchUsuarios = async () => {
        try {
            const response = await axios.get('http://localhost:8080/usuario', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            const usuariosData = Array.isArray(response.data) ? response.data : [];
            setUsuarios(usuariosData);
            setFilteredUsuarios(usuariosData); 
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al obtener usuarios', life: 3000 });
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await axios.get('http://localhost:8080/rol', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            setRoles(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error al obtener roles:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al obtener roles', life: 3000 });
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        // Filtro usuarios 
        const filtered = usuarios.filter(usuario =>
            usuario.nombreUsuario.toLowerCase().includes(term) ||
            usuario.apellidoPaterno.toLowerCase().includes(term) ||
            usuario.email.toLowerCase().includes(term) ||
            (usuario.rol && usuario.rol.nombreRol.toLowerCase().includes(term))
        );
        setFilteredUsuarios(filtered);
    };

    const validateForm = () => {
        const formErrors = {};
        if (!currentUsuario.nombreUsuario) formErrors.nombreUsuario = 'El nombre es requerido';
        if (!currentUsuario.apellidoPaterno) formErrors.apellidoPaterno = 'El apellido paterno es requerido';
        if (!currentUsuario.apellidoMaterno) formErrors.apellidoMaterno = 'El apellido materno es requerido';
        if (!currentUsuario.email) {
            formErrors.email = 'El correo electrónico es requerido';
        } else if (!/\S+@\S+\.\S+/.test(currentUsuario.email)) {
            formErrors.email = 'El correo electrónico no es válido';
        }
        if (!currentUsuario.password && !currentUsuario.idUsuario) {
            formErrors.password = 'La contraseña es requerida';
        }
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSaveUsuario = async () => {
        if (!validateForm()) return;

        const usuarioData = {
            nombreUsuario: currentUsuario.nombreUsuario,
            apellidoPaterno: currentUsuario.apellidoPaterno,
            apellidoMaterno: currentUsuario.apellidoMaterno,
            email: currentUsuario.email,
            password: currentUsuario.password || undefined, 
            rol: currentUsuario.rol ? { idRol: currentUsuario.rol.idRol } : null
        };

        try {
            if (currentUsuario.idUsuario) {
                await axios.put(`http://localhost:8080/usuario/${currentUsuario.idUsuario}`, usuarioData, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado correctamente', life: 3000 });
            } else {
                await axios.post('http://localhost:8080/usuario/register', usuarioData, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado correctamente', life: 3000 });
            }
            fetchUsuarios();
            setShowModal(false);
            resetCurrentUsuario();
        } catch (error) {
            console.error('Error saving usuario:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al guardar el usuario', life: 3000 });
        }
    };

    const handleDeleteUsuario = async (usuarioId) => {
        try {
            await axios.delete(`http://localhost:8080/usuario/${usuarioId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario eliminado correctamente', life: 3000 });
            fetchUsuarios();
        } catch (error) {
            console.error('Error deleting usuario:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el usuario', life: 3000 });
        }
    };

    const handleEditUsuario = (usuario) => {
        setCurrentUsuario({ 
            ...usuario, 
            rol: usuario.rol || { idRol: '', nombreRol: '' }, 
            password: '' 
        });
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        resetCurrentUsuario();
        setErrors({});
    };

    const resetCurrentUsuario = () => {
        setCurrentUsuario({
            idUsuario: null,
            nombreUsuario: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            email: '',
            password: '',
            rol: { idRol: '', nombreRol: '' }
        });
    };

    return (
        <div className="container mt-4">
            <Toast ref={toast} />
            <h2>Gestión de Usuarios</h2>
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar usuario por nombre, apellido, email o rol..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <Button variant="primary" onClick={() => setShowModal(true)}>Nuevo Usuario</Button>
            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido Paterno</th>
                        <th>Apellido Materno</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsuarios.map(usuario => (
                        <tr key={usuario.idUsuario}>
                            <td>{usuario.idUsuario}</td>
                            <td>{usuario.nombreUsuario}</td>
                            <td>{usuario.apellidoPaterno}</td>
                            <td>{usuario.apellidoMaterno}</td>
                            <td>{usuario.email}</td>
                            <td>{usuario.rol ? usuario.rol.nombreRol : "Sin rol"}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleEditUsuario(usuario)}>Editar</Button>{' '}
                                <Button variant="danger" onClick={() => handleDeleteUsuario(usuario.idUsuario)}>Eliminar</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentUsuario.idUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={currentUsuario.nombreUsuario} 
                                onChange={(e) => setCurrentUsuario({ ...currentUsuario, nombreUsuario: e.target.value })} 
                                isInvalid={!!errors.nombreUsuario} 
                            />
                            <Form.Control.Feedback type="invalid">{errors.nombreUsuario}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formApellidoPaterno">
                            <Form.Label>Apellido Paterno</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={currentUsuario.apellidoPaterno} 
                                onChange={(e) => setCurrentUsuario({ ...currentUsuario, apellidoPaterno: e.target.value })} 
                                isInvalid={!!errors.apellidoPaterno} 
                            />
                            <Form.Control.Feedback type="invalid">{errors.apellidoPaterno}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formApellidoMaterno">
                            <Form.Label>Apellido Materno</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={currentUsuario.apellidoMaterno} 
                                onChange={(e) => setCurrentUsuario({ ...currentUsuario, apellidoMaterno: e.target.value })} 
                                isInvalid={!!errors.apellidoMaterno} 
                            />
                            <Form.Control.Feedback type="invalid">{errors.apellidoMaterno}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                type="email" 
                                value={currentUsuario.email} 
                                onChange={(e) => setCurrentUsuario({ ...currentUsuario, email: e.target.value })} 
                                isInvalid={!!errors.email} 
                            />
                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control 
                                type="password" 
                                value={currentUsuario.password} 
                                onChange={(e) => setCurrentUsuario({ ...currentUsuario, password: e.target.value })} 
                                isInvalid={!!errors.password} 
                            />
                            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formRol">
                            <Form.Label>Rol</Form.Label>
                            <Form.Control 
                                as="select" 
                                value={currentUsuario.rol?.idRol || ''} 
                                onChange={(e) => setCurrentUsuario({ ...currentUsuario, rol: roles.find(rol => rol.idRol === parseInt(e.target.value)) || { idRol: '', nombreRol: '' } })}
                            >
                                <option value="">Seleccionar rol</option>
                                {roles.map(rol => (
                                    <option key={rol.idRol} value={rol.idRol}>{rol.nombreRol}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>Cancelar</Button>
                    <Button variant="primary" onClick={handleSaveUsuario}>{currentUsuario.idUsuario ? 'Actualizar' : 'Guardar'}</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UsuarioCrud;
