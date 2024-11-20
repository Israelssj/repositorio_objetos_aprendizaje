import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useAuth } from './AuthContext';
import api from './axiosConfig';
import './Css/Login.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', formData);
      if (response.status === 200 && response.data.token) {
        login(response.data);
        toast.current.show({
          severity: 'success',
          summary: 'Inicio de Sesión Exitoso',
          detail: `Bienvenido, ${response.data.user.nombre}`,
          life: 3000
        });
        navigate('/');
      } else {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Credenciales incorrectas',
          life: 3000
        });
      }
    } catch (error) {
      const errorMessage = error.response?.status === 401
        ? 'Credenciales inválidas. Por favor, verifica tus datos.'
        : 'Error al iniciar sesión. Intenta nuevamente.';
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 3000
      });
    }
  };

  return (
    <div className="login-container">
      <Toast ref={toast} />
      <div className="login-box">
        <h2 className="login-title">Bienvenido</h2>
        <p className="login-subtitle">Inicia sesión para acceder a la plataforma educativa</p>
        <form onSubmit={handleLogin} className="login-form">
          <label htmlFor="email" className="input-label">Correo electrónico</label>
          <InputText
            id="email"
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Ingrese su correo"
            className="input-field"
          />
          <label htmlFor="password" className="input-label">Contraseña</label>
          <div className="password-wrapper">
            <InputText
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingrese su contraseña"
              className="input-field"
            />
            <Button
              icon={showPassword ? "pi pi-eye-slash" : "pi pi-eye"}
              onClick={() => setShowPassword(!showPassword)}
              type="button"
              className="toggle-password"
              aria-label="Mostrar/Ocultar contraseña"
            />
          </div>
          <Button
            label="Iniciar Sesión"
            icon="pi pi-sign-in"
            className="login-button"
            type="submit"
          />
        </form>
      </div>
    </div>
  );
}

export default Login;
