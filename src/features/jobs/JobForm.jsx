import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Button, 
  Typography, 
  Alert, 
  Box,
  Grid 
} from '@mui/material';
import { 
  useCreateJobMutation, 
  useUpdateJobMutation,
  useGetJobsQuery 
} from '../../store/api';

const JobForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const { data: allJobs } = useGetJobsQuery();
  const [createJob, { isLoading: creating, error: createError }] = useCreateJobMutation();
  const [updateJob, { isLoading: updating, error: updateError }] = useUpdateJobMutation();

  // Form state matching Job schema
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    type: 'Full Time',
    location: '',
  });

  // Load job data for edit
  useEffect(() => {
    if (isEdit && allJobs) {
      const job = allJobs.find(job => job._id === id);
      if (job) {
        setFormData({
          company: job.company || '',
          position: job.position || '',
          type: job.type || 'Full Time',
          location: job.location || '',
        });
      }
    }
  }, [id, allJobs, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateJob({ id, ...formData }).unwrap();
      } else {
        await createJob(formData).unwrap();
      }
      navigate('/admin/jobs'); // Back to admin list
    } catch (err) {
      console.error('Job save error:', err);
    }
  };

  const isLoading = creating || updating;
  const error = createError || updateError;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {isEdit ? 'Edit Job' : 'Create New Job'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error?.data?.msg || 'Failed to save job'}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Company Name"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="Type"
              >
                <MenuItem value="Full Time">Full Time</MenuItem>
                <MenuItem value="Part Time">Part Time</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            fullWidth
            sx={{ py: 1.5 }}
          >
            {isLoading ? 'Saving...' : (isEdit ? 'Update Job' : 'Create Job')}
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/admin/jobs')}
            disabled={isLoading}
            fullWidth
            sx={{ py: 1.5 }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default JobForm;
