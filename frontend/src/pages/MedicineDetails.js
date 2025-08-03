import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  Chip,
  TextField,
  Alert
} from '@mui/material';
import { addToCart } from '../store/slices/cartSlice';

const MedicineDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [medicine, setMedicine] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMedicineDetails();
  }, [id]);

  const fetchMedicineDetails = async () => {
    try {
      // TODO: Implement actual API call
      const response = await fetch(`http://localhost:5000/api/medicines/${id}`);
      const data = await response.json();
      setMedicine(data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch medicine details');
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (medicine) {
      dispatch(addToCart({ ...medicine, quantity }));
      navigate('/cart');
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error || !medicine) {
    return (
      <Container>
        <Alert severity="error">{error || 'Medicine not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <img
              src={medicine.image || '/default-medicine.jpg'}
              alt={medicine.name}
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {medicine.name}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Chip 
                  label={medicine.category} 
                  color={medicine.category === 'OTC' ? 'primary' : 'secondary'}
                  sx={{ mr: 1 }}
                />
                <Chip 
                  label={`₹${medicine.price}`} 
                  color="success"
                />
              </Box>

              <Typography variant="body1" paragraph>
                {medicine.description}
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                <strong>Dosage:</strong> {medicine.dosage}
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                <strong>Manufacturer:</strong> {medicine.manufacturer}
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                <strong>Expiry Date:</strong> {new Date(medicine.expiryDate).toLocaleDateString()}
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                <strong>Stock Available:</strong> {medicine.stock}
              </Typography>

              {medicine.requiresPrescription && (
                <Alert severity="warning" sx={{ my: 2 }}>
                  This medicine requires a prescription
                </Alert>
              )}

              <Box sx={{ mt: 3 }}>
                <TextField
                  type="number"
                  label="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  inputProps={{ min: 1, max: medicine.stock }}
                  sx={{ width: 100, mr: 2 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddToCart}
                  disabled={medicine.stock === 0}
                >
                  Add to Cart
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default MedicineDetails; 