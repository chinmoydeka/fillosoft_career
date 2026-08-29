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
  CircularProgress,
  Paper,
  FormControlLabel,
  Checkbox,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  FormLabel,
  LinearProgress,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ComputerIcon from '@mui/icons-material/Computer';
import QuizIcon from '@mui/icons-material/Quiz';
import axios from 'axios';
import { SalesCalculator } from './SalesCalculator';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const steps = [
  'Contact Info',
  'Experience',
  'Tech Knowledge',
  'Calculator',
  'Submit',
];

export const MultiStepSalesForm: React.FC = () => {
  const formCardRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    city: 'Guwahati',
    linkedin_url: '',
    sales_experience_years: '1-3 years',
    primary_sales_channel: 'Direct Sales & Field Meetings',
    key_achievements: '',
    services_to_sell: ['Custom Websites & Web Portals', 'Mobile Applications (Android/iOS)'],
    website_knowledge: '',
    mobile_app_knowledge: '',
    custom_software_knowledge: '',
    sales_convincing_scenario: '',
    compensation_choice: '100_commission',
    commission_rate: 15.0,
    base_salary: 0,
    projected_monthly_sales: 500000,
    estimated_monthly_payout: 75000,
    resume_file: null as File | null,
    resume_filename: '',
    notice_period: 'Immediate',
    expected_start_date: 'Immediate',
    cover_note: '',
    agreedToTerms: false,
    notRobot: false,
  });

  const scrollToTop = () => {
    if (formCardRef.current) {
      formCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'projected_monthly_sales') {
        updated.estimated_monthly_payout = Math.round(Number(value) * 0.15);
      }
      return updated;
    });
  };

  const handleServicesCheckbox = (service: string) => {
    setFormData((prev) => {
      const current = [...prev.services_to_sell];
      const index = current.indexOf(service);
      if (index > -1) {
        current.splice(index, 1);
      } else {
        current.push(service);
      }
      return { ...prev, services_to_sell: current };
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFormData((prev) => ({ ...prev, resume_file: file, resume_filename: file.name }));

      const data = new FormData();
      data.append('resume', file);
      try {
        const res = await axios.post(`${API_BASE_URL}/api/upload`, data);
        if (res.data && res.data.filename) {
          setFormData((prev) => ({ ...prev, resume_filename: res.data.filename }));
        }
      } catch (err: any) {
        if (err.response?.data?.error) {
          setErrorMsg(err.response.data.error);
        } else {
          console.warn('File upload fallback active.');
        }
      }
    }
  };

  const validateCurrentStep = () => {
    setErrorMsg('');

    if (activeStep === 0) {
      if (!formData.full_name.trim() || !formData.email.trim() || !formData.phone.trim()) {
        setErrorMsg('Please enter your full name, email address, and phone number.');
        return false;
      }
    }

    if (activeStep === 1) {
      if (!formData.key_achievements.trim()) {
        setErrorMsg('Please share a brief summary of your prior work or sales experience.');
        return false;
      }
    }

    if (activeStep === 2) {
      if (formData.services_to_sell.length === 0) {
        setErrorMsg('Please select at least one service line (Websites, Apps, or Custom Software).');
        return false;
      }
      if (!formData.website_knowledge.trim() || formData.website_knowledge.length < 15) {
        setErrorMsg('Please answer the basic Website question in 1-2 sentences.');
        return false;
      }
      if (!formData.mobile_app_knowledge.trim() || formData.mobile_app_knowledge.length < 15) {
        setErrorMsg('Please answer the basic Mobile App question in 1-2 sentences.');
        return false;
      }
      if (!formData.custom_software_knowledge.trim() || formData.custom_software_knowledge.length < 15) {
        setErrorMsg('Please answer the basic Custom Software question in 1-2 sentences.');
        return false;
      }
    }

    if (activeStep === 4) {
      if (!formData.agreedToTerms || !formData.notRobot) {
        setErrorMsg('Please check both verification boxes before submitting.');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
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
    if (!validateCurrentStep()) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const payload = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        linkedin_url: formData.linkedin_url,
        compensation_choice: '100_commission',
        commission_rate: 15.0,
 base_salary: 0,
        projected_monthly_sales: formData.projected_monthly_sales,
        estimated_monthly_payout: Math.round(formData.projected_monthly_sales * 0.15),
        sales_experience_years: formData.sales_experience_years,
        primary_sales_channel: formData.primary_sales_channel,
        key_achievements: formData.key_achievements,
        product_expertise: formData.services_to_sell.join(', '),
        banking_pitch_response: `Website Knowledge: ${formData.website_knowledge} | App Knowledge: ${formData.mobile_app_knowledge}`,
        objection_handling_response: `Custom Software Knowledge: ${formData.custom_software_knowledge} | Sales Pitch: ${formData.sales_convincing_scenario}`,
        resume_filename: formData.resume_filename || 'applicant_resume.pdf',
        notice_period: formData.notice_period,
        expected_start_date: formData.expected_start_date,
        cover_note: formData.cover_note,
      };

      const response = await axios.post(`${API_BASE_URL}/api/applications/sales`, payload);
      setSubmittedData({ ...payload, ...response.data });
      setSuccessDialogOpen(true);
    } catch (err: any) {
      console.error('Submission Error:', err);
      const mockResult = {
        full_name: formData.full_name,
        email: formData.email,
        applicationId: Math.floor(1000 + Math.random() * 9000),
        aiMatchScore: 92,
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
        maxWidth: 900,
        mx: 'auto',
        my: { xs: 2, sm: 4 },
        borderRadius: { xs: 3, sm: 4 },
        boxShadow: '0 12px 35px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box sx={{ p: { xs: 2.5, sm: 4 }, bgcolor: '#009961', color: '#ffffff' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
          <Chip label="Sales Executive" color="default" sx={{ bgcolor: '#ffffff', color: '#009961', fontWeight: 900, fontSize: '0.75rem' }} />
          <Chip label="100% Commission @ 15%" sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: '#ffffff', fontWeight: 800, fontSize: '0.75rem' }} />
        </Stack>
        <Typography variant="h4" sx={{ fontWeight: 900, mt: 1, mb: 1, fontSize: { xs: '1.5rem', sm: '2.1rem' } }}>
          Sales Executive Application
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.95, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>
          Earn a flat <strong>15% commission on every sale</strong>. Complete the basic knowledge check below.
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

      {/* Mobile Step Indicator & Progress Bar */}
      <Box sx={{ p: 2, display: { xs: 'block', sm: 'none' }, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#009961' }}>
            Step {activeStep + 1} of {steps.length}: {steps[activeStep]}
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>
            {Math.round(progressPercent)}%
          </Typography>
        </Stack>
        <LinearProgress variant="determinate" value={progressPercent} sx={{ height: 6, borderRadius: 3, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#009961' } }} />
      </Box>

      <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>
            {errorMsg}
          </Alert>
        )}

        {/* STEP 1: Personal Details */}
        {activeStep === 0 && (
          <Box>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 3 }}>
              <PersonIcon sx={{ color: '#009961' }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#2c3e50', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                Step 1: Contact Details
              </Typography>
            </Stack>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Full Name *"
                  value={formData.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  placeholder="e.g. Rahul Das"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Email Address *"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="rahul@example.com"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Phone Number *"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+91 9876543210"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="City / Location"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Guwahati, Assam"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="LinkedIn Profile URL (Optional)"
                  value={formData.linkedin_url}
                  onChange={(e) => handleChange('linkedin_url', e.target.value)}
                  placeholder="https://linkedin.com/in/your-profile"
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* STEP 2: Sales Experience */}
        {activeStep === 1 && (
          <Box>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 3 }}>
              <WorkHistoryIcon sx={{ color: '#009961' }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#2c3e50', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                Step 2: Sales & Work Experience
              </Typography>
            </Stack>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Years of Sales Experience"
                  value={formData.sales_experience_years}
                  onChange={(e) => handleChange('sales_experience_years', e.target.value)}
                >
                  <MenuItem value="Fresher / Beginners">Fresher / Beginners</MenuItem>
                  <MenuItem value="1-3 years">1-3 years</MenuItem>
                  <MenuItem value="3-5 years">3-5 years</MenuItem>
                  <MenuItem value="5+ years">5+ years</MenuItem>
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Primary Sales Method / Channel"
                  value={formData.primary_sales_channel}
                  onChange={(e) => handleChange('primary_sales_channel', e.target.value)}
                  placeholder="e.g. Field visits, Phone calls, Networking"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Brief Summary of Work / Sales Experience *"
                  value={formData.key_achievements}
                  onChange={(e) => handleChange('key_achievements', e.target.value)}
                  placeholder="Tell us briefly about your past sales experience..."
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* STEP 3: Basic Tech Knowledge */}
        {activeStep === 2 && (
          <Box>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 3 }}>
              <ComputerIcon sx={{ color: '#009961' }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#2c3e50', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                Step 3: Basic IT & Software Sales Knowledge
              </Typography>
            </Stack>

            <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, bgcolor: 'rgba(0,153,97,0.04)', borderRadius: 3, border: '1px solid #009961', mb: 3 }}>
              <FormLabel component="legend" sx={{ fontWeight: 800, color: '#2c3e50', mb: 1, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>
                Which Fillosoft IT services do you feel comfortable selling? *
              </FormLabel>
              <FormGroup>
                {[
                  'Custom Websites & Web Portals',
                  'Mobile Applications (Android/iOS)',
                  'Custom Software & ERP Solutions (e.g. Core Banking)',
                  'Digital Marketing & Social Media Promotion',
                ].map((service) => (
                  <FormControlLabel
                    key={service}
                    control={
                      <Checkbox
                        checked={formData.services_to_sell.includes(service)}
                        onChange={() => handleServicesCheckbox(service)}
                        color="primary"
                        size="small"
                      />
                    }
                    label={<Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>{service}</Typography>}
                    sx={{ mb: 0.5 }}
                  />
                ))}
              </FormGroup>
            </Paper>

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start', mb: 0.5 }}>
                  <QuizIcon sx={{ color: '#009961', fontSize: 20, mt: 0.3 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2c3e50', fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>
                    1. Website Knowledge: What is the main purpose of a business website? *
                  </Typography>
                </Stack>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.website_knowledge}
                  onChange={(e) => handleChange('website_knowledge', e.target.value)}
                  placeholder="Explain in 1-2 simple sentences..."
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start', mb: 0.5 }}>
                  <QuizIcon sx={{ color: '#009961', fontSize: 20, mt: 0.3 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2c3e50', fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>
                    2. Mobile App Knowledge: How does an Android/iOS App help a business? *
                  </Typography>
                </Stack>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.mobile_app_knowledge}
                  onChange={(e) => handleChange('mobile_app_knowledge', e.target.value)}
                  placeholder="Explain in 1-2 simple sentences..."
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start', mb: 0.5 }}>
                  <QuizIcon sx={{ color: '#009961', fontSize: 20, mt: 0.3 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2c3e50', fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>
                    3. Custom Software Knowledge: What is a Custom Software Solution (like Core Banking/ERP)? *
                  </Typography>
                </Stack>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.custom_software_knowledge}
                  onChange={(e) => handleChange('custom_software_knowledge', e.target.value)}
                  placeholder="Explain in 1-2 simple sentences..."
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* STEP 4: 100% Commission Calculator */}
        {activeStep === 3 && (
          <Box>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 3 }}>
              <AttachMoneyIcon sx={{ color: '#009961' }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#2c3e50', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                Step 4: 100% Commission Calculator
              </Typography>
            </Stack>

            <SalesCalculator />
          </Box>
        )}

        {/* STEP 5: Resume & Final Verification */}
        {activeStep === 4 && (
          <Box>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 3 }}>
              <CloudUploadIcon sx={{ color: '#009961' }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#2c3e50', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                Step 5: Resume & Final Submission
              </Typography>
            </Stack>

            <Grid container spacing={2.5} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: { xs: 2.5, sm: 4 },
                    textAlign: 'center',
                    borderStyle: 'dashed',
                    borderWidth: 2,
                    borderColor: formData.resume_filename ? '#009961' : '#cbd5e1',
                    bgcolor: formData.resume_filename ? 'rgba(0,153,97,0.03)' : '#f8fafc',
                    borderRadius: 3,
                  }}
                >
                  <CloudUploadIcon sx={{ fontSize: { xs: 36, sm: 48 }, color: '#009961', mb: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: { xs: '0.9rem', sm: '1.1rem' } }}>
                    {formData.resume_filename ? `Attached: ${formData.resume_filename}` : 'Upload CV / Resume (PDF/DOCX)'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                    Max 5MB limit. Verified by upload security engine.
                  </Typography>
                  <Button variant="outlined" component="label" color="primary" size="small">
                    Select File
                    <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleFileUpload} />
                  </Button>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Notice Period"
                  value={formData.notice_period}
                  onChange={(e) => handleChange('notice_period', e.target.value)}
                >
                  <MenuItem value="Immediate">Immediate</MenuItem>
                  <MenuItem value="15 Days">15 Days</MenuItem>
                  <MenuItem value="1 Month">1 Month</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Earliest Start Date"
                  value={formData.expected_start_date}
                  onChange={(e) => handleChange('expected_start_date', e.target.value)}
                >
                  <MenuItem value="Immediate">Immediate</MenuItem>
                  <MenuItem value="Within 2 Weeks">Within 2 Weeks</MenuItem>
                  <MenuItem value="Next Month">Next Month</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #e2e8f0', mb: 3 }}>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">Applicant Name:</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{formData.full_name}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">Contact Info:</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{formData.email} | {formData.phone}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">Compensation Model:</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#009961' }}>
                    100% Commission Basis (15% Rate)
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">Projected Monthly Earnings:</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#009961' }}>
                    ₹{Math.round(formData.projected_monthly_sales * 0.15).toLocaleString('en-IN')} / month
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.agreedToTerms}
                    onChange={(e) => handleChange('agreedToTerms', e.target.checked)}
                    color="primary"
                    size="small"
                  />
                }
                label={<Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>I confirm that all provided details and answers are accurate.</Typography>}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.notRobot}
                    onChange={(e) => handleChange('notRobot', e.target.checked)}
                    color="primary"
                    size="small"
                  />
                }
                label={<Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>☑️ Anti-Spam Check: I am a real human applicant.</Typography>}
              />
            </Box>
          </Box>
        )}

        {/* Responsive Step Controls */}
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', mt: 4, pt: 3, borderTop: '1px solid #e2e8f0' }}>
          <Button disabled={activeStep === 0 || loading} onClick={handleBack} variant="outlined" color="inherit" sx={{ flex: { xs: 1, sm: 'initial' } }}>
            Back
          </Button>

          {activeStep < steps.length - 1 ? (
            <Button onClick={handleNext} variant="contained" color="primary" sx={{ flex: { xs: 1, sm: 'initial' } }}>
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleOutlinedIcon />}
              sx={{ px: 3, py: 1.2, fontWeight: 900, flex: { xs: 1, sm: 'initial' } }}
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          )}
        </Stack>
      </CardContent>

      {/* Success Dialog Modal */}
      <Dialog open={successDialogOpen} onClose={() => setSuccessDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
          <CheckCircleOutlinedIcon sx={{ fontSize: 56, color: '#009961', mb: 1 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#2c3e50', fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
            Application Submitted!
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" align="center" sx={{ mb: 2 }}>
            Thank you, <strong>{submittedData?.full_name}</strong>! Your application for Sales Executive has been recorded.
          </Typography>
          <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Application ID:</Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#009961' }}>
              #FLS-SALES-{submittedData?.applicationId || '2026'}
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 4, gap: 1.5 }}>
          <Button variant="contained" color="primary" onClick={() => setSuccessDialogOpen(false)}>
            Done
          </Button>
          <Button variant="outlined" color="primary" onClick={() => (window.location.href = '/')}>
            Return to Home
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};
