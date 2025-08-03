import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Button,
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import PrescriptionList from '../components/PrescriptionList';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // TODO: Implement actual API call
      const response = await fetch('http://localhost:5000/api/orders/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getOrderStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'success';
      case 'processing':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (!user) {
    return (
      <Container>
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Please login to view your profile
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Profile
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Name"
                    secondary={user.name}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Email"
                    secondary={user.email}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Phone"
                    secondary={user.phone || 'Not provided'}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Address"
                    secondary={
                      user.address
                        ? `${user.address.street}, ${user.address.city}, ${user.address.state} ${user.address.zipCode}`
                        : 'Not provided'
                    }
                  />
                </ListItem>
              </List>
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate('/profile/edit')}
              >
                Edit Profile
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label="Order History" />
                <Tab label="Prescriptions" />
              </Tabs>

              {activeTab === 0 && (
                <Box>
                  {loading ? (
                    <Typography>Loading orders...</Typography>
                  ) : orders.length === 0 ? (
                    <Typography>No orders found</Typography>
                  ) : (
                    <List>
                      {orders.map((order) => (
                        <React.Fragment key={order._id}>
                          <ListItem>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <ListItemText
                                  primary={`Order #${order._id}`}
                                  secondary={new Date(order.createdAt).toLocaleDateString()}
                                />
                              </Grid>
                              <Grid item xs={12} sm={3}>
                                <Typography variant="body2">
                                  Total: ₹{order.total}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={3}>
                                <Chip
                                  label={order.status}
                                  color={getOrderStatusColor(order.status)}
                                  size="small"
                                />
                              </Grid>
                            </Grid>
                          </ListItem>
                          <Divider />
                        </React.Fragment>
                      ))}
                    </List>
                  )}
                </Box>
              )}

              {activeTab === 1 && (
                <Box>
                  <Typography variant="body1" gutterBottom>
                    Uploaded Prescriptions
                  </Typography>
                  {user.prescriptions && user.prescriptions.length > 0 ? (
                    <List>
                      {user.prescriptions.map((prescription) => (
                        <ListItem key={prescription._id}>
                          <ListItemText
                            primary={prescription.name}
                            secondary={new Date(prescription.uploadDate).toLocaleDateString()}
                          />
                          <Button
                            variant="outlined"
                            size="small"
                            href={prescription.url}
                            target="_blank"
                          >
                            View
                          </Button>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography>No prescriptions uploaded yet</Typography>
                  )}
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/upload-prescription')}
                  >
                    Upload New Prescription
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Profile; 