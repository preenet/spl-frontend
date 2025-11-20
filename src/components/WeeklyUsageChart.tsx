import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const generateData = (): { date: string; usage: number }[] => {
  const today = new Date();
  const result: { date: string; usage: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const label = d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const usage = Math.floor(Math.random() * 20) + 10;
    result.push({ date: label, usage });
  }

  return result;
};

const WeeklyUsageChart: React.FC = () => {
  const data = generateData();

  return (
    <>
      <h3 className="mb-4 fw-bold" style={{ color: '#3A6EA5' }}>
        Weekly Usage
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="usage" stroke="#8884d8" strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default WeeklyUsageChart;
