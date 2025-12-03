"use client";

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function ChartsClient({ data, options, type = 'bar' }: { data: any; options: any; type?: 'bar' | 'pie' }) {
  if (type === 'pie') {
    return <Pie options={options} data={data} />;
  }
  return <Bar options={options} data={data} />;
}
