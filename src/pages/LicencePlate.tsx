import React from 'react';
import { Container } from 'react-bootstrap';
import LicencePlateTable from '../components/LicencePlateTable';
import Layout from '../components/Layout';

const LicencePlatePage: React.FC = () => (
  <Layout>
    <Container className="pt-4">
      <LicencePlateTable />
    </Container>
  </Layout>
);

export default LicencePlatePage;
