import { useState } from 'react';
import { useGetJobsQuery } from '../../store/api';
import JobCard from './JobCard';
import {
  Container,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  Box,
  Button,
  InputAdornment,
} from '@mui/material';
import { Search, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const JobList = ({ adminView = false }) => {
  const { data: jobs = [], isLoading } = useGetJobsQuery();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const navigate = useNavigate();

  const uniqueLocations = [...new Set(jobs.map(job => job.location).filter(Boolean))];

  const filteredJobs = jobs.filter(job =>
    job?.company?.toLowerCase().includes(search.toLowerCase()) &&
    (!location || job?.location === location) &&
    (!type || job?.type === type)
  );

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">Loading jobs...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f5f6fa', minHeight: '100vh' }}>
      {!adminView && (
        <Box sx={{ bgcolor: '#1a1a2e', py: { xs: 5, md: 7 }, px: 2, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={700} color="white" mb={1}>
            Find Your Next Job
          </Typography>
          <Typography variant="body1" color="grey.400" mb={4}>
            {filteredJobs.length} open position{filteredJobs.length !== 1 ? 's' : ''} waiting for you
          </Typography>
          <Box sx={{ maxWidth: 520, mx: 'auto', bgcolor: 'white', borderRadius: 2, display: 'flex', alignItems: 'center', px: 2, py: 0.5, boxShadow: 3 }}>
            <Search sx={{ color: 'grey.400', mr: 1 }} />
            <TextField
              fullWidth
              placeholder="Search by company name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              variant="standard"
              InputProps={{ disableUnderline: true }}
              sx={{ py: 0.5 }}
            />
          </Box>
        </Box>
      )}

      <Container sx={{ pt: 4, pb: 6 }}>
        
        {adminView && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h5" fontWeight={700}>Admin Dashboard</Typography>
              <Typography variant="body2" color="text.secondary">
                {(search || location || type)
                  ? `${filteredJobs.length} of ${jobs.filter(job => job?.company).length} jobs`
                  : `${jobs.length} jobs`}
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/admin/create-job')}
              sx={{ bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#2d2d4e' }, borderRadius: 2, fontWeight: 600, px: 2.5 }}
            >
              Create Job
            </Button>
          </Box>
        )}

        
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', alignItems: 'center' }}>
          {adminView && (
            <TextField
              placeholder="Search company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ minWidth: 200, bgcolor: 'white', borderRadius: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" sx={{ color: 'grey.400' }} />
                  </InputAdornment>
                )
              }}
            />
          )}
          <FormControl size="small" sx={{ minWidth: 150, bgcolor: 'white', borderRadius: 1 }}>
            <InputLabel>Location</InputLabel>
            <Select value={location} onChange={(e) => setLocation(e.target.value)} label="Location">
              <MenuItem value="">All Locations</MenuItem>
              {uniqueLocations.map(loc => (
                <MenuItem key={loc} value={loc}>{loc}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150, bgcolor: 'white', borderRadius: 1 }}>
            <InputLabel>Type</InputLabel>
            <Select value={type} onChange={(e) => setType(e.target.value)} label="Type">
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="Full Time">Full Time</MenuItem>
              <MenuItem value="Part Time">Part Time</MenuItem>
            </Select>
          </FormControl>
          {(location || type || search) && (
            <Button
              size="small"
              onClick={() => { setLocation(''); setType(''); setSearch(''); }}
              sx={{ color: 'error.main', fontSize: 12 }}
            >
              Clear filters
            </Button>
          )}
        </Box>

        
        {filteredJobs.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {adminView ? 'No jobs found' : 'No jobs match your filters'}
            </Typography>
            {!adminView && (
              <Button size="small" onClick={() => { setLocation(''); setType(''); setSearch(''); }}>
                Clear filters
              </Button>
            )}
            {adminView && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/admin/create-job')}
                sx={{ mt: 1, bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#2d2d4e' }, borderRadius: 2 }}
              >
                Create your first job
              </Button>
            )}
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredJobs.map(job => (
              <Grid item xs={12} sm={6} lg={4} key={job._id}>
                <JobCard job={job} adminView={adminView} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default JobList;