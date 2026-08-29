import React from 'react';
import { Container, Breadcrumbs, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import { SeoAeoHead } from '../components/SeoAeoHead';
import { getDeveloperJobPostingSchema } from '../schemas/jobPostingSchema';
import { DeveloperForm } from '../components/DeveloperForm';

export const DeveloperPage: React.FC = () => {
  return (
    <>
      <SeoAeoHead
        title="Full-Stack Developer Careers | React, Node.js, Express"
        description="Apply for Software Engineering & Full-Stack Developer positions at Fillosoft Technologies. Build custom enterprise software, mobile apps, and banking systems."
        canonicalUrl="https://careers.fillosoft.com/developer"
        jsonLdSchema={getDeveloperJobPostingSchema()}
      />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <MuiLink component={Link} to="/" underline="hover" color="inherit">
            Home
          </MuiLink>
          <Typography color="text.primary" sx={{ fontWeight: 700 }}>
            Developer Application
          </Typography>
        </Breadcrumbs>

        <DeveloperForm />
      </Container>
    </>
  );
};
