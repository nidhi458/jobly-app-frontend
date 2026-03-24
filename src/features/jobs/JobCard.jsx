import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip
} from '@mui/material';
import { LocationOn, WorkOutline } from '@mui/icons-material';
import { useApplyJobMutation, useDeleteJobMutation } from '../../store/api';

const JobCard = ({ job, adminView = false }) => {
  const navigate = useNavigate();
  const [applyJob, { isLoading: applying }] = useApplyJobMutation();
  const [deleteJob, { isLoading: deleting }] = useDeleteJobMutation();

  const token = localStorage.getItem('token');

  const handleApply = async () => {
    if (!token) { navigate('/login'); return; }
    try {
      await applyJob(job._id).unwrap();
      navigate('/applied-jobs');
    } catch (err) {
      alert(err?.data?.msg || 'Failed to apply');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await deleteJob(job._id).unwrap();
    } catch (err) {
      alert(err?.data?.msg || 'Delete failed');
    }
  };

  // Generate a consistent color per company initial
  const colors = ['#4f8ef7', '#e05c97', '#f7a94f', '#4fcf8e', '#9b6ef7'];
  const colorIndex = (job.company?.charCodeAt(0) || 0) % colors.length;
  const avatarColor = colors[colorIndex];

  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      borderRadius: 3,
      border: '1px solid',
      borderColor: 'grey.100',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
      }
    }}>
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Company avatar + name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Box sx={{
            width: 44, height: 44,
            bgcolor: avatarColor,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Typography fontWeight={700} color="white" fontSize={18}>
              {job.company?.charAt(0)?.toUpperCase() || '?'}
            </Typography>
          </Box>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body2" color="text.secondary" noWrap>
              {job.company}
            </Typography>
            <Typography variant="h6" fontWeight={700} noWrap fontSize={16}>
              {job.position}
            </Typography>
          </Box>
        </Box>

        {/* Tags */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          <Chip
            icon={<WorkOutline sx={{ fontSize: '14px !important' }} />}
            label={job.type}
            size="small"
            sx={{
              bgcolor: job.type === 'Full Time' ? '#e8f5e9' : '#fff8e1',
              color: job.type === 'Full Time' ? '#2e7d32' : '#f57f17',
              fontWeight: 600,
              fontSize: 12,
              border: 'none'
            }}
          />
          <Chip
            icon={<LocationOn sx={{ fontSize: '14px !important' }} />}
            label={job.location}
            size="small"
            sx={{
              bgcolor: '#e8f0fe',
              color: '#1a56db',
              fontWeight: 600,
              fontSize: 12,
              border: 'none'
            }}
          />
        </Box>
      </CardContent>

      {/* Action buttons */}
      <Box sx={{ px: 3, pb: 3 }}>
        {adminView ? (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              fullWidth
              onClick={() => navigate(`/admin/edit-job/${job._id}`)}
              sx={{ borderRadius: 2, fontWeight: 600 }}
            >
              Edit
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              fullWidth
              onClick={handleDelete}
              disabled={deleting}
              sx={{ borderRadius: 2, fontWeight: 600 }}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </Box>
        ) : (
          <Button
            variant="contained"
            fullWidth
            onClick={handleApply}
            disabled={!token || applying}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              bgcolor: '#1a1a2e',
              '&:hover': { bgcolor: '#2d2d4e' },
              py: 1
            }}
          >
            {applying ? 'Applying...' : 'Apply Now'}
          </Button>
        )}
      </Box>
    </Card>
  );
};

export default JobCard;