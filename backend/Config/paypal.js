// config/paypal.js

const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");

function environment() {
  let clientId = process.env.PAYPAL_CLIENT_ID;
  let clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal Client ID and Secret must be set in environment variables.");
  }

  return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
}

const client = new checkoutNodeJssdk.core.PayPalHttpClient(environment());

module.exports = { client, checkoutNodeJssdk };
