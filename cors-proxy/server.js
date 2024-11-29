const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Proxy route for handling leave requests
app.post("/proxy", async (req, res) => {
  try {
    // Extract fields from the request body
    const { email, name, leaveType, duration } = req.body;

    // Validation: Check if all fields are provided
    if (!email || !name || !leaveType || typeof duration === "undefined") {
      return res.status(400).json({
        success: false,
        message: "All fields are required: email, name, leaveType, and duration.",
      });
    }

    // Validation: Check for valid leaveType
    if (!["CL", "WL", "FL"].includes(leaveType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid leave type: ${leaveType}. Accepted types are CL, WL, FL.`,
      });
    }

    // Validation: Check if duration is a positive number
    const leaveDuration = parseInt(duration);
    if (isNaN(leaveDuration) || leaveDuration <= 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid duration: ${duration}. Duration must be a positive number.`,
      });
    }

    // Log incoming request
    console.log("Incoming leave request:", { email, name, leaveType, leaveDuration });

    // Send the request to the Google Apps Script endpoint
    const response = await axios.post(
      "https://script.google.com/macros/s/AKfycbyZIcMVRfqIW_7veU1OGExIF6n62jV5505IX09bABo5XjhVGXsBt1Bo39-oOc-4iUwFHA/exec",
      { email, name, leaveType, duration: leaveDuration },
      { headers: { "Content-Type": "application/json" } }
    );

    // Check for success in the Apps Script response
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to process the request.");
    }

    // Respond to the client with a success message
    res.json({ success: true, message: "Leave request processed successfully." });
  } catch (error) {
    // Log the error for debugging
    console.error("Error processing leave request:", error.message);

    // Respond with a detailed error message
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while processing the leave request.",
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
