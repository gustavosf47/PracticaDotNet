import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, ListGroup } from 'react-bootstrap';

export const Index = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [newUsuario, setNewUsuario] = useState({ nombre: '', correo: '' });
  const [editUsuario, setEditUsuario] = useState({ id: null, nombre: '', correo: '' });

  // Fetch usuarios al cargar el componente
  useEffect(() => {
    fetch('http://localhost:5049/api/usuarios') // URL de tu API
      .then(response => response.json())
      .then(data => setUsuarios(data))
      .catch(error => console.error('Error fetching usuarios:', error));
  }, []);

  // Crear un nuevo usuario
  const handleCreate = () => {
    fetch('http://localhost:5049/api/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUsuario),
    })
      .then(response => response.json())
      .then(data => {
        setUsuarios([...usuarios, data]); // Agrega el nuevo usuario a la lista
        setNewUsuario({ nombre: '', correo: '' }); // Limpia el formulario
      })
      .catch(error => console.error('Error creating usuario:', error));
  };

  // Actualizar un usuario
  const handleUpdate = () => {
    fetch(`http://localhost:5049/api/usuarios/${editUsuario.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editUsuario),
    })
      .then(() => {
        const updatedUsuarios = usuarios.map(usuario => 
          usuario.id === editUsuario.id ? editUsuario : usuario
        );
        setUsuarios(updatedUsuarios);
        setEditUsuario({ id: null, nombre: '', correo: '' }); // Limpia el formulario de edición
      })
      .catch(error => console.error('Error updating usuario:', error));
  };

  // Eliminar un usuario
  const handleDelete = (id) => {
    fetch(`http://localhost:5049/api/usuarios/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        const filteredUsuarios = usuarios.filter(usuario => usuario.id !== id);
        setUsuarios(filteredUsuarios);
      })
      .catch(error => console.error('Error deleting usuario:', error));
  };

  // Cargar usuario en el formulario de edición
  const handleEdit = (usuario) => {
    setEditUsuario(usuario);
  };

  return (
    <Container>
      <h2 className="my-4">Gestión de Usuarios</h2>

      {/* Crear un nuevo usuario */}
      <Row className="mb-4">
        <Col md={6}>
          <h3>Crear Usuario</h3>
          <Form>
            <Form.Group controlId="formNombre">
              <Form.Control 
                type="text" 
                value={newUsuario.nombre}
                onChange={(e) => setNewUsuario({ ...newUsuario, nombre: e.target.value })}
                placeholder="Nombre"
              />
            </Form.Group>
            <Form.Group controlId="formCorreo">
              <Form.Control 
                type="email" 
                value={newUsuario.correo}
                onChange={(e) => setNewUsuario({ ...newUsuario, correo: e.target.value })}
                placeholder="Correo"
              />
            </Form.Group>
            <Button variant="primary mt-2" onClick={handleCreate}>Crear</Button>
          </Form>
        </Col>
      </Row>

      {/* Editar un usuario */}
      <Row className="mb-4">
        <Col md={6}>
          <h3>Editar Usuario</h3>
          <Form>
            <Form.Group controlId="formId">
              <Form.Control 
                type="number" 
                value={editUsuario.id || ''}
                onChange={(e) => setEditUsuario({ ...editUsuario, id: e.target.value })}
                placeholder="ID"
                disabled
              />
            </Form.Group>
            <Form.Group controlId="formNombreEdit">
              <Form.Control 
                type="text" 
                value={editUsuario.nombre}
                onChange={(e) => setEditUsuario({ ...editUsuario, nombre: e.target.value })}
                placeholder="Nombre"
              />
            </Form.Group>
            <Form.Group controlId="formCorreoEdit">
              <Form.Control 
                type="email" 
                value={editUsuario.correo}
                onChange={(e) => setEditUsuario({ ...editUsuario, correo: e.target.value })}
                placeholder="Correo"
              />
            </Form.Group>
            <Button variant="success mt-2" onClick={handleUpdate}>Actualizar</Button>
          </Form>
        </Col>
      </Row>

      {/* Lista de usuarios */}
      <Row>
        <Col>
          <h3>Lista de Usuarios</h3>
          <ListGroup>
            {usuarios.map(usuario => (
              <ListGroup.Item key={usuario.id} className="d-flex justify-content-between  align-items-center">
                {usuario.nombre} ({usuario.correo})
                <div>
                  <Button variant="warning" className="me-2" onClick={() => handleEdit(usuario)}>Actualizar</Button>
                  <Button variant="danger" onClick={() => handleDelete(usuario.id)}>Eliminar</Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};
