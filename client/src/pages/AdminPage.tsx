import React from 'react';
import { Container } from '@mui/material';
import { SeoAeoHead } from '../components/SeoAeoHead';
import { AdminDashboard } from '../components/AdminDashboard';

export const AdminPage: React.FC = () => {
  return (
    <>
      <SeoAeoHead
        title="HR Admin Command Center"
        description="Protected HR Admin Console to view, review, filter, and manage applicant submissions for Sales Executive and Developer positions."
        canonicalUrl="https://careers.fillosoft.com/hr_admin"
      />

      <Container maxWidth="lg" sx={{ py: 2 }}>
        <AdminDashboard />
      </Container>
    </>
  );
};
