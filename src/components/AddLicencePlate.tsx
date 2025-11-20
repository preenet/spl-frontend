import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import axios from '../api/axios';
import Layout from '../components/Layout';

const AddLicencePlate: React.FC = () => {
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
    formData.append('email', email);
    formData.append('name', name);
    formData.append('plateNumber', plateNumber);
    formData.append('photo', photo);

    try {
      const response = await axios.post('/plates', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      toast.success('Licence plate added successfully!');
      // Reset form
      setEmail('');
      setName('');
      setPlateNumber('');
      setPhoto(null);
    } catch (error) {
      console.error('Error adding licence plate:', error);
      toast.error('Failed to add licence plate.');
    }
  };

  return (
    <Layout>
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: '100vh', backgroundColor: '#E8F0F2' }}
      >
        <div
          className="container py-5"
          style={{
            maxWidth: '70%',
            backgroundColor: '#E8F0F2',
          }}
        >
          <h3 className="fw-bold mb-4" style={{ color: '#3A6EA5' }}>
            Add Licence Plate
          </h3>

          <form onSubmit={handleSubmit} className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control bg-secondary bg-opacity-25 text-primary rounded-3"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control bg-secondary bg-opacity-25 text-primary rounded-3"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control bg-secondary bg-opacity-25 text-primary rounded-3"
                  placeholder="Plate Number"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="col-md-6 d-flex align-items-start justify-content-center">
              <div
                className="w-75 h-100 bg-secondary bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center"
                style={{ color: '#3A6EA5', minHeight: '150px' }}
              >
                <label
                  htmlFor="photo"
                  className="w-100 h-100 text-center"
                  style={{ cursor: 'pointer' }}
                >
                  {photo ? photo.name : 'Photo'}
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
                style={{ color: '#3A6EA5' }}
              >
                Add
              </button>
            </div>
          </form>
        </div>

        <ToastContainer />
      </div>
    </Layout>
  );
};

export default AddLicencePlate;
