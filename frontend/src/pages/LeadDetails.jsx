import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  TextField,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axiosClient from '../api/axiosClient';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function LeadDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      const response = await axiosClient.get(`/leads/${id}`);
      setLead(response.data);
    } catch (error) {
      console.error('Error fetching lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      const updatedNotes = [
        ...(lead.leadNotes || []),
        { text: newNote, date: new Date() },
      ];
      await axiosClient.put(`/leads/${id}`, { leadNotes: updatedNotes });
      setNewNote('');
      fetchLead();
    } catch (error) {
      console.error('Error adding note:', error);
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!lead) {
    return (
      <Box sx={{ display: 'flex' }}>
        <Navbar />
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          <Typography>Lead not found</Typography>
        </Box>
      </Box>
    );
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar onMenuClick={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={handleDrawerToggle} />
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, mt: 8, width: { xs: '100%', md: 'auto' } }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/leads')}
          sx={{ mb: 2, fontSize: { xs: '0.875rem', sm: '1rem' } }}
          size="small"
        >
          Back to Leads
        </Button>

        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 2 }}>
            <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>{lead.name}</Typography>
            <Chip label={lead.status} color={getStatusColor(lead.status)} />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{lead.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Phone
              </Typography>
              <Typography variant="body1">{lead.phone}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Source
              </Typography>
              <Typography variant="body1">{lead.source || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Created At
              </Typography>
              <Typography variant="body1">
                {new Date(lead.createdAt).toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Notes
              </Typography>
              <Typography variant="body1">{lead.notes || 'No notes'}</Typography>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              onClick={() => navigate(`/leads/edit/${id}`)}
            >
              Edit Lead
            </Button>
          </Box>
        </Paper>

        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h5" gutterBottom sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            Lead Notes
          </Typography>

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Add a note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={handleAddNote}
              sx={{ mt: 1 }}
              disabled={!newNote.trim()}
            >
              Add Note
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          {lead.leadNotes && lead.leadNotes.length > 0 ? (
            <List>
              {lead.leadNotes.map((note, index) => (
                <ListItem key={index} sx={{ bgcolor: '#f5f5f5', mb: 1, borderRadius: 1 }}>
                  <ListItemText
                    primary={note.text}
                    secondary={new Date(note.date).toLocaleString()}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary">No notes yet</Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

export default LeadDetails;
