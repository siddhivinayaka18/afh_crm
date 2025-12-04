import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axiosClient from '../api/axiosClient';

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const open = Boolean(anchorEl);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axiosClient.get('/auth/me');
      setUser(response.data);
      setFormData({ name: response.data.name, email: response.data.email });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditOpen = () => {
    setEditDialog(true);
    handleMenuClose();
  };

  const handleEditClose = () => {
    setEditDialog(false);
    setFormData({ name: user?.name || '', email: user?.email || '' });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await axiosClient.put('/auth/update-profile', formData);
      setUser(response.data);
      setEditDialog(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
        <Typography
          variant="h5"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 800,
            fontSize: { xs: '20px', sm: '24px', md: '28px' },
            background: 'linear-gradient(135deg, #f5f5f8ff 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: { xs: '2px', md: '3px' },
            textShadow: '0 2px 8px rgba(221, 225, 240, 0.3)',
            transition: 'transform 0.2s ease',
            cursor: 'default',
          }}
        >
          AFH
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={onMenuClick}
            sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: 'white' }}
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            onClick={handleMenuOpen}
            size="small"
            sx={{ ml: { xs: 1, sm: 2 } }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 }, bgcolor: '#9e9e9e', color: 'white' }}>
              <AccountCircleIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </Avatar>
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 3,
            sx: {
              minWidth: { xs: 200, sm: 250 },
              mt: 1.5,
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {user?.name || 'User'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email || 'No email'}
            </Typography>
          </Box>
          <Divider />
          <MenuItem>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <Box>
              <Typography variant="body2">Name</Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.name || 'N/A'}
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <EmailIcon fontSize="small" />
            </ListItemIcon>
            <Box>
              <Typography variant="body2">Email</Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email || 'N/A'}
              </Typography>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleEditOpen}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            Edit Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>

        {/* Edit Profile Dialog */}
        <Dialog open={editDialog} onClose={handleEditClose} maxWidth="sm" fullWidth fullScreen={false}>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button onClick={handleUpdateProfile} variant="contained">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
