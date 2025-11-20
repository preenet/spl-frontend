import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

interface ParkingSnapshot {
  available_spaces: number;
  total_spaces: number;
}

interface DashboardCardsProps {
  snapshot: ParkingSnapshot | null;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ snapshot }) => {
  const occupiedSpaces = snapshot ? snapshot.total_spaces - snapshot.available_spaces : 0;

  const cards = [
    {
      title: 'Available',
      count: snapshot?.available_spaces ?? 0,
      icon: 'fa-car',
      color: 'success',
    },
    {
      title: 'Occupied',
      count: occupiedSpaces,
      icon: 'fa-car-side',
      color: 'danger',
    },
    {
      title: 'Total',
      count: snapshot?.total_spaces ?? 0,
      icon: 'fa-parking',
      color: 'info',
    },
  ];

  return (
    <Row className="mb-3">
      {cards.map((card, idx) => (
        <Col key={idx}>
          <Card className={`text-center text-white bg-${card.color}`}>
            <Card.Body>
              <Card.Title>
                <i className={`fas ${card.icon} me-2`}></i>
                {card.title}
              </Card.Title>
              <h2>{card.count}</h2>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default DashboardCards;
