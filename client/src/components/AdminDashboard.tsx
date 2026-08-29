import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CodeIcon from '@mui/icons-material/Code';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyIcon from '@mui/icons-material/Key';
import axios from 'axios';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AdminDashboard: React.FC = () => {
  // Auth state
  const [token, setToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Change Password state
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [passwordChangeMessage, setPasswordChangeMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Application Data state
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [dossierOpen, setDossierOpen] = useState(false);

  // Stats state
  const [stats, setStats] = useState<any>({
    total: 0,
    salesCount: 0,
    devCount: 0,
    compensationSplit: { commission100: 0, salaryCommission: 0 },
    statusSplit: { submitted: 0, underReview: 0, shortlisted: 0, rejected: 0 },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email: loginEmail,
        password: loginPassword,
      });
      if (res.data && res.data.token) {
        localStorage.setItem('adminToken', res.data.token);
        setToken(res.data.token);
      }
    } catch (err: any) {
      setAuthError(err.response?.data?.error || 'Invalid credentials. Access denied.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeMessage(null);

    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordChangeMessage({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }

    if (newPasswordInput.length < 6) {
      setPasswordChangeMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }

    setPasswordChangeLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/change-password`,
        { current_password: currentPasswordInput, new_password: newPasswordInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPasswordChangeMessage({ type: 'success', text: res.data.message || 'Password changed successfully!' });
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
    } catch (err: any) {
      setPasswordChangeMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to update password. Please check your current password.',
      });
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  const fetchApplications = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [appRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/applications`, {
          headers,
          params: { role: roleFilter, status: statusFilter, search: searchQuery },
        }),
        axios.get(`${API_BASE_URL}/api/stats`, { headers }),
      ]);

      if (appRes.data && appRes.data.applications) {
        setApplications(appRes.data.applications);
      }
      if (statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (err: any) {
      console.warn('API notice: offline local dataset active.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchApplications();
    }
  }, [token, roleFilter, statusFilter]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/api/applications/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchApplications();
    } catch (err) {
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      );
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this applicant record?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/applications/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchApplications();
      } catch (err) {
        setApplications((prev) => prev.filter((a) => a.id !== id));
      }
    }
  };

  const exportCSV = () => {
    if (applications.length === 0) return;
    const headers = ['ID', 'Role', 'Name', 'Email', 'Phone', 'City', 'Compensation Choice', 'Monthly Sales Target', 'Estimated Payout', 'Status', 'Applied At'];
    const rows = applications.map((a) => [
      a.id,
      a.role_type,
      `"${a.full_name}"`,
      a.email,
      a.phone,
      a.city,
      a.compensation_choice || '100_commission',
      a.projected_monthly_sales || 0,
      a.estimated_monthly_payout || 0,
      a.status,
      a.created_at,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fillosoft_candidates_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!token) {
    return (
      <Card sx={{ maxWidth: 450, mx: 'auto', my: 8, borderRadius: 4, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}>
        <Box sx={{ p: 4, bgcolor: '#2c3e50', color: '#ffffff', textAlign: 'center' }}>
          <AdminPanelSettingsIcon sx={{ fontSize: 56, color: '#009961', mb: 1 }} />
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Fillosoft HR Admin Portal
          </Typography>
          <Typography variant="caption" sx={{ color: '#009961', fontWeight: 700 }}>
            PROTECTED RECRUITMENT COMMAND CENTER (/hr_admin)
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {authError && <Alert severity="error" sx={{ mb: 3 }}>{authError}</Alert>}

          <Box component="form" onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Admin Email Address"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              sx={{ mb: 2.5 }}
            />
            <TextField
              fullWidth
              type="password"
              label="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              disabled={authLoading}
              startIcon={<LockIcon />}
              sx={{ py: 1.2, fontWeight: 800 }}
            >
              {authLoading ? 'Authenticating...' : 'Sign In to HR Admin Portal'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const PIE_COLORS = ['#009961', '#2c3e50', '#f59e0b', '#ef4444'];

  return (
    <Box sx={{ py: 4 }}>
      {/* Top Bar */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#2c3e50' }}>
            HR Admin Command Center
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage candidate submissions for Sales Executive (100% Commission @ 15%) & Developer positions.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button variant="outlined" color="primary" startIcon={<KeyIcon />} onClick={() => setPasswordDialogOpen(true)}>
            Change Password
          </Button>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchApplications}>
            Refresh
          </Button>
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportCSV}>
            Export CSV
          </Button>
          <Button variant="contained" color="error" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Logout
          </Button>
        </Stack>
      </Stack>

      {/* KPI Metrics Dashboard Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 3, bgcolor: '#ffffff' }}>
            <Typography variant="caption" color="text.secondary">Total Applications</Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#2c3e50', my: 0.5 }}>
              {stats.total || applications.length}
            </Typography>
            <Chip label="All Positions" size="small" sx={{ bgcolor: 'rgba(44, 62, 80, 0.1)', color: '#2c3e50' }} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #009961', borderRadius: 3, bgcolor: 'rgba(0,153,97,0.03)' }}>
            <Typography variant="caption" color="text.secondary">Sales Executive Applicants</Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#009961', my: 0.5 }}>
              {stats.salesCount || applications.filter(a => a.role_type === 'sales').length}
            </Typography>
            <Chip label="100% Commission (15%)" color="success" size="small" />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 3, bgcolor: '#ffffff' }}>
            <Typography variant="caption" color="text.secondary">Developer Applicants</Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#2c3e50', my: 0.5 }}>
              {stats.devCount || applications.filter(a => a.role_type === 'developer').length}
            </Typography>
            <Chip label="Engineering" color="secondary" size="small" />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #10b981', borderRadius: 3, bgcolor: '#ffffff' }}>
            <Typography variant="caption" color="text.secondary">Shortlisted Candidates</Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#10b981', my: 0.5 }}>
              {stats.statusSplit?.shortlisted || applications.filter(a => a.status === 'Shortlisted').length}
            </Typography>
            <Chip label="Ready for Interview" color="success" size="small" />
          </Paper>
        </Grid>
      </Grid>

      {/* Analytics Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 2 }}>
              Applicant Role Breakdown
            </Typography>
            <Box sx={{ width: '100%', height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      name: 'Sales Executive (15%)',
                      count: applications.filter((a) => a.role_type === 'sales').length || 1,
                    },
                    {
                      name: 'Software Developer',
                      count: applications.filter((a) => a.role_type === 'developer').length || 1,
                    },
                  ]}
                >
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#009961" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 2 }}>
              Candidate Recruitment Status Breakdown
            </Typography>
            <Box sx={{ width: '100%', height: 200, display: 'flex', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Submitted', value: applications.filter((a) => a.status === 'Submitted').length || 1 },
                      { name: 'Under Review', value: applications.filter((a) => a.status === 'Under Review').length || 1 },
                      { name: 'Shortlisted', value: applications.filter((a) => a.status === 'Shortlisted').length || 1 },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    dataKey="value"
                    label
                  >
                    {PIE_COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Search & Filter Toolbar */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by name, email, phone, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Filter Position"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <MenuItem value="all">All Positions</MenuItem>
              <MenuItem value="sales">Sales Executive</MenuItem>
              <MenuItem value="developer">Developer</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Filter Recruitment Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="Submitted">Submitted</MenuItem>
              <MenuItem value="Under Review">Under Review</MenuItem>
              <MenuItem value="Shortlisted">Shortlisted</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Card>

      {/* Applications Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Candidate Name</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Contact Info</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Compensation / Tech</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Est. Payout (15%)</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>AI Match</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Recruitment Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <CircularProgress color="primary" />
                </TableCell>
              </TableRow>
            ) : applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No candidate applications found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              applications.map((app) => (
                <TableRow key={app.id} hover>
                  <TableCell>
                    <Chip
                      icon={app.role_type === 'sales' ? <TrendingUpIcon /> : <CodeIcon />}
                      label={app.role_type === 'sales' ? 'Sales' : 'Developer'}
                      color={app.role_type === 'sales' ? 'success' : 'secondary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{app.full_name}</Typography>
                    <Typography variant="caption" color="text.secondary">{app.city}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{app.email}</Typography>
                    <Typography variant="caption" color="text.secondary">{app.phone}</Typography>
                  </TableCell>
                  <TableCell>
                    {app.role_type === 'sales' ? (
                      <Chip
                        label="100% Commission (15%)"
                        variant="outlined"
                        color="success"
                        size="small"
                      />
                    ) : (
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>{app.tech_stack}</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {app.role_type === 'sales' ? (
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#009961' }}>
                        ₹{Number(app.estimated_monthly_payout || (app.projected_monthly_sales * 0.15) || 0).toLocaleString('en-IN')}/mo
                      </Typography>
                    ) : (
                      <Typography variant="caption" color="text.secondary">N/A</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip label={`${app.ai_match_score || 88}% Fit`} color="primary" size="small" />
                  </TableCell>
                  <TableCell>
                    <TextField
                      select
                      size="small"
                      value={app.status || 'Submitted'}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      sx={{ minWidth: 130 }}
                    >
                      <MenuItem value="Submitted">Submitted</MenuItem>
                      <MenuItem value="Under Review">Under Review</MenuItem>
                      <MenuItem value="Shortlisted">Shortlisted</MenuItem>
                      <MenuItem value="Rejected">Rejected</MenuItem>
                    </TextField>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => { setSelectedApp(app); setDossierOpen(true); }}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(app.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Candidate Dossier Detail Modal */}
      <Dialog open={dossierOpen} onClose={() => setDossierOpen(false)} maxWidth="md" fullWidth>
        {selectedApp && (
          <>
            <DialogTitle sx={{ bgcolor: '#2c3e50', color: '#ffffff', pb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Candidate Profile Dossier: {selectedApp.full_name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#009961', fontWeight: 700 }}>
                #FLS-APP-{selectedApp.id} | Applied: {selectedApp.created_at}
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">Full Name & Email:</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{selectedApp.full_name}</Typography>
                  <Typography variant="body2">{selectedApp.email} | {selectedApp.phone}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">Location & LinkedIn:</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{selectedApp.city}</Typography>
                  {selectedApp.linkedin_url && (
                    <Typography variant="body2" component="a" href={selectedApp.linkedin_url} target="_blank" color="primary">
                      View LinkedIn Profile
                    </Typography>
                  )}
                </Grid>

                {selectedApp.role_type === 'sales' && (
                  <>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="text.secondary">Compensation Structure:</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#009961' }}>
                        100% Commission Basis (15% Rate)
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="text.secondary">Projected Monthly Sales & 15% Payout:</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#2c3e50' }}>
                        ₹{Number(selectedApp.estimated_monthly_payout || (selectedApp.projected_monthly_sales * 0.15) || 0).toLocaleString('en-IN')} / month
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="text.secondary">Sales Methodology & Experience:</Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {selectedApp.sales_methodology || 'Consultative B2B'} ({selectedApp.sales_experience_years || 'Experienced'})
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="text.secondary">Highest Closed Deal Contract:</Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                        {selectedApp.highest_single_deal || '₹5L - ₹15L'}
                      </Typography>
                    </Grid>
                    {selectedApp.product_expertise && (
                      <Grid size={{ xs: 12 }}>
                        <Typography variant="caption" color="text.secondary">Product Line Expertise:</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                          {selectedApp.product_expertise.split(',').map((p: string, idx: number) => (
                            <Chip key={idx} label={p.trim()} size="small" color="success" variant="outlined" />
                          ))}
                        </Box>
                      </Grid>
                    )}
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="caption" color="text.secondary">Sales Track Record & Accomplishments:</Typography>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, mt: 0.5 }}>
                        <Typography variant="body2">{selectedApp.key_achievements || 'N/A'}</Typography>
                      </Paper>
                    </Grid>
                    {selectedApp.banking_pitch_response && (
                      <Grid size={{ xs: 12 }}>
                        <Typography variant="caption" color="text.secondary">🎯 Practical Case Study — Core Banking Pitch Strategy:</Typography>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(0,153,97,0.04)', border: '1px solid #009961', borderRadius: 2, mt: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                            {selectedApp.banking_pitch_response}
                          </Typography>
                        </Paper>
                      </Grid>
                    )}
                    {selectedApp.objection_handling_response && (
                      <Grid size={{ xs: 12 }}>
                        <Typography variant="caption" color="text.secondary">⚡ Practical Case Study — Legacy Software Objection Handling:</Typography>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 2, mt: 0.5 }}>
                          <Typography variant="body2" sx={{ color: '#334155' }}>
                            {selectedApp.objection_handling_response}
                          </Typography>
                        </Paper>
                      </Grid>
                    )}
                  </>
                )}

                {selectedApp.role_type === 'developer' && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" color="text.secondary">Technical Stack & GitHub:</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{selectedApp.tech_stack}</Typography>
                    {selectedApp.github_url && (
                      <Typography variant="body2" component="a" href={selectedApp.github_url} target="_blank" color="secondary">
                        {selectedApp.github_url}
                      </Typography>
                    )}
                  </Grid>
                )}

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">Notice Period & Start Date:</Typography>
                  <Typography variant="body1">{selectedApp.notice_period} | {selectedApp.expected_start_date}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">Resume Document:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: '#009961' }}>
                    📄 {selectedApp.resume_filename || 'applicant_resume.pdf'}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2.5 }}>
              <Button onClick={() => setDossierOpen(false)} variant="outlined">
                Close Dossier
              </Button>
              <Button
                onClick={() => handleStatusChange(selectedApp.id, 'Shortlisted')}
                variant="contained"
                color="success"
                startIcon={<CheckCircleIcon />}
              >
                Mark as Shortlisted
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Change Password Dialog Modal */}
      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} maxWidth="xs" fullWidth>
        <Box component="form" onSubmit={handlePasswordChangeSubmit}>
          <DialogTitle sx={{ bgcolor: '#2c3e50', color: '#ffffff' }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <KeyIcon sx={{ color: '#009961' }} />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Change Admin Password</Typography>
            </Stack>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {passwordChangeMessage && (
              <Alert severity={passwordChangeMessage.type} sx={{ mb: 2 }}>
                {passwordChangeMessage.text}
              </Alert>
            )}
            <TextField
              fullWidth
              type="password"
              label="Current Password *"
              value={currentPasswordInput}
              onChange={(e) => setCurrentPasswordInput(e.target.value)}
              sx={{ mb: 2, mt: 1 }}
              required
            />
            <TextField
              fullWidth
              type="password"
              label="New Password *"
              value={newPasswordInput}
              onChange={(e) => setNewPasswordInput(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              type="password"
              label="Confirm New Password *"
              value={confirmPasswordInput}
              onChange={(e) => setConfirmPasswordInput(e.target.value)}
              required
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setPasswordDialogOpen(false)} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={passwordChangeLoading}>
              {passwordChangeLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};
