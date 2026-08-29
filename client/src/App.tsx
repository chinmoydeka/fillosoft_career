import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Container, Typography } from '@mui/material';
import fillosoftTheme from './theme/fillosoftTheme';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { SalesPage } from './pages/SalesPage';
import { DeveloperPage } from './pages/DeveloperPage';
import { AdminPage } from './pages/AdminPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={fillosoftTheme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8fafc' }}>
          <Navbar />

          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sales" element={<SalesPage />} />
              <Route path="/developer" element={<DeveloperPage />} />
              <Route path="/hr_admin" element={<AdminPage />} />
              {/* Fallback support for /admin -> /hr_admin */}
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </Box>

          {/* Footer */}
          <Box component="footer" sx={{ py: 4, bgcolor: '#2c3e50', color: '#ffffff', mt: 'auto', borderTop: '4px solid #009961' }}>
            <Container maxWidth="lg">
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    component="img"
                    src="https://fillosoft.com/assets/img/logo3.png"
                    alt="Fillosoft Logo"
                    sx={{ height: 44, bgcolor: '#ffffff', p: 0.8, borderRadius: 1.5 }}
                  />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>
                      Fillosoft Technologies
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                      Pragjyotishnagar Bylane-12, Jalukbari, Guwahati-11, Assam | Contact: +91 7002373380
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  © {new Date().getFullYear()} Fillosoft Technologies. All rights reserved.
                </Typography>
              </Box>
            </Container>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
