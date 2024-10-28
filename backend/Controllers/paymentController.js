// backend/Controllers/paymentController.js

const { client, checkoutNodeJssdk } = require("../Config/paypal");
const User = require("../Models/users");

// Create Order
exports.createOrder = async (req, res) => {
  // Create a new order request
  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD", // Changed from "JOD" to "USD"
          value: "10.00",
        },
      },
    ],
  });

  try {
    // Execute the request
    const order = await client.execute(request);
    // Return the order ID to the frontend
    res.json({ id: order.result.id });
  } catch (err) {
    console.error("PayPal Create Order Error:", err);
    res.status(500).send("Error creating PayPal order");
  }
};

// Capture Order
exports.captureOrder = async (req, res) => {
  const { orderID } = req.body;

  // Validate input
  if (!orderID) {
    return res.status(400).json({ error: "Order ID is required." });
  }

  // Create a new capture request
  const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
  request.requestBody({});

  try {
    // Execute the capture
    const capture = await client.execute(request);

    // Update user's subscription status
    const userId = req.user.id; // Ensure `req.user` is populated by your authentication middleware
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const now = new Date();
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1); // 1 month subscription

    user.subscriptionStatus = "active";
    user.subscriptionStartDate = now;
    user.subscriptionEndDate = subscriptionEndDate;
    await user.save();

    res.json({ msg: "Subscription activated" });
  } catch (err) {
    console.error("PayPal Capture Order Error:", err);
    res.status(500).send("Error capturing PayPal order");
  }
};
