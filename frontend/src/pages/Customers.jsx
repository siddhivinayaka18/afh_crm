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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  TablePagination,
} from '@mui/material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axiosClient from '../api/axiosClient';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async () => {
    try {
      await axiosClient.delete(`/customers/${deleteDialog.id}`);
      setDeleteDialog({ open: false, id: null });
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Slice customers for current page
  const paginatedCustomers = customers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar onMenuClick={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={handleDrawerToggle} />
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, mt: 8, width: { xs: '100%', md: 'auto' } }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2, mb: { xs: 2, sm: 3 } }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#667eea', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>Customers</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/customers/add')}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Add Customer
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: { xs: 650, sm: 750 } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Name</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Email</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Phone</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Company</TableCell>
                <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Address</TableCell>
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
              ) : customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 8 : 7} align="center">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCustomers.map((customer) => (
                  <TableRow key={customer._id}>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{customer.name}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{customer.email}</TableCell>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{customer.phone}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{customer.company || 'N/A'}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{customer.address || 'N/A'}</TableCell>
                    {isAdmin && (
                      <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {customer.user?.name || 'Unknown'}
                      </TableCell>
                    )}
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{new Date(customer.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 0.5, sm: 1 } }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => navigate(`/customers/${customer._id}`)}
                          sx={{ padding: { xs: '4px', sm: '8px' } }}
                        >
                          <VisibilityIcon sx={{ fontSize: { xs: '18px', sm: '20px' } }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => navigate(`/customers/edit/${customer._id}`)}
                          sx={{ padding: { xs: '4px', sm: '8px' } }}
                        >
                          <EditIcon sx={{ fontSize: { xs: '18px', sm: '20px' } }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteDialog({ open: true, id: customer._id })}
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
            count={customers.length}
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

        <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>Are you sure you want to delete this customer?</DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog({ open: false, id: null })}>Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default Customers;
