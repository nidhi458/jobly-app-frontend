import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, Work } from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('${process.env.REACT_APP_API_URL}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Login failed');
      localStorage.setItem('token', data.token);
      const decoded = jwtDecode(data.token);
      navigate(decoded.role === 'admin' ? '/admin/jobs' : '/jobs', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      bgcolor: '#f5f6fa'
    }}>

      <Box sx={{
        display: { xs: 'none', md: 'flex' },
        width: '45%',
        bgcolor: '#1a1a2e',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 6,
        gap: 3
      }}>
        <Box sx={{
          width: 64, height: 64,
          bgcolor: '#4f8ef7',
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 1
        }}>
          <Work sx={{ color: 'white', fontSize: 36 }} />
        </Box>
        <Typography variant="h4" fontWeight={700} color="white" textAlign="center">
          Find your next opportunity
        </Typography>
        <Typography variant="body1" color="grey.400" textAlign="center" sx={{ maxWidth: 300, lineHeight: 1.7 }}>
          Browse hundreds of jobs and connect with companies that match your skills.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['200+ Jobs', 'Top Companies', 'Easy Apply'].map(label => (
            <Box key={label} sx={{
              px: 2, py: 0.8,
              border: '1px solid',
              borderColor: 'grey.700',
              borderRadius: 5,
              color: 'grey.400',
              fontSize: 13
            }}>
              {label}
            </Box>
          ))}
        </Box>
      </Box>


      <Box sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4
      }}>
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <Typography variant="h5" fontWeight={700} mb={0.5} color="text.primary">
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Sign in to your account to continue
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="caption" fontWeight={600} color="text.secondary">
              EMAIL
            </Typography>
            <TextField
              fullWidth
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              size="small"
              placeholder="you@example.com"
              sx={{ mt: 0.5, mb: 2, bgcolor: 'white', borderRadius: 1 }}
            />

            <Typography variant="caption" fontWeight={600} color="text.secondary">
              PASSWORD
            </Typography>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              size="small"
              placeholder="••••••••"
              sx={{ mt: 0.5, mb: 3, bgcolor: 'white', borderRadius: 1 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPassword(p => !p)}>
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.3,
                bgcolor: '#1a1a2e',
                '&:hover': { bgcolor: '#2d2d4e' },
                borderRadius: 2,
                fontWeight: 600,
                fontSize: 15
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#4f8ef7', textDecoration: 'none', fontWeight: 600 }}>
              Sign up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;