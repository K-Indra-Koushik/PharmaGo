import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { prescriptionsAPI } from '../services/api';

const PrescriptionList = () => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [prescriptionToDelete, setPrescriptionToDelete] = useState(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await prescriptionsAPI.getAll();
      setPrescriptions(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
  };

  const handleCloseView = () => {
    setSelectedPrescription(null);
  };

  const handleDeleteClick = (prescription) => {
    setPrescriptionToDelete(prescription);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await prescriptionsAPI.delete(prescriptionToDelete._id);
      setPrescriptions(prescriptions.filter(p => p._id !== prescriptionToDelete._id));
      setDeleteDialogOpen(false);
      setPrescriptionToDelete(null);
    } catch (error) {
      setError('Failed to delete prescription');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">My Prescriptions</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/upload-prescription')}
        >
          Upload New
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {prescriptions.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            No prescriptions uploaded yet
          </Typography>
        </Paper>
      ) : (
        <Paper>
          <List>
            {prescriptions.map((prescription) => (
              <ListItem key={prescription._id} divider>
                <ListItemText
                  primary={prescription.filename}
                  secondary={`Uploaded on ${new Date(prescription.uploadDate).toLocaleDateString()}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="view"
                    onClick={() => handleViewPrescription(prescription)}
                    sx={{ mr: 1 }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteClick(prescription)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* View Prescription Dialog */}
      <Dialog
        open={Boolean(selectedPrescription)}
        onClose={handleCloseView}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Prescription Details</DialogTitle>
        <DialogContent>
          {selectedPrescription && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Filename: {selectedPrescription.filename}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Upload Date: {new Date(selectedPrescription.uploadDate).toLocaleString()}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <img
                  src={`http://localhost:5000/${selectedPrescription.filepath}`}
                  alt="Prescription"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseView}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Prescription</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this prescription? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PrescriptionList; 