import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const NoAutorizado = () => {
  const [visible, setVisible] = useState(true);

  return (
    <div className="min-h-screen flex justify-content-center align-items-center bg-gray-50">
      <Dialog
        header="Acceso Denegado"
        visible={visible}
        style={{ width: '30vw' }}
        onHide={() => setVisible(false)}
      >
        <p>No tienes permiso para acceder a esta página.</p>
        <Button
          label="Ir al Inicio"
          icon="pi pi-home"
          className="p-button-text"
          onClick={() => (window.location.href = '/')}
        />
      </Dialog>
    </div>
  );
};

export default NoAutorizado;
