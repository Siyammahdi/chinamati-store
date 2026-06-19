import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SSL_STORE_ID = process.env.SSL_STORE_ID;
const SSL_STORE_PASSWORD = process.env.SSL_STORE_PASSWORD;
const SSL_IS_SANDBOX = process.env.SSL_IS_SANDBOX === 'true';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://chinamati.com';
const BACKEND_URL = process.env.BACKEND_URL || 'https://chinamati.com';

// Configure CORS to allow requests from frontend
app.use(cors({
  origin: [
    FRONTEND_URL, 
    'http://localhost:3000',
    'https://www.chinamati.com',
    'https://chinamati.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle OPTIONS requests explicitly
app.options('*', cors());

const SSL_API_URL = SSL_IS_SANDBOX 
  ? 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php' 
  : 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';

const SSL_VALIDATION_URL = SSL_IS_SANDBOX
  ? 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php'
  : 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php';

// Initialize SSLCommerz Session
app.post('/api/ssl-request', async (req, res) => {
  const { 
    total_amount, 
    currency, 
    tran_id, 
    cus_name, 
    cus_email, 
    cus_add1, 
    cus_city, 
    cus_postcode, 
    cus_country, 
    cus_phone,
    product_name,
    product_category,
    product_profile
  } = req.body;

  const formData = new URLSearchParams();
  formData.append('store_id', SSL_STORE_ID);
  formData.append('store_passwd', SSL_STORE_PASSWORD);
  formData.append('total_amount', total_amount);
  formData.append('currency', currency || 'BDT');
  formData.append('tran_id', tran_id);
  formData.append('success_url', `${BACKEND_URL}/api/ssl-success?tran_id=${tran_id}`);
  formData.append('fail_url', `${BACKEND_URL}/api/ssl-fail?tran_id=${tran_id}`);
  formData.append('cancel_url', `${BACKEND_URL}/api/ssl-cancel?tran_id=${tran_id}`);
  formData.append('ipn_url', `${BACKEND_URL}/api/ssl-ipn`);
  formData.append('cus_name', cus_name);
  formData.append('cus_email', cus_email);
  formData.append('cus_add1', cus_add1);
  formData.append('cus_city', cus_city);
  formData.append('cus_postcode', cus_postcode || '1000');
  formData.append('cus_country', cus_country || 'Bangladesh');
  formData.append('cus_phone', cus_phone);
  formData.append('shipping_method', 'NO');
  formData.append('product_name', product_name);
  formData.append('product_category', product_category || 'General');
  formData.append('product_profile', product_profile || 'general');

  try {
    const response = await fetch(SSL_API_URL, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    if (data.status === 'SUCCESS') {
      res.json({ url: data.GatewayPageURL });
    } else {
      res.status(400).json({ message: 'SSLCommerz session initiation failed', data });
    }
  } catch (error) {
    console.error('SSLCommerz Request Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Success Callback
app.post('/api/ssl-success', (req, res) => {
  const { tran_id } = req.query;
  // In a real app, you would validate the payment here using the Validation API
  // and update your database.
  console.log('Payment Success for Tran ID:', tran_id, req.body);
  res.redirect(`${FRONTEND_URL}/payment-success?tran_id=${tran_id}`);
});

// Fail Callback
app.post('/api/ssl-fail', (req, res) => {
  const { tran_id } = req.query;
  console.log('Payment Failed for Tran ID:', tran_id, req.body);
  res.redirect(`${FRONTEND_URL}/payment-fail?tran_id=${tran_id}`);
});

// Cancel Callback
app.post('/api/ssl-cancel', (req, res) => {
  const { tran_id } = req.query;
  console.log('Payment Cancelled for Tran ID:', tran_id, req.body);
  res.redirect(`${FRONTEND_URL}/payment-cancel?tran_id=${tran_id}`);
});

// IPN Callback
app.post('/api/ssl-ipn', (req, res) => {
  console.log('IPN Received:', req.body);
  res.send('OK');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});



