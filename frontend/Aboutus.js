import React from "react";
import { Card, Col, Container, Row,Button } from "react-bootstrap";
import Menu from "./Menu";
import { useNavigate } from "react-router-dom";
import "./Style.css";

const AboutUs = () => {
    const navigate=useNavigate()
  return (
        <Container className="mt-5">
        <Menu />
        <div className="text-center mb-4">
            <h2 className="fw-bold">📘 About BookHub</h2>
            <p className="text-muted">Your one-stop destination for exploring and sharing books.</p>
        </div>

        <Card className="p-4 shadow-sm about-card mb-4">
            <h4 className="mb-3">Our Mission</h4>
            <p>
            At BookHub, we aim to connect readers and authors, making books more accessible, discoverable,
            and enjoyable for everyone. Whether you're here to review, recommend, or explore — we welcome you to our growing community.
            </p>
        </Card>

        <Row className="gy-4">
            <Col md={6}>
            <Card className="p-3 shadow-sm about-card h-100">
                <h5 className="mb-2">📚 What We Offer</h5>
                <ul className="about-list">
                <li>Discover trending and new arrival books</li>
                <li>Create and participate in book-related events</li>
                <li>Leave reviews and mark favorites</li>
                <li>Admin-curated content and moderation</li>
                </ul>
            </Card>
            </Col>
            <Col md={6}>
            <Card className="p-3 shadow-sm about-card h-100">
                <h5 className="mb-2">🌟 Join Us</h5>
                <p>
                Whether you're a casual reader or a passionate reviewer, BookHub has a place for you.
                Join today and explore a world of literature and lively community events
                </p>
                <div className="d-flex justify-content mb-3">
                <Button variant="secondary" onClick={() => navigate("/Events")}>Go to Events</Button>
                </div>
            </Card>
            </Col>
        </Row>
        </Container>
    );
 };
export default AboutUs;