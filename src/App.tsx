import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Homepage from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/DashboardPage';
import AdminProfile from './pages/AdminProfilePage';
import ParkingSpace from './pages/ParkingSpace';
import LicencePlate from './pages/LicencePlate';
import EntryRecordsPage from './pages/EntryRecordsPage';
import Register from './components/Register';
import AddAdminProfile from './components/AddAdminProfile';
import AuthRequests from './components/AuthRequests';
import AddLicencePlate from './components/AddLicencePlate';
import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';

const AppContent: React.FC = () => {
  const location = useLocation();
  const hideSidebarRoutes = ['/', '/login', '/register'];

  const isKnownRoute = [
    '/',
    '/login',
    '/register',
    '/dashboard',
    '/admin-profile',
    '/add-admin',
    '/licence-plate',
    '/entry-records',
    '/parking-space',
    '/auth-requests',
    '/add-licence',
  ].includes(location.pathname);

  const hideSidebar = hideSidebarRoutes.includes(location.pathname) || !isKnownRoute;

  return (
    <div className="d-flex" style={{ backgroundColor: 'E8F0F2' }}>
      {!hideSidebar && <Sidebar />}
      <div className="flex-grow-1 p-0">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin-profile" element={<AdminProfile />} />
            <Route path="/add-admin" element={<AddAdminProfile />} />
            <Route path="/licence-plate" element={<LicencePlate />} />
            <Route path="/entry-records" element={<EntryRecordsPage />} />
            <Route path="/parking-space" element={<ParkingSpace />} />
            <Route path="/auth-requests" element={<AuthRequests />} />
            <Route path="/add-licence" element={<AddLicencePlate />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
