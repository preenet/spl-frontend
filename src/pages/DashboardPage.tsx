import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Modal, Spinner, Row, Col } from 'react-bootstrap';
import DashboardCards from '../components/DashboardCards';
import WeeklyUsageChart from '../components/WeeklyUsageChart';
import axiosInstance from '../api/axios';
import Layout from '../components/Layout';

interface ParkingSnapshot {
  available_spaces: number;
  total_spaces: number;
}

const DashboardPage: React.FC = () => {
  const [snapshot, setSnapshot] = useState<ParkingSnapshot | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('N/A');
  const [showModal, setShowModal] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    const fetchSnapshot = async () => {
      try {
        const response = await axiosInstance.get('/parking/snapshot/latest');
        setSnapshot(response.data);
      } catch (error) {
        console.error('Error fetching parking snapshot:', error);
      } finally {
        setLastUpdated(new Date().toLocaleString());
      }
    };
    fetchSnapshot();
  }, []);

  const handleParking1 = async () => {
    setShowModal(true);
    setLoadingImage(true);
    try {
      const response = await axiosInstance.get('/parking/inference', {
        responseType: 'blob',
      });
      const imageUrl = URL.createObjectURL(response.data);
      setImageSrc(imageUrl);
    } catch (error) {
      console.error('Error fetching inference image:', error);
    } finally {
      setLoadingImage(false);
    }
  };

  const handleParking2 = async () => {
    setShowModal(true);
    setLoadingImage(true);
    try {
      const response = await axiosInstance.get('/parking/inference2', {
        responseType: 'blob',
      });
      const imageUrl = URL.createObjectURL(response.data);
      setImageSrc(imageUrl);
    } catch (error) {
      console.error('Error fetching inference image:', error);
    } finally {
      setLoadingImage(false);
    }
  };

  return (
    <Layout>
      <Container fluid className="pt-4 px-3">
        <h2 className="mb-3 text-primary">CAMT Parking Overview</h2>
        <DashboardCards snapshot={snapshot} />

        <p className="mt-3 text-muted small">Last updated: {lastUpdated}</p>

        <h2 className="mb-3 text-primary">Status Check</h2>
        <Row className="g-3 px-2">
          <Col xs={12} md={6} lg={4}>
            <Card
              className="p-3 shadow-sm h-100"
              style={{ cursor: 'pointer' }}
              onClick={handleParking1}
            >
              <Card.Body>
                <Card.Title>Run AI Parking 1 Detection</Card.Title>
                <Card.Text>Click to see live inference snapshot</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={6} lg={4}>
            <Card
              className="p-3 shadow-sm h-100"
              style={{ cursor: 'pointer' }}
              onClick={handleParking2}
            >
              <Card.Body>
                <Card.Title>Run AI Parking 2 Detection</Card.Title>
                <Card.Text>Click to see live inference snapshot</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="my-5 px-2">
          <div style={{ width: '100%', height: '400px' }}>
            <WeeklyUsageChart />
          </div>
        </div>

        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Parking Snapshot</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            {loadingImage ? (
              <Spinner animation="border" />
            ) : imageSrc ? (
              <img src={imageSrc} alt="Parking Snapshot" className="img-fluid rounded" />
            ) : (
              <p className="text-muted">No image available</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Layout>
  );
};

export default DashboardPage;
