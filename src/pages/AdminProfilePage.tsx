// AdminProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import Layout from '../components/Layout';

interface Admin {
  id: number;
  username: string;
  password: string;
  role: string;
}

const AdminProfilePage = () => {
  const navigate = useNavigate();
  const [adminList, setAdminList] = useState<Admin[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [targetId, setTargetId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Admin>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [total_pages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const params = new URLSearchParams();
        params.append('page', currentPage.toString());
        params.append('limit', itemsPerPage.toString());
        const res = await axiosInstance.get(`/admins?${params.toString()}`);
        if (Array.isArray(res.data)) {
          setAdminList(res.data);
        } else {
          setAdminList(res.data.admins);
          setTotalPages(res.data.total_pages);
        }
      } catch (error) {
        console.error('Failed to fetch admins', error);
      }
    };
    fetchAdmins();
  }, [currentPage]);

  const handleDeleteClick = (id: number) => {
    setTargetId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (targetId === null) return;

    try {
      await axiosInstance.delete(`/admins/${targetId}`);
      const updated = adminList.filter((a) => a.id !== targetId);
      setAdminList(updated);
      localStorage.setItem('adminList', JSON.stringify(updated));
    } catch (error: any) {
      if (error.response) {
        alert(error.response.data.detail || 'Failed to delete admin.');
      } else {
        alert('Network error or server unavailable.');
      }
      console.error(error);
    } finally {
      setShowDeleteModal(false);
      setTargetId(null);
    }
  };

  const handleEditClick = (admin: Admin) => {
    setEditingId(admin.id);
    setEditData({ username: admin.username, password: admin.password, role: admin.role });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async () => {
    if (editingId !== null) {
      try {
        const payload: { username?: string; password?: string; role?: string } = {
          username: editData.username,
          role: editData.role,
        };
        if (editData.password) {
          payload.password = editData.password;
        }
        await axiosInstance.patch(`/admins/${editingId}`, payload);

        const updatedList = adminList.map((admin) =>
          admin.id === editingId
            ? {
                ...admin,
                username: editData.username || '',
                role: editData.role || '',
              }
            : admin
        );
        setAdminList(updatedList);
        setEditingId(null);
        setEditData({});
      } catch (error) {
        console.error('Error updating user', error);
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  return (
    <Layout>
      <div className="p-5 bg-light min-vh-100">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-4 fw-bold" style={{ color: '#3A6EA5' }}>
            Admin Profile
          </h3>
          <Button
            variant="light"
            className="px-4 py-2 rounded-pill shadow-sm"
            onClick={() => navigate('/add-admin')}
            style={{ backgroundColor: '#cfdde6', color: '#3A6EA5' }}
          >
            Add
          </Button>
        </div>

        <Table bordered>
          <thead className="table-light">
            <tr>
              <th>Id</th>
              <th>Username</th>
              <th>Password</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {adminList.map((admin, index) => (
              <tr key={admin.id} className="table-row-hover">
                <td>{index + 1}</td>
                {editingId === admin.id ? (
                  <>
                    <td>
                      <Form.Control
                        type="text"
                        name="username"
                        value={editData.username || ''}
                        onChange={handleEditChange}
                        size="sm"
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="password"
                        name="password"
                        value={editData.password || ''}
                        onChange={handleEditChange}
                        size="sm"
                      />
                    </td>
                    <td>
                      <Form.Select
                        name="role"
                        value={editData.role || ''}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            role: e.target.value,
                          }))
                        }
                        size="sm"
                      >
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="operator">Operator</option>
                      </Form.Select>
                    </td>
                    <td>
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={saveEdit}
                        className="me-2"
                      >
                        <i className="fas fa-save"></i>
                      </Button>
                      <Button variant="outline-secondary" size="sm" onClick={cancelEdit}>
                        <i className="fas fa-times"></i>
                      </Button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{admin.username}</td>
                    <td>{'*'.repeat(8)}</td>
                    <td>{admin.role}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEditClick(admin)}
                        className="me-2"
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteClick(admin.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="d-flex justify-content-center">
          <Pagination>
            <Pagination.Prev
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            />
            <Pagination.Item>{currentPage}</Pagination.Item>
            <Pagination.Next
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === total_pages}
            />
          </Pagination>
        </div>

        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this admin?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Layout>
  );
};

export default AdminProfilePage;
