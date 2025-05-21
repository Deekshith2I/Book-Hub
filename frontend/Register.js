import React, { useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState(""); //stores the user name input
  const [email, setEmail] = useState("");  // stores the user email input
  const [password, setPassword] = useState(""); //stores password
  const [message, setMessage] = useState(""); //used to store feedback messages error or success
  const navigate = useNavigate();

  const handleRegister = async (e) => 
    {
        e.preventDefault();
        try {
        const response = await fetch("http://localhost/bookhub/register.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ name, email, password }),
            });
            const data = await response.json();
            if (data.status === "success")  //after succesfull registeration it automatically redirects login page 
                {
                    setMessage("✅ Registration successful!");
                    setTimeout(() => navigate("/"), 1500); //after 1.5 sec
                } else {
                    setMessage("❌ " + data.message);
                }
            } catch (error) 
            {
            setMessage("❌ Server error! Please try again.");
            }
    };
    return (
    <Container className="mt-5 d-flex justify-content-center">
        <div style={{ width: "100%", maxWidth: "400px" }}>
            <h2 className="text-center mb-4">Create your Book-Hub Account</h2>
                {message && (
                    <Alert variant={message.includes("✅") ? "success" : "danger"}>  {/* Conditional alert message success or error*/}
                        {message}
                    </Alert>
                )}
                  {/* Registration form */}
                <Form onSubmit={handleRegister} className="p-4 border rounded shadow-sm bg-white">
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required/> {/*updates name state*/}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/> {/*updates email state*/}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/> {/*updates password state*/}
                    </Form.Group>
                    <Button type="submit" className="w-100" variant="success"> Sign Up </Button>
                </Form>
                {/*Link to go to login page if user already has an account */}
            <p className="text-center mt-3">Already have an account? <Link to="/">Login here</Link></p>
        </div>
    </Container>
  );
};
export default Register;
