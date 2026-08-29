import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Slider,
  Grid,
  Chip,
  Paper,
  Stack,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalculateIcon from '@mui/icons-material/Calculate';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const SalesCalculator: React.FC = () => {
  const [monthlySales, setMonthlySales] = useState<number>(500000); // Default ₹5 Lakhs monthly sales

  // Calculation: 100% Commission Basis @ 15% on each sale
  const commissionRate = 0.15;
  const monthlyPayout = Math.round(monthlySales * commissionRate);
  const annualEarningsEstimate = Math.round(monthlyPayout * 12);

  // Chart dataset showing 15% commission growth trajectory
  const chartData = [
    { sales: 100000, label: '₹1L', payout: 15000 },
    { sales: 250000, label: '₹2.5L', payout: 37500 },
    { sales: 500000, label: '₹5L', payout: 75000 },
    { sales: 750000, label: '₹7.5L', payout: 112500 },
    { sales: 1000000, label: '₹10L', payout: 150000 },
    { sales: 1500000, label: '₹15L', payout: 225000 },
    { sales: 2000000, label: '₹20L', payout: 300000 },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <Card sx={{ border: '2px solid #009961', bgcolor: '#ffffff', borderRadius: 3, overflow: 'hidden' }}>
      {/* Header Banner */}
      <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: '#009961', color: '#ffffff' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
          <CalculateIcon sx={{ fontSize: { xs: 22, sm: 28 } }} />
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: { xs: '1.05rem', sm: '1.25rem' } }}>
            100% Commission Calculator (15% Rate)
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ opacity: 0.9, fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
          Drag the sales slider to calculate your estimated monthly & annual payouts!
        </Typography>
      </Box>

      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Slider Input */}
        <Box sx={{ mb: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1, mb: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#2c3e50', fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>
              Projected Monthly Closed Sales Revenue:
            </Typography>
            <Chip
              label={formatCurrency(monthlySales)}
              color="primary"
              sx={{ fontWeight: 800, fontSize: { xs: '0.95rem', sm: '1.1rem' }, py: 2, px: 1, alignSelf: { xs: 'flex-start', sm: 'auto' } }}
            />
          </Stack>
          <Slider
            value={monthlySales}
            min={50000}
            max={2000000}
            step={25000}
            onChange={(_, val) => setMonthlySales(val as number)}
            sx={{
              color: '#009961',
              height: 10,
              '& .MuiSlider-thumb': {
                width: 24,
                height: 24,
                bgcolor: '#ffffff',
                border: '3px solid #009961',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
              },
            }}
          />
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary">₹50K/mo</Typography>
            <Typography variant="caption" color="text.secondary">₹10L/mo</Typography>
            <Typography variant="caption" color="text.secondary">₹20L+/mo</Typography>
          </Stack>
        </Box>

        {/* 100% Commission Plan Card */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            border: '2px solid #009961',
            bgcolor: 'rgba(0, 153, 97, 0.04)',
            mb: 3,
          }}
        >
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Chip icon={<StarIcon sx={{ color: '#ffffff !important' }} />} label="100% Commission" color="success" size="small" sx={{ fontWeight: 800 }} />
            <CheckCircleIcon color="success" fontSize="small" />
          </Stack>

          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">Estimated Monthly Earnings (15%):</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#009961', my: 0.5, fontSize: { xs: '1.6rem', sm: '2.1rem' } }}>
                {formatCurrency(monthlyPayout)}
                <Typography component="span" variant="caption" color="text.secondary"> /mo</Typography>
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">Projected Annual Earnings:</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#2c3e50', my: 0.5, fontSize: { xs: '1.6rem', sm: '2.1rem' } }}>
                {formatCurrency(annualEarningsEstimate)}
                <Typography component="span" variant="caption" color="text.secondary"> /yr</Typography>
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Visual Earnings Growth Trajectory Chart */}
        <Box sx={{ pt: 0.5 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1.5 }}>
            <TrendingUpIcon sx={{ color: '#009961', fontSize: 20 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#2c3e50', fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>
              15% Commission Growth Curve
            </Typography>
          </Stack>
          <Box sx={{ width: '100%', height: { xs: 170, sm: 210 } }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPayout" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#009961" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#009961" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => `₹${v / 1000}K`} />
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <Tooltip formatter={(value: any) => [formatCurrency(Number(value)), '15% Commission']} />
                <Area type="monotone" dataKey="payout" name="Monthly Payout" stroke="#009961" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPayout)" />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
