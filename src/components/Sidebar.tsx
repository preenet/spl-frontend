import React, { useState } from 'react';
import { Nav, Offcanvas, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import '../style/Sidebar.css';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    localStorage.removeItem('token');
    navigate('/');
  };

  const NavList = (
    <>
      <div className="text-center mb-4">
        <div className="bg-white rounded-circle d-inline-block p-3">
          <span className="text-dark">👤</span>
        </div>
        <div>Admin</div>
      </div>

      <Nav className="flex-column gap-2">
        <NavLink to="/dashboard" className="sidebar-link">
          <i className="fas fa-tachometer-alt me-2"></i> Dashboard
        </NavLink>
        <NavLink to="/admin-profile" className="sidebar-link">
          <i className="fas fa-user-shield me-2"></i> Admin Profile
        </NavLink>
        <NavLink to="/parking-space" className="sidebar-link">
          <i className="fas fa-parking me-2"></i> Live Camera
        </NavLink>
        <NavLink to="/licence-plate" className="sidebar-link">
          <i className="fas fa-id-card me-2"></i> Licence Plate
        </NavLink>
        <NavLink to="/entry-records" className="sidebar-link">
          <i className="fas fa-book me-2"></i> Entry Records
        </NavLink>
        <NavLink to="/auth-requests" className="sidebar-link">
          <i className="fas fa-user-check me-2"></i> Auth Requests
        </NavLink>
        <a href="/" onClick={handleLogout} className="sidebar-link mt-5">
          <i className="fas fa-sign-out-alt me-2"></i> Logout
        </a>
      </Nav>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar (fixed) */}
      <aside className="sidebar d-none d-md-flex flex-column text-white p-3">{NavList}</aside>

      {/* Mobile hamburger + offcanvas */}
      <div className="d-md-none">
        <Button className="fab-toggle" onClick={() => setShow(true)}>
          <i className="fas fa-bars"></i>
        </Button>

        <Offcanvas
          show={show}
          onHide={() => setShow(false)}
          placement="start"
          className="offcanvas-menu"
        >
          <Offcanvas.Header closeButton>
            <strong>Admin Menu</strong>
          </Offcanvas.Header>
          <Offcanvas.Body>{NavList}</Offcanvas.Body>
        </Offcanvas>
      </div>
    </>
  );
};

export default Sidebar;
