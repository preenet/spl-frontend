import React, { useEffect, useState } from 'react';
import { Table, Spinner, Pagination, Form, Button, Row, Col } from 'react-bootstrap';
import axiosInstance from '../api/axios';
import '../style/LicencePlateTable.css';
import Layout from '../components/Layout';

interface EntryRecord {
  id: number;
  plate_number: string;
  plate_image_url: string;
  timestamp: string;
}

const EntryRecordsPage: React.FC = () => {
  const [entryRecords, setEntryRecords] = useState<EntryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchEntryRecords = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      const res = await axiosInstance.get('/entry-records', { params });
      setEntryRecords(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntryRecords();
  }, [currentPage]);

  const handleFilter = () => {
    setCurrentPage(1);
    fetchEntryRecords();
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // Pagination logic (client-side for now)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = entryRecords.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(entryRecords.length / itemsPerPage);

  return (
    <Layout>
        <div className="p-3">
        <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-3 fw-bold" style={{ color: '#3A6EA5' }}>
            Entry Records
            </h3>
        </div>
        <div className='d-flex justify-content-end'>
          <Form className="mb-3">
            <Row>
              <Col>
                <Form.Group controlId="startDate">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="endDate">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </Form.Group>
              </Col>
              <Col className="d-flex align-items-end">
                <Button variant="primary" onClick={handleFilter}>Filter</Button>
              </Col>
            </Row>
          </Form>
        </div>
        <Table bordered>
            <thead className="table-light">
            <tr>
                <th>ID</th>
                <th>Plate Number</th>
                <th>Plate Image</th>
                <th>Timestamp</th>
            </tr>
            </thead>
            <tbody>
            {currentItems.map((record, index) => (
                <tr key={record.id} className="table-row-hover">
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{record.plate_number}</td>
                <td>
                    {record.plate_image_url ? (
                    <img
                        src={record.plate_image_url}
                        alt={`Plate ${record.plate_number}`}
                        style={{ width: '100px', objectFit: 'cover' }}
                    />
                    ) : (
                    <span>No Image</span>
                    )}
                </td>
                <td>{new Date(record.timestamp).toLocaleString()}</td>
                </tr>
            ))}
            </tbody>
        </Table>

        <div className="d-flex justify-content-center">
            <Pagination>
            <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
            {[...Array(totalPages).keys()].map(number => (
                <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => setCurrentPage(number + 1)}>
                    {number + 1}
                </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
            </Pagination>
        </div>
        </div>
    </Layout> 
  );
};

export default EntryRecordsPage;
