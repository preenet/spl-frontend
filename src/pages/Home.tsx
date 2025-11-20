import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axios';

interface ParkingSnapshot {
  available_spaces: number;
  total_spaces: number;
}

const Home: React.FC = () => {
  const [snapshot, setSnapshot] = useState<ParkingSnapshot | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('N/A');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSnapshot = async () => {
      try {
        const response = await axiosInstance.get('/parking/snapshot/latest');
        setSnapshot(response.data);
        setLastUpdated(new Date().toLocaleString());
      } catch (error) {
        console.error('Error fetching parking snapshot:', error);
      }
    };

    fetchSnapshot();
  }, []);

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const occupiedSpaces = snapshot ? snapshot.total_spaces - snapshot.available_spaces : 0;

  return (
    <div style={{ backgroundColor: '#e8f0f2', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav className="navbar px-4" style={{ backgroundColor: '#3b70a0' }}>
        <span
          className="navbar-brand text-white fw-bold"
          style={{ fontFamily: 'Bruno Ace SC, sans-serif' }}
        >
          Smart Parking
        </span>
        <div className="ms-auto d-flex gap-4">
          <Link to="/" className="text-white nav-link">
            Home
          </Link>
          <Link to="/login" className="text-white nav-link">
            Login
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-5 text-center center">
        <h3 className="container text-justify" style={{ color: '#3A6EA5' }}>
          CAMT Smart Parking Lot: Real time Avaliability
        </h3>
        <br />
        <br />
        <div className="row justify-content-center mb-5 bg-green-600">
          <div className="col-md-3">
            <h4 className="mb-3 fw-semibold" style={{ color: '#16a34a' }}>
              Available
            </h4>
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: '#bbf7d0',
                borderRadius: '1rem',
                height: '150px',
              }}
            >
              <span className="fs-4" style={{ color: '#15803d' }}>
                {snapshot?.available_spaces ?? 0}
              </span>
            </div>
          </div>
          <div className="col-md-3">
            <h4 className="mb-3 fw-semibold" style={{ color: '#dc2626' }}>
              Occupied
            </h4>
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: '#fecaca',
                borderRadius: '1rem',
                height: '150px',
              }}
            >
              <span className="fs-4" style={{ color: '#b91c1c' }}>
                {occupiedSpaces}
              </span>
            </div>
          </div>
          <div className="col-md-3">
            <h4 className="mb-3 fw-semibold" style={{ color: '#3A6EA5' }}>
              Total Slots
            </h4>
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: '#cfdde6',
                borderRadius: '1rem',
                height: '150px',
              }}
            >
              <span className="fs-4" style={{ color: '#3A6EA5' }}>
                {snapshot?.total_spaces ?? 0}
              </span>
            </div>
          </div>
        </div>
        <button
          className="btn"
          onClick={handleRegisterClick}
          style={{
            backgroundColor: '#cfdde6',
            borderRadius: '2rem',
            padding: '0.5rem 2rem',
            color: '#3A6EA5',
            fontWeight: '500',
          }}
        >
          <b>Register License Plate</b>
        </button>
        <p className="mt-3 text-muted" style={{ fontSize: '0.9rem' }}>
          Last updated: {lastUpdated}
        </p>
      </div>
    </div>
  );
};

export default Home;
