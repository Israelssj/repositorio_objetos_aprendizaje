import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import './Css/Login.css';

function Register() {
  const [formData, setFormData] = useState({
    nombreUsuario: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    email: '',
    password: '',
    rolId: ''
  });

  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:8080/rol/registro')
      .then((response) => {
        const filteredRoles = response.data.filter((rol) => rol.nombreRol.toLowerCase() !== 'administrador');
        setRoles(filteredRoles);
      })
      .catch((error) => console.error('Error al obtener los roles:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target || {};
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombreUsuario) newErrors.nombreUsuario = 'El nombre es obligatorio.';
    if (!formData.apellidoPaterno) newErrors.apellidoPaterno = 'El apellido paterno es obligatorio.';
    if (!formData.apellidoMaterno) newErrors.apellidoMaterno = 'El apellido materno es obligatorio.';
    if (!formData.email) newErrors.email = 'El correo electrónico es obligatorio.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'El correo electrónico no es válido.';
    if (!formData.password) newErrors.password = 'La contraseña es obligatoria.';
    if (!formData.rolId) newErrors.rolId = 'Selecciona un rol.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Revisa los campos faltantes.', life: 3000 });
      return;
    }

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

      const response = await axios.post('http://localhost:8080/usuario/register', newUser);
      if (response.status === 201) {
        toast.current.show({
          severity: 'success',
          summary: 'Registro Exitoso',
          detail: 'Usuario registrado con éxito',
          life: 3000
        });
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      console.error('Error durante el registro:', error);
      const errorMsg = error.response?.data || 'Error al registrar usuario';
      toast.current.show({ severity: 'error', summary: 'Error', detail: errorMsg, life: 3000 });
    }
  };

  return (
    <div className="register-container flex justify-content-center align-items-center min-h-screen bg-gray-50">
      <Toast ref={toast} />
      <div className="login-box">
        <h2 className="login-title">Registrar Usuario</h2>
        <form onSubmit={handleRegister} className="login-form">
          <label htmlFor="nombreUsuario" className="input-label">Nombre</label>
          <InputText
            id="nombreUsuario"
            name="nombreUsuario"
            value={formData.nombreUsuario}
            onChange={handleChange}
            placeholder="Escribe tu nombre"
            className={`input-field ${errors.nombreUsuario ? 'p-invalid' : ''}`}
          />
          {errors.nombreUsuario && <small className="p-error">{errors.nombreUsuario}</small>}

          <label htmlFor="apellidoPaterno" className="input-label">Apellido Paterno</label>
          <InputText
            id="apellidoPaterno"
            name="apellidoPaterno"
            value={formData.apellidoPaterno}
            onChange={handleChange}
            placeholder="Escribe tu apellido paterno"
            className={`input-field ${errors.apellidoPaterno ? 'p-invalid' : ''}`}
          />
          {errors.apellidoPaterno && <small className="p-error">{errors.apellidoPaterno}</small>}

          <label htmlFor="apellidoMaterno" className="input-label">Apellido Materno</label>
          <InputText
            id="apellidoMaterno"
            name="apellidoMaterno"
            value={formData.apellidoMaterno}
            onChange={handleChange}
            placeholder="Escribe tu apellido materno"
            className={`input-field ${errors.apellidoMaterno ? 'p-invalid' : ''}`}
          />
          {errors.apellidoMaterno && <small className="p-error">{errors.apellidoMaterno}</small>}

          <label htmlFor="email" className="input-label">Correo electrónico</label>
          <InputText
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
            className={`input-field ${errors.email ? 'p-invalid' : ''}`}
          />
          {errors.email && <small className="p-error">{errors.email}</small>}

          <label htmlFor="password" className="input-label">Contraseña</label>
          <div className="password-wrapper">
            <InputText
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Escribe una contraseña segura"
              className={`input-field ${errors.password ? 'p-invalid' : ''}`}
            />
            <Button
              icon={showPassword ? "pi pi-eye-slash" : "pi pi-eye"}
              onClick={() => setShowPassword(!showPassword)}
              type="button"
              className="toggle-password"
              aria-label="Mostrar/Ocultar contraseña"
            />
          </div>
          {errors.password && <small className="p-error">{errors.password}</small>}

          <label htmlFor="rolId" className="input-label">Rol</label>
          <Dropdown
            id="rolId"
            name="rolId"
            value={formData.rolId}
            options={roles.map((rol) => ({ label: rol.nombreRol, value: rol.idRol }))}
            onChange={(e) => setFormData({ ...formData, rolId: e.value })}
            placeholder="Seleccione un rol"
            className={`input-field ${errors.rolId ? 'p-invalid' : ''}`}
          />
          {errors.rolId && <small className="p-error">{errors.rolId}</small>}

          <Button
            label="Registrar"
            icon="pi pi-user"
            className="login-button"
            type="submit"
          />
        </form>
      </div>
    </div>
  );
}

export default Register;
