'use client';

import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Suspense } from 'react';
import TableComponent from './TableComponent';
import RightPaneComponent from './RightPaneComponent';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    --bg-color: rgba(255, 255, 255, 0.5);
    --text-color: #000000;
    --toast-bg: #ffffff;
    --toast-text: #333333;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --bg-color: rgba(0, 0, 0, 0.5);
      --text-color: #ffffff;
      --toast-bg: #333333;
      --toast-text: #ffffff;
    }
  }

  body {
    background-color: var(--bg-color);
    color: var(--text-color);
  }

  /* Customize toast container for dark mode */
  .Toastify__toast-container {
    background-color: var(--toast-bg);
  }

  .Toastify__toast {
    background-color: var(--toast-bg);
    color: var(--toast-text);
  }

  .Toastify__close-button {
    color: var(--toast-text);
  }
`;

const PageContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  min-height: 100vh;
  background-color: var(--bg-color);
  backdrop-filter: blur(20px);
  padding: 20px;
  overflow: hidden;
  opacity: 0.8;
`;

async function getData() {
  const dataRes = await fetch('/api/get-table-data', { next: { revalidate: 86400 } });
  const preferencesRes = await fetch('/api/get-preferences', { next: { revalidate: 86400 } });
  
  if (!dataRes.ok || !preferencesRes.ok) {
    throw new Error('Failed to fetch data');
  }

  const { data } = await dataRes.json();
  const { period_length, target_occupancy } = await preferencesRes.json();

  return {
    initialData: data,
    initialPeriodLength: period_length,
    initialTargetOccupancy: target_occupancy,
  };
}

interface DataState {
  initialData: any;
  initialPeriodLength: any;
  initialTargetOccupancy: any;
}

export default function Page() {
  const [data, setData] = useState<DataState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const newData = await getData();
      setData(newData);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleUpdatePeriodLength = async (newPeriodLength: number) => {
    try {
      const response = await fetch('/api/update-period-length', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ periodLength: newPeriodLength }),
      });

      if (!response.ok) {
        throw new Error('Failed to update period length');
      }

      // Refetch all data to update the page with new information
      await fetchAllData();
      toast.success('Period length updated successfully!', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error('Error updating period length:', error);
      toast.error('Failed to update period length.', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleUpdateTargetOccupancy = async (newTargetOccupancy: number) => {
    try {
      const response = await fetch('/api/update-target-occupancy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetOccupancy: newTargetOccupancy }),
      });

      if (!response.ok) {
        throw new Error('Failed to update target occupancy');
      }

      // Refetch all data to update the page with new information
      await fetchAllData();
      toast.success('Target occupancy updated successfully!', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error('Error updating target occupancy:', error);
      toast.error('Failed to update target occupancy.', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Placeholder for the loading state
  }

  if (error) {
    return <div>{error}</div>; // Placeholder for the error state
  }

  return (
    <>
      <GlobalStyle />
      <PageContainer>
        <Suspense fallback={<div>Loading table...</div>}>
          <TableComponent initialData={data?.initialData} loading={loading} />
        </Suspense>
        <Suspense fallback={<div>Loading controls...</div>}>
          <RightPaneComponent 
            initialPeriodLength={data?.initialPeriodLength} 
            initialTargetOccupancy={data?.initialTargetOccupancy}
            onUpdatePeriodLength={handleUpdatePeriodLength}
            onUpdateTargetOccupancy={handleUpdateTargetOccupancy}
          />
        </Suspense>
        <ToastContainer />
      </PageContainer>
    </>
  );
}