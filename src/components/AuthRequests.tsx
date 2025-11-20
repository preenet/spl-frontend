import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Dropdown, Pagination } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';
import axiosInstance from '../api/axios';
import Layout from '../components/Layout';

interface AuthRequest {
  id: number;
  plateNumber: string;
  photo: string;
  status: string;
  name: string;
  email: string;
}

const AuthRequests: React.FC = () => {
  const [requests, setRequests] = useState<AuthRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // or get from backend

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) {
        params.append('status', statusFilter);
      }
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());

      const response = await axiosInstance.get(`/requests?${params.toString()}`);
      const data = response.data.map((req: any) => ({
        id: req.id,
        plateNumber: req.plate_number,
        photo: req.plate_image_url,
        status: req.status,
        name: req.username,
        email: req.user_email,
      }));
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, currentPage]);

  const handleStatusUpdate = async (id: number, newStatus: 'approved' | 'rejected') => {
    try {
      await axiosInstance.put(`/requests/${id}`, { status: newStatus });
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id
            ? { ...req, status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1) }
            : req
        )
      );
    } catch (error) {
      console.error(`Failed to ${newStatus} request ${id}:`, error);
    }
  };

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  return (
    <Layout>
      <div className="p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-4 fw-bold" style={{ color: '#3A6EA5' }}>
            Authorization Requests
          </h3>
          <Dropdown onSelect={(e) => setStatusFilter(e === 'all' ? null : e)}>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              Filter by Status: {statusFilter || 'All'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="all">All</Dropdown.Item>
              <Dropdown.Item eventKey="pending">Pending</Dropdown.Item>
              <Dropdown.Item eventKey="approved">Approved</Dropdown.Item>
              <Dropdown.Item eventKey="rejected">Rejected</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <Table bordered>
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Plate Number</th>
              <th>Email</th>
              <th>Photo</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="table-row-hover">
                <td>{req.name}</td>
                <td>{req.plateNumber}</td>
                <td>{req.email}</td>
                <td>
                  <img
                    src={req.photo}
                    alt="plate"
                    style={{ width: '80px', height: '50px', objectFit: 'cover' }}
                  />
                </td>
                <td>{req.status}</td>
                <td>
                  {req.status === 'pending' ? (
                    <>
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="me-2"
                        onClick={() => handleStatusUpdate(req.id, 'approved')}
                        title="Approve"
                      >
                        <FaCheck />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleStatusUpdate(req.id, 'rejected')}
                        title="Reject"
                      >
                        <FaTimes />
                      </Button>
                    </>
                  ) : (
                    <span className="text-muted">Processed</span>
                  )}
                </td>
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
              disabled={requests.length < itemsPerPage}
            />
          </Pagination>
        </div>
      </div>
    </Layout>
  );
};

export default AuthRequests;
