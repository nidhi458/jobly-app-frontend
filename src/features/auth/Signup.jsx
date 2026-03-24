import { useState } from 'react';
import { useSignupMutation } from '../../store/api';
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
import { Visibility, VisibilityOff, Work, CheckCircle, Cancel } from '@mui/icons-material';

const passwordRules = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p) => /[0-9]/.test(p) },
  { label: 'One special character (!@#$...)', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [signup, { isLoading, error }] = useSignupMutation();
  const navigate = useNavigate();

  const isAdmin = email.endsWith('@arnifi.com');
  const allRulesPassed = passwordRules.every(rule => rule.test(password));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allRulesPassed) {
      setPasswordTouched(true);
      return;
    }
    try {
      const data = await signup({ email, password }).unwrap();
      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate(isAdmin ? '/admin/jobs' : '/jobs');
      } else {
        navigate('/login');
      }
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#f5f6fa' }}>

      
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
          Start your journey today
        </Typography>
        <Typography variant="body1" color="grey.400" textAlign="center" sx={{ maxWidth: 300, lineHeight: 1.7 }}>
          Create an account to apply for jobs or post openings for your company.
        </Typography>
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
            Create an account
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Join us — it only takes a minute
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error?.data?.msg || 'Signup failed. Please try again.'}
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
              sx={{ mt: 0.5, mb: 0.5, bgcolor: 'white', borderRadius: 1 }}
            />
            {email && (
              <Typography variant="caption" sx={{
                color: isAdmin ? '#2e7d32' : '#1565c0',
                fontWeight: 600,
                mb: 1.5,
                display: 'block'
              }}>
                {isAdmin ? '✓ You will be registered as Admin' : '✓ You will be registered as Job Seeker'}
              </Typography>
            )}

            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mt: email ? 0 : 1.5, display: 'block' }}>
              PASSWORD
            </Typography>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordTouched(true);
              }}
              required
              size="small"
              placeholder="Min. 8 characters"
              sx={{ mt: 0.5, mb: 1.5, bgcolor: 'white', borderRadius: 1 }}
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

            {passwordTouched && (
              <Box sx={{
                mb: 2.5,
                p: 1.5,
                bgcolor: '#f8f9fa',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.200'
              }}>
                {passwordRules.map(rule => {
                  const passed = rule.test(password);
                  return (
                    <Box key={rule.label} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      {passed
                        ? <CheckCircle sx={{ fontSize: 15, color: '#2e7d32' }} />
                        : <Cancel sx={{ fontSize: 15, color: '#d32f2f' }} />
                      }
                      <Typography variant="caption" sx={{
                        color: passed ? '#2e7d32' : '#d32f2f',
                        fontWeight: passed ? 600 : 400
                      }}>
                        {rule.label}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                py: 1.3,
                bgcolor: '#1a1a2e',
                '&:hover': { bgcolor: '#2d2d4e' },
                borderRadius: 2,
                fontWeight: 600,
                fontSize: 15
              }}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#4f8ef7', textDecoration: 'none', fontWeight: 600 }}>
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Signup;