import React, { useState } from "react";
import axios from "axios";
import "./LeaveForm.css";

const LeaveForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    leaveType: "",
    duration: "",
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "duration" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form Validation
    if (!formData.email || !formData.name || !formData.leaveType || formData.duration === "") {
      setMessage("All fields are required.");
      return;
    }

    if (isNaN(formData.duration) || formData.duration <= 0) {
      setMessage("Leave duration must be a positive number.");
      return;
    }

    setIsSubmitting(true);
    setMessage(""); // Clear any previous messages

    try {
      const response = await axios.post(
        "http://localhost:5000/proxy", // Update with your actual API endpoint
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      setMessage(response.data.message || "Leave request submitted successfully!");
      setFormData({ email: "", name: "", leaveType: "", duration: "" }); // Reset form
    } catch (error) {
      console.error("Error submitting leave request:", error);
      setMessage(
        error.response?.data?.message ||
          "An error occurred while submitting your request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formStyles = {
    container: {
      maxWidth: "400px",
      margin: "0 auto",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
      position: "center",
      zIndex: 2, // Ensures it appears above the video
    },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: "4px",
      marginBottom: "10px",
      border: "1px solid #ccc",
    },
    button: {
      backgroundColor: "#007bff",
      color: "white",
      padding: "10px 20px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      width: "100%",
    },
    message: {
      marginTop: "15px",
      padding: "10px",
      backgroundColor: "#e9ecef",
      color: "#495057",
      borderRadius: "4px",
      border: "1px solid #adb5bd",
    },
    navbar: {
      display: "flex",
      alignItems: "center",
      padding: "10px 20px",
      justifyContent: "start",
      // backgroundColor: "rgba(255, 255, 255, 0.8)",
      position: "fixed",
      top: 0,
      width: "100%",
      zIndex: 3,
    },
    logo: {
      height: "40px", // Set your logo's height
      width: "auto",  // Maintain aspect ratio
      objectFit: "contain",
      justifycontent: "flex-end",
      display: "block", // Removes any extra space below the image
      margin: 0,       // Remove any default margin
      padding: 0,      // Remove any default padding
      border: "none",  // Remove any border that might be applied
      background: "transparent", // Ensure the background is transparent
      color: "orange", // Set the color of the text
    },
    video: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      zIndex: -1, // Keeps the video in the background
    },
  };

  return (
    <div>
      {/* Background Video */}
      {/* <video autoPlay loop muted style={formStyles.video}>
        <source src="videoplayback.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}

       {/* Navbar */}
<div style={formStyles.navbar}>
  <a href="/">
    <img 
      src="/jpg.png" 
      alt="NavGurukul Logo" 
      style={{ height: '200px', verticalAlign: 'middle',zIndex:-2 }} 
    />
    {/* <span style={formStyles.logoText}>navGurukul</span> */}
  </a>
</div>

      {/* Form Container */}
      <div style={formStyles.container}>
        <h2>Leave Request Form
        </h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={formStyles.input}
            required
          />

          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={formStyles.input}
            required
          />

          <label htmlFor="leaveType">Leave Type:</label>
          <select
            id="leaveType"
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            style={formStyles.input}
            required
          >
            <option value="">Select leave type</option>
            <option value="CL">Casual Leave</option>
            <option value="WL">Work Leave</option>
            <option value="FL">Family Leave</option>
          </select>

          <label htmlFor="duration">Duration (Days):</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            style={formStyles.input}
            min="1"
            required
          />

          <button type="submit" disabled={isSubmitting} style={formStyles.button}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>

          {message && <div style={formStyles.message}>{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default LeaveForm;
