import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  TablePagination,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axiosClient from '../api/axiosClient';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

function Leads() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [leads, setLeads] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/leads');
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
      enqueueSnackbar('Failed to fetch leads', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await axiosClient.delete(`/leads/${deleteDialog.id}`);
      setDeleteDialog({ open: false, id: null });
      enqueueSnackbar('Lead deleted successfully', { variant: 'success' });
      fetchLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
      enqueueSnackbar('Failed to delete lead', { variant: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      New: 'primary',
      Contacted: 'info',
      'In Progress': 'warning',
      Converted: 'success',
      Lost: 'error',
    };
    return colors[status] || 'default';
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Slice leads for current page
  const paginatedLeads = leads.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar onMenuClick={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={handleDrawerToggle} />
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, mt: 8, width: { xs: '100%', md: 'auto' } }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2, mb: { xs: 2, sm: 3 } }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#667eea', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>Leads</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/leads/add')}
            fullWidth={false}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Add Lead
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: { xs: 650, sm: 750 } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Name</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Email</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Phone</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Source</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Status</TableCell>
                {isAdmin && <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Created By</TableCell>}
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Created</TableCell>
                <TableCell align="center" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 8 : 7} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 8 : 7} align="center">
                    No leads found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLeads.map((lead) => (
                  <TableRow key={lead._id}>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{lead.name}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{lead.email}</TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{lead.phone}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{lead.source}</TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <Chip label={lead.status} color={getStatusColor(lead.status)} size="small" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }} />
                    </TableCell>
                    {isAdmin && (
                      <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {lead.user?.name || 'Unknown'}
                      </TableCell>
                    )}
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 0.5, sm: 1 } }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => navigate(`/leads/${lead._id}`)}
                          sx={{ padding: { xs: '4px', sm: '8px' } }}
                        >
                          <VisibilityIcon sx={{ fontSize: { xs: '18px', sm: '20px' } }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => navigate(`/leads/edit/${lead._id}`)}
                          sx={{ padding: { xs: '4px', sm: '8px' } }}
                        >
                          <EditIcon sx={{ fontSize: { xs: '18px', sm: '20px' } }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteDialog({ open: true, id: lead._id })}
                          sx={{ padding: { xs: '4px', sm: '8px' } }}
                        >
                          <DeleteIcon sx={{ fontSize: { xs: '18px', sm: '20px' } }} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={leads.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              '.MuiTablePagination-toolbar': {
                justifyContent: 'center',
              },
            }}
          />
        </TableContainer>

        <Dialog open={deleteDialog.open} onClose={() => !deleting && setDeleteDialog({ open: false, id: null })}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>Are you sure you want to delete this lead?</DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog({ open: false, id: null })} disabled={deleting}>
              Cancel
            </Button>
            <Button 
              onClick={handleDelete} 
              color="error" 
              variant="contained"
              disabled={deleting}
              startIcon={deleting ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default Leads;
