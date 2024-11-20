import React from 'react';
import ReactDOM from 'react-dom/client';
import './Css/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './AuthContext';  


import 'primereact/resources/themes/saga-blue/theme.css'; // Tema de PrimeReact
import 'primereact/resources/primereact.min.css';        // Estilos generales de PrimeReact
import 'primeicons/primeicons.css';                     // Iconos de PrimeReact
import 'primeflex/primeflex.css';                       // Sistema de clases CSS de PrimeReact
import 'bootstrap/dist/css/bootstrap.min.css';             // Bootstrap
import "bootstrap/dist/css/bootstrap.min.css"; // 
import "bootstrap/dist/js/bootstrap.bundle.min.js"; 


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>  
      <App />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
