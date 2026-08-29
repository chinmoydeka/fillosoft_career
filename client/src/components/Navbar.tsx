import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CodeIcon from '@mui/icons-material/Code';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HomeIcon from '@mui/icons-material/Home';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: 'Home', path: '/', icon: <HomeIcon fontSize="small" /> },
    {
      label: 'Sales Executive',
      path: '/sales',
      icon: <TrendingUpIcon fontSize="small" />,
      badge: 'Focus',
    },
    { label: 'Developer', path: '/developer', icon: <CodeIcon fontSize="small" /> },
  ];

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(226, 232, 240, 0.8)' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 76 }}>
          {/* Official Fillosoft Brand Logo */}
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: 1.5 }}>
            <Box
              component="img"
              src="https://fillosoft.com/assets/img/logo3.png"
              alt="Fillosoft Logo"
              sx={{
                height: 48,
                maxWidth: 180,
                objectFit: 'contain',
              }}
            />
            <Chip
              label="CAREERS"
              size="small"
              sx={{
                bgcolor: '#009961',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.7rem',
                letterSpacing: '1px',
                height: 22,
              }}
            />
          </Box>

          {/* Desktop Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  variant={isActive ? 'contained' : 'text'}
                  color="primary"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: isActive ? '#fff' : '#475569',
                    px: 2,
                    py: 0.8,
                    borderRadius: '10px',
                    position: 'relative',
                    '&:hover': {
                      backgroundColor: isActive ? '#007a4d' : 'rgba(0, 153, 97, 0.08)',
                      color: isActive ? '#fff' : '#009961',
                    },
                  }}
                >
                  {item.label}
                  {item.badge && (
                    <Chip
                      label={item.badge}
                      size="small"
                      sx={{
                        ml: 1,
                        height: 20,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        bgcolor: isActive ? 'rgba(255,255,255,0.25)' : '#009961',
                        color: '#ffffff',
                      }}
                    />
                  )}
                </Button>
              );
            })}
          </Box>

          {/* Mobile Menu Icon */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' }, color: '#2c3e50' }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        slotProps={{ paper: { sx: { width: 280, p: 2 } } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, pb: 2, borderBottom: '1px solid #e2e8f0' }}>
          <Box
            component="img"
            src="https://fillosoft.com/assets/img/logo3.png"
            alt="Fillosoft Logo"
            sx={{ height: 36, objectFit: 'contain' }}
          />
        </Box>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={handleDrawerToggle}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(0, 153, 97, 0.12)',
                    color: '#009961',
                    fontWeight: 700,
                  },
                }}
              >
                <Box sx={{ mr: 2, display: 'flex', color: location.pathname === item.path ? '#009961' : '#64748b' }}>
                  {item.icon}
                </Box>
                <ListItemText primary={item.label} slotProps={{ primary: { sx: { fontWeight: 600 } } }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
};
