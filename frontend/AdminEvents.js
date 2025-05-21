import React, { useEffect, useState } from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Menu from "./Menu";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost/bookhub/get_pending_events.php", { //fetching the backend data that was stored in pending events 
      credentials: "include"
    })
      .then((res) => res.json()) 
      .then((data) => setEvents(data)) //stores the feteched events
      .catch((err) => console.error("Error fetching events:", err)); //error if it fails to fetch events
  }, []);

  const handleApprove = (id) => {
    fetch("http://localhost/bookhub/approve_event.php", {  //sends the approved to backend
      method: "POST",
      headers: { "Content-Type": "application/json" }, //in json format
      credentials: "include",
      body: JSON.stringify({ event_id: id }) //
    })
    
      .then((res) => res.json()) //
      .then((data) => {
        alert(data.message);
        setEvents((prev) => prev.filter((event) => event.event_id !== id)); //removes the event that was approved
      })
      .catch((err) => console.error("Error approving event:", err)); //shows errors if fails
  };

  const handleDelete = (id) => {
    fetch("http://localhost/bookhub/delete_event.php", { //same as above
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ event_id: id })
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        setEvents((prev) => prev.filter((event) => event.event_id !== id));
      })
      .catch((err) => console.error("Error deleting event:", err));
  };

  return (
    <Container className="mt-4">
      <Menu />
      <Button variant="secondary" className="mb-4" onClick={() => navigate("/dashboard")}>⬅ Back</Button>
      <h3 className="mb-4">📝 Pending Events for Review</h3>
      <Row>
            {events.length === 0 ? (
                <p>No pending events.</p>
                ) : (
                events.map((event) => (
                    <Col key={event.event_id} md={4} className="mb-4">
                        <Card className="shadow-sm h-100">
                            <Card.Img
                            variant="top"
                            src={`http://localhost/bookhub/assets/events/${event.event_image1}`}
                            alt={event.event_title}
                            style={{ height: "250px", objectFit: "contain" }}
                            />
                            <Card.Body>
                                <Card.Title>{event.event_title}</Card.Title>
                                <Card.Text><strong>By:</strong> {event.event_presenter}</Card.Text>
                                <Card.Text><strong>Date:</strong> {event.event_date}</Card.Text>
                                <Card.Text><strong>Location:</strong> {event.event_location}</Card.Text>
                                <Card.Text><strong>Description:</strong>{event.event_description}</Card.Text>
                                <div className="d-flex justify-content-between">
                                    <Button variant="success" onClick={() => handleApprove(event.event_id)}>Approve</Button>
                                    <Button variant="danger" onClick={() => handleDelete(event.event_id)}>Delete</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))
            )}
      </Row>
    </Container>
  );
};

export default AdminEvents;
