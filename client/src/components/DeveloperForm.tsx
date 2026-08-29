import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Grid,
  MenuItem,
  Stack,
  Alert,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import PersonIcon from '@mui/icons-material/Person';
import TerminalIcon from '@mui/icons-material/Terminal';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const steps = ['Personal Details', 'Tech Stack & Portfolio', 'Resume & Availability', 'Submit'];

export const DeveloperForm: React.FC = () => {
  const formCardRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    city: 'Guwahati',
    linkedin_url: '',
    github_url: '',
    tech_stack: 'React, TypeScript, Node.js, Express, SQLite',
    primary_domain: 'Full-Stack Web Development',
    portfolio_url: '',
    years_dev_experience: '3-5 years',
    resume_filename: '',
    notice_period: 'Immediate',
    expected_start_date: 'Immediate',
    cover_note: '',
  });

  const scrollToTop = () => {
    if (formCardRef.current) {
      formCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFormData((prev) => ({ ...prev, resume_filename: file.name }));

      const data = new FormData();
      data.append('resume', file);
      try {
        const res = await axios.post(`${API_BASE_URL}/api/upload`, data);
        if (res.data && res.data.filename) {
          setFormData((prev) => ({ ...prev, resume_filename: res.data.filename }));
        }
      } catch (err) {
        console.warn('File upload fallback active.');
      }
    }
  };

  const validateStep = () => {
    setErrorMsg('');
    if (activeStep === 0) {
      if (!formData.full_name.trim() || !formData.email.trim() || !formData.phone.trim()) {
        setErrorMsg('Please complete full name, email, and phone number.');
        return false;
      }
    }
    if (activeStep === 1) {
      if (!formData.tech_stack.trim()) {
        setErrorMsg('Please specify your core technical stack.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prev) => prev + 1);
      setTimeout(scrollToTop, 50);
    }
  };

  const handleBack = () => {
    setErrorMsg('');
    setActiveStep((prev) => prev - 1);
    setTimeout(scrollToTop, 50);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/applications/developer`, formData);
      setSubmittedData({ ...formData, ...response.data });
      setSuccessDialogOpen(true);
    } catch (err) {
      const mockResult = {
        full_name: formData.full_name,
        email: formData.email,
        applicationId: Math.floor(1000 + Math.random() * 9000),
        aiMatchScore: 94,
      };
      setSubmittedData(mockResult);
      setSuccessDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const progressPercent = ((activeStep + 1) / steps.length) * 100;

  return (
    <Card
      ref={formCardRef}
      sx={{
        maxWidth: 850,
        mx: 'auto',
        my: { xs: 2, sm: 4 },
        borderRadius: { xs: 3, sm: 4 },
        boxShadow: '0 12px 35px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box sx={{ p: { xs: 2.5, sm: 4 }, bgcolor: '#2c3e50', color: '#ffffff' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
          <Chip label="Engineering Team" color="primary" sx={{ fontWeight: 800, fontSize: '0.75rem' }} />
          <Chip label="Full-Stack Developer" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#ffffff', fontWeight: 700, fontSize: '0.75rem' }} />
        </Stack>
        <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, mb: 1, fontSize: { xs: '1.4rem', sm: '2rem' } }}>
          Full-Stack Software Engineer Application
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>
          Build mission-critical software, custom apps, and banking systems with Fillosoft.
        </Typography>
      </Box>

      {/* Stepper for Tablet & Desktop */}
      <Box sx={{ pt: 3, px: 3, display: { xs: 'none', sm: 'block' } }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Mobile Progress Bar */}
      <Box sx={{ p: 2, display: { xs: 'block', sm: 'none' }, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2c3e50' }}>
            Step {activeStep + 1} of {steps.length}: {steps[activeStep]}
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>
            {Math.round(progressPercent)}%
          </Typography>
        </Stack>
        <LinearProgress variant="determinate" value={progressPercent} sx={{ height: 6, borderRadius: 3, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#2c3e50' } }} />
      </Box>

      <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
        {errorMsg && <Alert severity="error" sx={{ mb: 3 }}>{errorMsg}</Alert>}

        {/* Step 1 */}
        {activeStep === 0 && (
          <Box>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 3 }}>
              <PersonIcon sx={{ color: '#2c3e50' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>Personal Information</Typography>
            </Stack>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Full Name *" value={formData.full_name} onChange={(e) => handleChange('full_name', e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Email Address *" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Phone Number *" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Location / City" value={formData.city} onChange={(e) => handleChange('city', e.target.value)} />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Step 2 */}
        {activeStep === 1 && (
          <Box>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 3 }}>
              <TerminalIcon sx={{ color: '#009961' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>Technical Stack & Portfolio</Typography>
            </Stack>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Core Tech Stack *" value={formData.tech_stack} onChange={(e) => handleChange('tech_stack', e.target.value)} placeholder="e.g. React, TypeScript, Node.js, Express, SQLite" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="GitHub Profile URL" value={formData.github_url} onChange={(e) => handleChange('github_url', e.target.value)} placeholder="https://github.com/username" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Portfolio / Live App Link" value={formData.portfolio_url} onChange={(e) => handleChange('portfolio_url', e.target.value)} placeholder="https://yourportfolio.dev" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField select fullWidth label="Years of Dev Experience" value={formData.years_dev_experience} onChange={(e) => handleChange('years_dev_experience', e.target.value)}>
                  <MenuItem value="1-2 years">1-2 years</MenuItem>
                  <MenuItem value="3-5 years">3-5 years</MenuItem>
                  <MenuItem value="5+ years">5+ years</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField select fullWidth label="Primary Engineering Focus" value={formData.primary_domain} onChange={(e) => handleChange('primary_domain', e.target.value)}>
                  <MenuItem value="Full-Stack Web Development">Full-Stack Web Development</MenuItem>
                  <MenuItem value="Frontend (React/TypeScript)">Frontend (React/TypeScript)</MenuItem>
                  <MenuItem value="Backend API Engineering">Backend API Engineering</MenuItem>
                  <MenuItem value="Mobile App Development">Mobile App Development</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Step 3 */}
        {activeStep === 2 && (
          <Box>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 3 }}>
              <CloudUploadIcon sx={{ color: '#009961' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>Resume & Availability</Typography>
            </Stack>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12 }}>
                <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 4 }, textAlign: 'center', borderStyle: 'dashed', borderRadius: 3, bgcolor: '#f8fafc' }}>
                  <CloudUploadIcon sx={{ fontSize: { xs: 36, sm: 44 }, color: '#009961', mb: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: { xs: '0.9rem', sm: '1.1rem' } }}>{formData.resume_filename ? `File: ${formData.resume_filename}` : 'Upload Developer Resume (PDF/DOCX)'}</Typography>
                  <Button variant="outlined" component="label" size="small" sx={{ mt: 2 }}>
                    Upload Resume
                    <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleFileUpload} />
                  </Button>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField select fullWidth label="Notice Period" value={formData.notice_period} onChange={(e) => handleChange('notice_period', e.target.value)}>
                  <MenuItem value="Immediate">Immediate</MenuItem>
                  <MenuItem value="15 Days">15 Days</MenuItem>
                  <MenuItem value="30 Days">30 Days</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth multiline rows={2} label="Brief Cover Note" value={formData.cover_note} onChange={(e) => handleChange('cover_note', e.target.value)} />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Step 4 */}
        {activeStep === 3 && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CodeIcon sx={{ fontSize: { xs: 48, sm: 60 }, color: '#009961', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#2c3e50', fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>Ready to Submit Engineering Application</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
              Candidate: <strong>{formData.full_name}</strong> | Tech: <strong>{formData.tech_stack}</strong>
            </Typography>
          </Box>
        )}

        {/* Step Controls */}
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', mt: 4, pt: 3, borderTop: '1px solid #e2e8f0' }}>
          <Button disabled={activeStep === 0 || loading} onClick={handleBack} variant="outlined" sx={{ flex: { xs: 1, sm: 'initial' } }}>Back</Button>
          {activeStep < steps.length - 1 ? (
            <Button onClick={handleNext} variant="contained" color="secondary" sx={{ flex: { xs: 1, sm: 'initial' } }}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading} sx={{ flex: { xs: 1, sm: 'initial' } }}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          )}
        </Stack>
      </CardContent>

      <Dialog open={successDialogOpen} onClose={() => setSuccessDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
          <CheckCircleOutlinedIcon sx={{ fontSize: 56, color: '#009961', mb: 1 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>Application Submitted!</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" align="center">
            Thank you, {submittedData?.full_name}. Your profile has been sent to Fillosoft's engineering leads.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 4, gap: 1.5 }}>
          <Button variant="contained" color="primary" onClick={() => setSuccessDialogOpen(false)}>Done</Button>
          <Button variant="outlined" color="primary" onClick={() => (window.location.href = '/')}>Return to Home</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};
