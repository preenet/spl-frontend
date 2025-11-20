import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axios';

const Register: React.FC = () => {

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!photo) {
      toast.error('Please upload a photo.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('plate_number', plateNumber);
    formData.append('photo', photo);

    try {
      const response = await axiosInstance.post('/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      toast.success('Successfully registered!');
    } catch (error: any) {
      console.error(error);
      toast.error('Failed to register. Please try again.');
    }
  };

  return (
    <div
      className="container-fluid"
      style={{ minWidth: '100%', minHeight: '100vh', backgroundColor: '#E8F0F2', padding: '0' }}
    >
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

      <div
        className="container py-5"
        style={{
          maxWidth: '70%',
          minHeight: '100vh',
          backgroundColor: '#E8F0F2',
          padding: '0',
        }}
      >
        <h3 className="fw-bold" style={{ color: '#3A6EA5' }}>
          License Plate Registration
        </h3>
        <form onSubmit={handleSubmit} className="row mt-4">
          <div className="col-md-6">
            <div className="mb-3">
              <p className="m-1" style={{ color: '#3A6EA5' }}>
                <b>Email:</b>
              </p>
              <input
                type="email"
                className="form-control bg-secondary bg-opacity-25 text-primary rounded-3"
                placeholder="e.g. user@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <p className="m-1" style={{ color: '#3A6EA5' }}>
                <b>Name:</b>
              </p>
              <input
                type="text"
                className="form-control bg-secondary bg-opacity-25 text-primary rounded-3"
                placeholder="e.g. David Adam"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <p className="m-1" style={{ color: '#3A6EA5' }}>
                <b>License Plate Number:</b>
              </p>
              <input
                type="text"
                className="form-control bg-secondary bg-opacity-25 text-primary rounded-3"
                placeholder="e.g. AA1009"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                required
              />
            </div>
            {/* <div className="mb-3">
              <p className="m-1" style={{ color: '#3A6EA5' }}>
                <b>License Plate Province:</b>
              </p>
              <input
                type="text"
                className="form-control bg-secondary bg-opacity-25 text-primary rounded-3"
                placeholder="e.g. Chiang Mai"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div> */}
          </div>

          <div className="col-md-6 d-flex align-items-start justify-content-center">
            <div
              className="w-75 h-100 bg-secondary bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center"
              style={{ color: '#3A6EA5' }}
            >
              <label
                htmlFor="photo"
                className="w-100 h-100 d-flex align-items-center justify-content-center text-center"
                style={{ cursor: 'pointer' }}
              >
                {photo
                  ? photo.name
                  : 'Click here to upload your license plate photo with jpg or png format'}
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  className="d-none"
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                />
              </label>
            </div>
          </div>

          <div className="col-12 mt-4 text-center">
            <button
              type="submit"
              className="btn bg-opacity-50 px-5 rounded-3 btn-outline-secondary"
              style={{ color: '#3A6EA5', whiteSpace: 'pre-line' }}
            >
              Register
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
