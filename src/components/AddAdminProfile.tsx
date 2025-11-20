import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Layout from '../components/Layout';

const AddAdminProfile: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('operator');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleRegister = async () => {
    if (!validateEmail(email)) {
      setEmailError('Invalid email format.');
      return;
    }
    setEmailError('');

    try {
      const payload = {
        username: name,
        email: email,
        password: password,
        role: role,
      };

      await axios.post('/admins', payload);
      navigate('/admin-profile');
    } catch (error: any) {
      if (error.response) {
        alert(error.response.data.detail || 'Error creating admin.');
      } else {
        alert('Network error or server not responding.');
      }
      console.error(error);
    }
  };

  return (
    <Layout>
      <Container
        fluid
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: '100vh', backgroundColor: '#E8F0F2' }}
      >
        <h2 className="mb-4" style={{ color: '#3A6EA5' }}>
          Admin Profile
        </h2>
        <Form style={{ width: '300px' }}>
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              placeholder="Email"
              className="text-center bg-light border-0 rounded-pill"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) {
                  setEmailError('');
                }
              }}
              isInvalid={!!emailError}
            />
            <Form.Control.Feedback type="invalid">
              {emailError}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Name"
              className="text-center bg-light border-0 rounded-pill"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Control
              type="password"
              placeholder="Password"
              className="text-center bg-light border-0 rounded-pill"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Select
              className="text-center bg-light border-0 rounded-pill"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="operator">Operator</option>
            </Form.Select>
          </Form.Group>

          <div className="d-grid">
            <Button
              variant="primary"
              className="rounded-pill"
              style={{ backgroundColor: '#aac9dd', border: 'none' }}
              onClick={handleRegister}
            >
              Register
            </Button>
          </div>
        </Form>
      </Container>
    </Layout>
  );
};

export default AddAdminProfile;
