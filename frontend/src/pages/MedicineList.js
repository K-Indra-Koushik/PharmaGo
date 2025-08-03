import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';

const MedicineList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      // TODO: Implement actual API call
      const response = await fetch('http://localhost:5000/api/medicines');
      const data = await response.json();
      setMedicines(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      setLoading(false);
    }
  };

  const handleAddToCart = (medicine) => {
    dispatch(addToCart(medicine));
  };

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || medicine.category === category;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Medicines
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Search Medicines"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="OTC">Over the Counter</MenuItem>
                <MenuItem value="Prescription">Prescription</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {filteredMedicines.map((medicine) => (
            <Grid item xs={12} sm={6} md={4} key={medicine._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={medicine.image || '/default-medicine.jpg'}
                  alt={medicine.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {medicine.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {medicine.description}
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
                  <Typography variant="body2" color="text.secondary">
                    Dosage: {medicine.dosage}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manufacturer: {medicine.manufacturer}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      onClick={() => navigate(`/medicines/${medicine._id}`)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => handleAddToCart(medicine)}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default MedicineList; 