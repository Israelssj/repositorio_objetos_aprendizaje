import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function Register() {
  const [formData, setFormData] = useState({
    nombreUsuario: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    email: '',
    password: '',
    rolId: '' 
  });
  
  const [roles, setRoles] = useState([]); 
  const toast = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    
    axios.get('http://localhost:8080/rol')
      .then(response => setRoles(response.data))
      .catch(error => console.error('Error al obtener los roles:', error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const newUser = {
        nombreUsuario: formData.nombreUsuario,
        apellidoPaterno: formData.apellidoPaterno,
        apellidoMaterno: formData.apellidoMaterno,
        email: formData.email,
        password: formData.password,
        rol: {
          idRol: formData.rolId  
        }
      };

      const response = await axios.post('http://localhost:8080/usuario', newUser);
      if (response.status === 201) {
        toast.current.show({ severity: 'success', summary: 'Registro Exitoso', detail: 'Usuario registrado con éxito', life: 3000 });
        setTimeout(() => {
          navigate('/login');  
        }, 3000);  
      }
    } catch (error) {
      console.error('Error durante el registro:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al registrar usuario', life: 3000 });
    }
  };

  return (
    <div className="container mt-5">
      <Toast ref={toast} />
      <h2>Registrar Usuario</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Nombre</label>
          <input type="text" className="form-control" name="nombreUsuario" value={formData.nombreUsuario} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Apellido Paterno</label>
          <input type="text" className="form-control" name="apellidoPaterno" value={formData.apellidoPaterno} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Apellido Materno</label>
          <input type="text" className="form-control" name="apellidoMaterno" value={formData.apellidoMaterno} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Rol</label>
          <select className="form-control" name="rolId" value={formData.rolId} onChange={handleChange} required>
            <option value="">Seleccione un rol</option>
            {roles.map(rol => (
              <option key={rol.idRol} value={rol.idRol}>{rol.nombreRol}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary mt-3">Registrar</button>
      </form>
    </div>
  );
}

export default Register;
