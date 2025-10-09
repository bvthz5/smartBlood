import React from 'react';
import { ThemeProvider } from '../../contexts/ThemeContext';
import DashboardLayout from '../../components/admin/DashboardLayout';
import AdminDashboard from '../../components/admin/AdminDashboard';

const AdminDashboardNew = () => {
  return (
    <ThemeProvider>
      <DashboardLayout>
        <AdminDashboard />
      </DashboardLayout>
    </ThemeProvider>
  );
};

export default AdminDashboardNew;
