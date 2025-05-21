import React, { useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./Style.css"; // Make sure this includes the login-page styles

const Login = () => {
  const [email, setEmail] = useState(""); //State to store the email
  const [password, setPassword] = useState(""); // State to store the password
  const [message, setMessage] = useState(""); // State to store message
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost/bookhub/login.php", {
        method: "POST",   // Send a POST request to backend login.php
        headers: { "Content-Type": "application/json" }, // Set request body format to JSON
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.status === "success") 
        {
          setMessage("✅ Login successful!");
          navigate("/dashboard"); //Redirects to dashboard on success
        } else {
        setMessage("❌ " + data.message); //Shows backend error message
        }
    } catch (error) {
      setMessage("❌ Server error! Please try again.");
    }
  };
  return (
    <Container fluid className="login-page">
       {/*Centered login box */}
      <div className="login-form-wrapper">
        <h2 className="text-center mb-4">Login to Book-Hub</h2>
        {/*Show message only if present */}
        {message && (
          <Alert variant={message.includes("✅") ? "success" : "danger"}>
            {message}
          </Alert>
        )}
        {/*login form*/}
        <Form onSubmit={handleLogin} className="p-4 border rounded shadow-sm bg-white">
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /> {/*updates email state and cannot left empty*/}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/> {/*updates password state and cannot left empty*/}
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">Login</Button>
        </Form>
        <p className="text-center mt-3"> Don't have an account? <Link to="/register">Sign up here</Link></p> {/*Navigation to register page for new users */}
      </div>
    </Container>
  );
};

export default Login;
