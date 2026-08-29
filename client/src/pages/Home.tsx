import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Paper,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CodeIcon from '@mui/icons-material/Code';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarIcon from '@mui/icons-material/Star';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { Link } from 'react-router-dom';
import { SeoAeoHead } from '../components/SeoAeoHead';
import { getFaqPageSchema } from '../schemas/jobPostingSchema';

export const Home: React.FC = () => {
  return (
    <>
      <SeoAeoHead
        title="Join Our Team | Sales & Engineering Careers"
        description="Explore high-growth career opportunities at Fillosoft Technologies. Apply for Sales Executive (100% Commission @ 15% rate) and Software Engineering roles."
        jsonLdSchema={getFaqPageSchema()}
      />

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: '#009961',
          color: '#ffffff',
          py: { xs: 8, md: 10 },
          borderRadius: { xs: '0 0 32px 32px', md: '0 0 48px 48px' },
          boxShadow: '0 20px 40px rgba(0, 153, 97, 0.2)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: 'center' }}>
                <Chip
                  icon={<LocalFireDepartmentIcon sx={{ color: '#ff4757 !important' }} />}
                  label="🔥 URGENT HIRING 2026"
                  sx={{ bgcolor: '#ffffff', color: '#2c3e50', fontWeight: 800, fontSize: '0.85rem' }}
                />
                <Chip
                  label="100% COMMISSION (15%)"
                  sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: '#ffffff', fontWeight: 800 }}
                />
              </Stack>

              <Typography variant="h1" sx={{ color: '#ffffff', mb: 2, fontSize: { xs: '2.2rem', md: '3.2rem' } }}>
                Your Ideas Fuel The Journey, We Provide The Momentum
              </Typography>
              <Typography variant="h5" sx={{ opacity: 0.9, fontWeight: 400, mb: 4, lineHeight: 1.6 }}>
                Join Fillosoft Technologies. Drive high-reward B2B sales across India with an uncapped <strong>15% commission</strong> on all closed deals, or build enterprise software.
              </Typography>

              {/* HIGHLIGHTED SALES EXECUTIVE BUTTON */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} sx={{ alignItems: 'center' }}>
                <Button
                  component={Link}
                  to="/sales"
                  variant="contained"
                  size="large"
                  startIcon={<TrendingUpIcon sx={{ fontSize: '1.6rem !important' }} />}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
                    color: '#009961',
                    fontWeight: 900,
                    fontSize: '1.15rem',
                    px: 4,
                    py: 1.8,
                    borderRadius: '14px',
                    boxShadow: '0 0 30px rgba(255, 255, 255, 0.7), 0 10px 25px rgba(0, 0, 0, 0.2)',
                    border: '3px solid #ffffff',
                    transition: 'all 0.3s ease-in-out',
                    animation: 'pulseGlow 2.5s infinite alternate',
                    '&:hover': {
                      background: '#ffffff',
                      transform: 'scale(1.05)',
                      boxShadow: '0 0 40px rgba(255, 255, 255, 0.95), 0 15px 35px rgba(0,0,0,0.3)',
                    },
                    '@keyframes pulseGlow': {
                      '0%': { boxShadow: '0 0 15px rgba(255, 255, 255, 0.5)' },
                      '100%': { boxShadow: '0 0 35px rgba(255, 255, 255, 0.95), 0 0 15px #00ff9d' },
                    },
                  }}
                >
                  Apply as Sales Executive (15% Commission)
                </Button>

                <Button
                  component={Link}
                  to="/developer"
                  variant="outlined"
                  size="large"
                  startIcon={<CodeIcon />}
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.6)',
                    color: '#ffffff',
                    fontWeight: 600,
                    px: 3,
                    py: 1.5,
                    borderRadius: '12px',
                    '&:hover': { borderColor: '#ffffff', bgcolor: 'rgba(255,255,255,0.1)' },
                  }}
                >
                  Software Engineer Roles
                </Button>
              </Stack>
            </Grid>

            {/* Featured Card */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  bgcolor: 'rgba(255, 255, 255, 0.96)',
                  backdropFilter: 'blur(10px)',
                  color: '#1e293b',
                  borderRadius: 4,
                  border: '3px solid #009961',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
                }}
              >
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Chip
                    icon={<StarIcon sx={{ color: '#ffffff !important' }} />}
                    label="⭐ TOP FEATURED ROLE"
                    color="success"
                    sx={{ fontWeight: 800, fontSize: '0.75rem' }}
                  />
                  <Chip label="15% RATE" color="primary" sx={{ fontWeight: 800 }} />
                </Stack>

                <Typography variant="h5" sx={{ fontWeight: 900, color: '#2c3e50', mt: 1, mb: 2 }}>
                  Sales Executive (100% Commission)
                </Typography>

                <Stack spacing={1.5} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon color="success" />
                    <Typography variant="body2">
                      <strong>100% Commission Model:</strong> 15% rate on every sale
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon color="success" />
                    <Typography variant="body2">
                      Uncapped monthly earnings (₹1.5 Lakhs payout on ₹10L sales)
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon color="success" />
                    <Typography variant="body2">
                      Includes live payout calculator & visual trajectory chart
                    </Typography>
                  </Box>
                </Stack>

                {/* HIGHLIGHTED CARD BUTTON */}
                <Button
                  component={Link}
                  to="/sales"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    py: 1.6,
                    fontWeight: 900,
                    fontSize: '1.05rem',
                    background: 'linear-gradient(135deg, #009961 0%, #007a4d 100%)',
                    boxShadow: '0 8px 20px rgba(0, 153, 97, 0.4)',
                    borderRadius: '12px',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 25px rgba(0, 153, 97, 0.55)',
                    },
                  }}
                >
                  Apply Now — Sales Executive (/sales)
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Open Positions Grid */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#2c3e50', mb: 1 }}>
            Current Job Openings & Direct Portals
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Select a position below to open its dedicated application page and submission workflow.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Sales Card */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '3px solid #009961',
                borderRadius: 4,
                boxShadow: '0 12px 30px rgba(0,153,97,0.2)',
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 20px 45px rgba(0,153,97,0.3)' },
              }}
            >
              <Box sx={{ p: 3, bgcolor: '#009961', color: '#ffffff' }}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip label="🔥 TOP PRIORITY" color="default" sx={{ bgcolor: '#ffffff', color: '#009961', fontWeight: 900 }} />
                  <TrendingUpIcon sx={{ fontSize: 32 }} />
                </Stack>
                <Typography variant="h4" sx={{ fontWeight: 900, mt: 2 }}>
                  Sales Executive
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  100% Commission Partner | PAN India & Guwahati HQ
                </Typography>
              </Box>
              <CardContent sx={{ p: 4, flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Promote Fillosoft's software ecosystem including Core Banking Software for cooperative societies, ERPs, Custom Apps, and Digital Marketing services.
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
                  Compensation Structure:
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #009961', mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#009961' }}>
                    ⭐ 100% Commission Basis: Earn 15% on every closed sale (Uncapped)
                  </Typography>
                </Paper>

                {/* HIGHLIGHTED POSITIONS GRID BUTTON */}
                <Button
                  component={Link}
                  to="/sales"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    py: 1.8,
                    fontWeight: 900,
                    fontSize: '1.05rem',
                    background: 'linear-gradient(135deg, #009961 0%, #006b43 100%)',
                    boxShadow: '0 8px 25px rgba(0, 153, 97, 0.45)',
                    borderRadius: '12px',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 30px rgba(0, 153, 97, 0.6)',
                    },
                  }}
                >
                  Apply as Sales Executive (/sales)
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Developer Card */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #e2e8f0',
                borderRadius: 4,
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' },
              }}
            >
              <Box sx={{ p: 3, bgcolor: '#2c3e50', color: '#ffffff' }}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip label="Engineering" color="secondary" sx={{ fontWeight: 700 }} />
                  <CodeIcon sx={{ fontSize: 32 }} />
                </Stack>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 2 }}>
                  Full-Stack Developer
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Full-Time | React, TypeScript, Node.js, Express, SQLite
                </Typography>
              </Box>
              <CardContent sx={{ p: 4, flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Build modern web applications, scalable backend REST APIs, mobile apps, and enterprise banking software platforms for Fillosoft's clients.
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
                  Key Requirements:
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, mb: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Proficiency in React, Node.js, TypeScript, SQL databases, Git & REST API architecture.
                  </Typography>
                </Paper>
                <Button
                  component={Link}
                  to="/developer"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ py: 1.5, fontWeight: 800 }}
                >
                  Open Developer Form (/developer)
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
