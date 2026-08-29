import React from 'react';
import { Container, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import { SeoAeoHead } from '../components/SeoAeoHead';
import { getSalesJobPostingSchema } from '../schemas/jobPostingSchema';
import { MultiStepSalesForm } from '../components/MultiStepSalesForm';

export const SalesPage: React.FC = () => {
  return (
    <>
      <SeoAeoHead
        title="Sales Executive Careers (100% Commission OR Base Salary + 5%)"
        description="Apply for Sales Executive role at Fillosoft Technologies. Select between 100% Commission at 15% per deal or Fixed Base Monthly Salary + 5% Commission. Interactive earnings calculator included."
        canonicalUrl="https://careers.fillosoft.com/sales"
        jsonLdSchema={getSalesJobPostingSchema()}
      />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <MuiLink component={Link} to="/" underline="hover" color="inherit">
            Home
          </MuiLink>
          <Typography color="text.primary" sx={{ fontWeight: 700 }}>
            Sales Executive Application
          </Typography>
        </Breadcrumbs>

        <MultiStepSalesForm />
      </Container>
    </>
  );
};
