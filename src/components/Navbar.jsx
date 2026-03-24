import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { Work } from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { pathname } = useLocation();

  let role = null;
  let email = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
      email = decoded.email;
    } catch {
      localStorage.removeItem('token');
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navLinks = role === 'admin'
    ? [
        { label: 'Dashboard', path: '/admin/jobs' },
        { label: 'Create Job', path: '/admin/create-job' },
      ]
    : token
    ? [
        { label: 'Jobs', path: '/jobs' },
        { label: 'Applied', path: '/applied-jobs' },
      ]
    : [];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: '#1a1a2e',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 }, minHeight: 64 }}>

        {/* Logo */}
        <Box
          onClick={() => navigate(token ? (role === 'admin' ? '/admin/jobs' : '/jobs') : '/')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            textDecoration: 'none',
            mr: 4
          }}
        >
          <Box sx={{
            width: 32, height: 32,
            bgcolor: '#4f8ef7',
            borderRadius: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Work sx={{ color: 'white', fontSize: 18 }} />
          </Box>
          <Typography
            variant="h6"
            fontWeight={700}
            color="white"
            sx={{ letterSpacing: '-0.3px' }}
          >
            Jobly
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', gap: 0.5, flexGrow: 1 }}>
          {navLinks.map(link => {
            const isActive = pathname === link.path;
            return (
              <Button
                key={link.path}
                onClick={() => navigate(link.path)}
                sx={{
                  color: isActive ? 'white' : 'grey.400',
                  bgcolor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  borderRadius: 2,
                  px: 2,
                  fontSize: 14,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.08)',
                    color: 'white'
                  }
                }}
              >
                {link.label}
              </Button>
            );
          })}
        </Box>

        {/* Right Section */}
        {token ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {role === 'admin' ? (
              // Admin view: show full email + role
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                  {email} | {role.toUpperCase()}
                </Typography>
                <Button
                  onClick={handleLogout}
                  size="small"
                  sx={{
                    color: 'grey.300',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 2,
                    px: 2,
                    fontSize: 13,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.06)',
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                  }}
                >
                  Logout
                </Button>
              </Box>
            ) : (

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  display: { xs: 'none', sm: 'flex' },
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Avatar sx={{
                    width: 30, height: 30,
                    bgcolor: '#4fcf8e',
                    fontSize: 13,
                    fontWeight: 700
                  }}>
                    {email?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                  <Box sx={{
                    px: 1.2, py: 0.3,
                    bgcolor: 'rgba(79,207,142,0.15)',
                    borderRadius: 5,
                    border: '1px solid',
                    borderColor: 'rgba(79,207,142,0.3)'
                  }}>
                    <Typography sx={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#4fcf8e',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5
                    }}>
                      {role}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  onClick={handleLogout}
                  size="small"
                  sx={{
                    color: 'grey.400',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 2,
                    px: 2,
                    fontSize: 13,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.06)',
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.3)'
                    }
                  }}
                >
                  Logout
                </Button>
              </Box>
            )}
          </Box>
        ) : (
          // Not logged in
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={() => navigate('/login')}
              sx={{
                color: 'grey.300',
                fontSize: 14,
                borderRadius: 2,
                px: 2,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: 'white' }
              }}
            >
              Login
            </Button>
            <Button
              onClick={() => navigate('/signup')}
              variant="contained"
              sx={{
                bgcolor: '#4f8ef7',
                color: 'white',
                fontSize: 14,
                borderRadius: 2,
                px: 2,
                fontWeight: 600,
                '&:hover': { bgcolor: '#3a7de8' }
              }}
            >
              Sign Up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;