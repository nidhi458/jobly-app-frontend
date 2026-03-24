import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Box,
  Button,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useWithdrawApplicationMutation } from '../../store/api';

const ApplicationCard = ({ app, onWithdraw }) => (
  <Card
    sx={{
      height: '100%',
      boxShadow: 3,
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
    }}
  >
    <CardContent sx={{ p: 3 }}>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            width: 50, height: 50,
            bgcolor: 'primary.main',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2
          }}
        >
          <Typography variant="h6" color="white" fontWeight="bold">
            {app.jobId?.company?.charAt(0)?.toUpperCase() || 'J'}
          </Typography>
        </Box>
        <Box>
          <Typography variant="h5" fontWeight="bold" color="text.primary">
            {app.jobId?.position || 'Position'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {app.jobId?.company || 'Company'}
          </Typography>
        </Box>
      </Box>

      
      <Box sx={{ mb: 2 }}>
        <Chip
          label={app.jobId?.type || 'Full Time'}
          color="success"
          size="small"
          sx={{ mr: 1, mb: 1 }}
        />
        <Chip
          label={app.jobId?.location || 'Remote'}
          color="info"
          size="small"
          variant="outlined"
        />
      </Box>

      
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        📅 Applied: {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-US') : 'Just now'}
      </Typography>

      
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Chip label="Applied" color="primary" size="small" variant="filled" />
        <Button
          size="small"
          color="error"
          variant="outlined"
          onClick={() => onWithdraw(app.jobId._id)}
        >
          Withdraw
        </Button>
      </Box>
    </CardContent>
  </Card>
);

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [withdrawApplication] = useWithdrawApplicationMutation();

  const fetchApplications = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jobs/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();

      if (response.ok) {
        setApplications(data);
      } else {
        setError(data.msg || 'Failed to fetch applications');
      }
    } catch (err) {
      console.error('Applications error:', err);
      setError('Failed to load applications. Check your connection.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleWithdraw = async (jobId) => {
    if (!window.confirm("Are you sure you want to withdraw this application?")) return;

    try {
      await withdrawApplication(jobId).unwrap();
      fetchApplications(); 
    } catch (err) {
      console.error(err);
      alert("Failed to withdraw application. Try again.");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  if (loading) {
    return (
      <Container sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" gutterBottom component="h1">
        My Applications ({applications.length})
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <Box component="span" sx={{ ml: 2 }}>
            <Button onClick={fetchApplications} size="small">Retry</Button>
          </Box>
        </Alert>
      )}

      {applications.length === 0 && !error ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No applications yet
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Apply to some jobs to see them here
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/jobs')}
            sx={{ mt: 2 }}
          >
            Browse Jobs
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {applications.map((app) => (
            <Grid item xs={12} sm={6} lg={4} key={app._id}>
              <ApplicationCard app={app} onWithdraw={handleWithdraw} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default AppliedJobs;