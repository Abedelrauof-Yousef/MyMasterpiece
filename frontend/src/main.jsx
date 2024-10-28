// src/main.jsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PayPalScriptProvider } from '@paypal/react-paypal-js'; // Import PayPalScriptProvider
import App from './App.jsx';
import './index.css';

// Access PayPal Client ID from environment variables
const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
console.log('PayPal Client ID:', paypalClientId);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PayPalScriptProvider
      options={{
        'client-id': paypalClientId,
        currency: 'USD',
      }}
    >
      <App />
    </PayPalScriptProvider>
  </StrictMode>,
);
