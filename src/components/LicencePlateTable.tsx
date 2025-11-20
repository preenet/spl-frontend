import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Spinner, Pagination } from 'react-bootstrap';
import '../style/LicencePlateTable.css';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

interface PlateEntry {
  id: number;
  plate_number: string;
  plate_image_url: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

const LicencePlateTable: React.FC = () => {
  const [data, setData] = useState<PlateEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [targetId, setTargetId] = useState<number | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editEntry, setEditEntry] = useState<PlateEntry | null>(null);
  const [editForm, setEditForm] = useState({
    plate_number: '',
    user_email: '',
    username: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append('page', currentPage.toString());
        params.append('limit', itemsPerPage.toString());
        const res = await axiosInstance.get(`/plates?${params.toString()}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const handleDelete = async () => {
    if (targetId !== null) {
      try {
        await axiosInstance.delete(`/plates/${targetId}`);
        setData((prev) => prev.filter((item) => item.id !== targetId));
      } catch (err) {
        console.error('Delete failed:', err);
      } finally {
        setTargetId(null);
        setShowModal(false);
      }
    }
  };

  const handleEdit = (id: number) => {
    const entry = data.find((item) => item.id === id);
    if (entry) {
      setEditEntry(entry);
      setEditForm({
        plate_number: entry.plate_number,
        user_email: entry.user.email,
        username: entry.user.name,
      });
      setShowEditModal(true);
    }
  };

  const handleEditSubmit = async () => {
    if (!editEntry) return;

    const formData = new FormData();
    formData.append('plate_number', editForm.plate_number);
    formData.append('user_email', editForm.user_email);
    formData.append('username', editForm.username);
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    try {
      const res = await axiosInstance.put(
        `/plates/${editEntry.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setData((prev) =>
        prev.map((item) => (item.id === editEntry.id ? res.data : item))
      );
      setShowEditModal(false);
      setSelectedFile(null);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleConfirmDelete = (id: number) => {
    setTargetId(id);
    setShowModal(true);
  };

  const handleAdd = () => {
    navigate('/add-licence');
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-4 fw-bold" style={{ color: '#3A6EA5' }}>
          Licence Plate
        </h3>
        <Button
          variant="light"
          onClick={handleAdd}
          style={{
            backgroundColor: '#cfdde6',
            color: '#3A6EA5',
          }}
        >
          Add
        </Button>
      </div>
      <Table bordered>
        <thead className="table-light">
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Plate Number</th>
            <th>Email</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={entry.id} className="table-row-hover">
              <td>{index + 1}</td>
              <td>{entry.user.name}</td>
              <td>{entry.plate_number}</td>
              <td>{entry.user.email}</td>
              <td>
                {entry.plate_image_url ? (
                  <img
                    src={entry.plate_image_url}
                    alt={`Plate ${entry.plate_number}`}
                    style={{ width: '100px', objectFit: 'cover' }}
                  />
                ) : (
                  <span>No Image</span>
                )}
              </td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleEdit(entry.id)}
                  className="me-2"
                >
                  <i className="fas fa-edit"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleConfirmDelete(entry.id)}
                >
                  <i className="fas fa-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-center">
        <Pagination>
          <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
          <Pagination.Item>{currentPage}</Pagination.Item>
          <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={data.length < itemsPerPage} />
        </Pagination>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this entry?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Plate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Plate Number</label>
            <input
              type="text"
              className="form-control"
              value={editForm.plate_number}
              onChange={(e) => setEditForm({ ...editForm, plate_number: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Image</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) =>
                setSelectedFile(e.target.files ? e.target.files[0] : null)
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Client Email</label>
            <input
              type="email"
              className="form-control"
              value={editForm.user_email}
              onChange={(e) => setEditForm({ ...editForm, user_email: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={editForm.username}
              onChange={(e) =>
                setEditForm({ ...editForm, username: e.target.value })
              }
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LicencePlateTable;
