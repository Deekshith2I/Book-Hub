import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Menu from "./Menu";

const EventsPage = () => {
  const [events, setEvents] = useState([]);   // State to store the  available list of events
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  

  useEffect(() => {
    fetch("http://localhost/bookhub/get_events.php", {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);
  useEffect(() => {
    fetch("http://localhost/bookhub/session_status.php", {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "logged_in") {
          setUserEmail(data.email);
        }
      });
  }, []);
  const handleDeleteEvent = (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
  
    fetch("http://localhost/bookhub/delete_event.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ event_id: id })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        alert(data.message);
        // Refresh list after delete
        setEvents(prev => prev.filter(ev => ev.event_id !== id));
      })
      .catch(err => console.error("Failed to delete event:", err));
  };
  

  return (
    <Container className="mt-5">
      <Menu />
            <div className="d-flex justify-content mb-3">
              <Button variant="secondary" onClick={() => navigate("/dashboard")}>⬅ Back</Button>
            </div>
      <h2 className="text-center mb-4">📅 Explore Upcoming Events</h2>
      {/* Conditional rendering: Show this message if no events available */}
      {events.length === 0 ? 
            (
                <p className="text-center text-muted">No upcoming events at the moment.</p>
            ) : (
            // Display list of event cards
            <Row>
            {events.map(event => (
                   <Col key={event.event_id} md={6} lg={4} className="mb-4">
                      <Card className="shadow-sm">
                          {/* image with fallback on error */}
                            <Card.Img
                            variant="top"
                            src={`http://localhost/bookhub/assets/events/${event.event_image1}`}
                            onError={(e) => {
                            e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                            }}
                            style={{ height: "200px", objectFit: "contain", backgroundColor: "#fff" }}/>
                            {/* Event details */}
                            <Card.Body>
                               <Card.Title>{event.event_title}</Card.Title>
                                  <Card.Text><strong>By:</strong> {event.event_presenter}</Card.Text>
                                  <Card.Text><span>📅 <strong>Date:</strong> </span>{event.event_date}</Card.Text>
                                  <Card.Text><span>📍 <strong>Location:</strong> </span>{event.event_location}</Card.Text>
                                </Card.Body>                              
                            {/* Show delete button only if user is admin */}
                            {userEmail === "bookadmin@gmail.com" && (
                          <Button variant="danger" size="sm" className="float-end" onClick={() => handleDeleteEvent(event.event_id)} > Delete </Button>)}
                      </Card>
                  </Col> 
                ))
              }
        </Row>
      )}
    </Container>
  );
};

export default EventsPage;
