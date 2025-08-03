import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Alert
} from '@mui/material';
import { clearCart } from '../store/slices/cartSlice';

const steps = ['Delivery Details', 'Payment', 'Confirmation'];

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.cart);
  const [activeStep, setActiveStep] = useState(0);
  const [deliveryDetails, setDeliveryDetails] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    deliveryDate: '',
    deliveryTime: ''
  });
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  const handleDeliverySubmit = (e) => {
    e.preventDefault();
    setActiveStep(1);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setActiveStep(2);
  };

  const handleConfirmOrder = async () => {
    try {
      // TODO: Implement actual API call
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          total,
          deliveryDetails,
          paymentDetails
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      dispatch(clearCart());
      navigate('/profile');
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const renderDeliveryForm = () => (
    <Box component="form" onSubmit={handleDeliverySubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Delivery Address"
            value={deliveryDetails.address}
            onChange={(e) => setDeliveryDetails({ ...deliveryDetails, address: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="City"
            value={deliveryDetails.city}
            onChange={(e) => setDeliveryDetails({ ...deliveryDetails, city: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="State"
            value={deliveryDetails.state}
            onChange={(e) => setDeliveryDetails({ ...deliveryDetails, state: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="ZIP Code"
            value={deliveryDetails.zipCode}
            onChange={(e) => setDeliveryDetails({ ...deliveryDetails, zipCode: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Phone Number"
            value={deliveryDetails.phone}
            onChange={(e) => setDeliveryDetails({ ...deliveryDetails, phone: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            type="date"
            label="Delivery Date"
            value={deliveryDetails.deliveryDate}
            onChange={(e) => setDeliveryDetails({ ...deliveryDetails, deliveryDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            type="time"
            label="Delivery Time"
            value={deliveryDetails.deliveryTime}
            onChange={(e) => setDeliveryDetails({ ...deliveryDetails, deliveryTime: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
      >
        Continue to Payment
      </Button>
    </Box>
  );

  const renderPaymentForm = () => (
    <Box component="form" onSubmit={handlePaymentSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Card Number"
            value={paymentDetails.cardNumber}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Expiry Date"
            placeholder="MM/YY"
            value={paymentDetails.expiryDate}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="CVV"
            value={paymentDetails.cvv}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Name on Card"
            value={paymentDetails.nameOnCard}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, nameOnCard: e.target.value })}
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
      >
        Review Order
      </Button>
    </Box>
  );

  const renderOrderConfirmation = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      {items.map((item) => (
        <Box key={item.id} sx={{ mb: 2 }}>
          <Typography>
            {item.name} x {item.quantity}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ₹{item.price * item.quantity}
          </Typography>
        </Box>
      ))}
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">
        Total: ₹{total}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleConfirmOrder}
        sx={{ mt: 3 }}
      >
        Place Order
      </Button>
    </Box>
  );

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Checkout
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              {activeStep === 0 && renderDeliveryForm()}
              {activeStep === 1 && renderPaymentForm()}
              {activeStep === 2 && renderOrderConfirmation()}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />
              {items.map((item) => (
                <Box key={item.id} sx={{ mb: 2 }}>
                  <Typography>
                    {item.name} x {item.quantity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ₹{item.price * item.quantity}
                  </Typography>
                </Box>
              ))}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">
                Total: ₹{total}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Checkout; 