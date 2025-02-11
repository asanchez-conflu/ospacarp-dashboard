'use client';
import dynamic from 'next/dynamic';
import 'chart.js/auto';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ChartData } from 'chart.js';

const endpoints = {
  trendsOrigin:
    'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/affiliates/trends/origin?Clientappid=21&Startperiod=202405&Endperiod=202501&Delegation=1',
  trendsDelegation:
    'https://sisaludapi-prepro.confluenciait.com/ospacarpqa/affiliates/trends/delegation?Clientappid=21&Startperiod=202405&Endperiod=202501&Origin=1',
};

const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
  ssr: false,
});

// Example interface for your trend data (recommended):
interface TrendItem {
  count: string;
  month: string;
  monthName: string;
  percentage: string;
}

const Ingresos = () => {
  const [graphData, setGraphData] = useState<ChartData<'line'> | null>(null); // Type the state
  const [loading, setLoading] = useState<boolean>(true);

  const convertTrendDataTyped = (trendData: TrendItem[]) => {
    // Now with a proper type
    const labels = trendData.map((item) => item.monthName);
    const data = trendData.map((item) => parseInt(item.count, 10)); // Parse count to number

    return {
      labels: labels,
      datasets: [
        {
          label: 'Trend',
          data: data,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    };
  };

  const fetchTrends = async (id: string, type: string) => {
    try {
      setLoading(true);
      console.log(loading);
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('No token found');
      }

      let endpoint = '';

      if (type === 'origin') {
        endpoint = endpoints.trendsOrigin;
      } else if (type === 'delegations') {
        endpoint = endpoints.trendsDelegation;
      } else {
        throw new Error('Invalid type provided');
      }

      const dataResponse = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = dataResponse.data;

      if (!data || !data.trend) {
        console.warn('No data received for this type.');
        setGraphData(null);
        return;
      } else {
        const trend = convertTrendDataTyped(data.trend);
        console.log('Trend: ', trend);
        setGraphData(trend);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setGraphData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends('1', 'origin');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ width: '700px', height: '700px' }}>
      <h1>Example 1: Line Chart</h1>
      {graphData &&
      graphData.labels &&
      graphData.datasets &&
      graphData.datasets.length > 0 ? (
        <Line data={graphData} />
      ) : (
        <p>Loading or no data yet</p> // Or a loading spinner, or nothing at all
      )}
    </div>
  );
};

export default Ingresos;
