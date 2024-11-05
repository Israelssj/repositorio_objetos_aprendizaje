import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { useAuth } from './AuthContext';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const toast = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/auth/login', formData);
      if (response.status === 200) {
        login(response.data);  
        localStorage.setItem('user', JSON.stringify(response.data)); 
        toast.current.show({ severity: 'success', summary: 'Inicio de Sesión Exitoso', detail: `Bienvenido, ${response.data.nombreUsuario}`, life: 3000 });
        navigate('/roles');
      } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Credenciales incorrectas', life: 3000 });
      }
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al iniciar sesión', life: 3000 });
    }
  };

  return (
    <div className="container mt-5">
      <Toast ref={toast} />
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Iniciar Sesión</button>
      </form>
    </div>
  );
}

export default Login;