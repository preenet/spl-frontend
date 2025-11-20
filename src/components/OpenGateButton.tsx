import React, { useState } from 'react';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';
import { Button, Spinner } from 'react-bootstrap';

const OpenGateButton: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleOpenGate = async () => {
    setLoading(true);
    try {
      toast.info('Opening gate...', {
        position: 'top-right',
        autoClose: 1500,
      });

      const response = await axiosInstance.get('/parking/open');

      toast.success(response.data.status || 'Gate opened successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error: any) {
      console.error('Failed to open gate:', error);

      toast.error(
        error.response?.data?.detail || 'Failed to open gate. Please try again.',
        {
          position: 'top-right',
          autoClose: 4000,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="primary"
      onClick={handleOpenGate}
      disabled={loading}
      className="d-flex align-items-center gap-2 rounded-pill"
    >
      {loading && <Spinner animation="border" size="sm" />}
      {loading ? 'Opening...' : 'Open Gate'}
    </Button>
  );
};

export default OpenGateButton;
