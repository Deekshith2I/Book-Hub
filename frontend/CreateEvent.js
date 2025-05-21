import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Menu from "./Menu";

const CreateEvent = () => {
    const [title, setTitle] = useState("");
    const [presenter, setPresenter] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [image, setImage] = useState(null);
  
    const navigate = useNavigate();
    const handleSubmit = async (e) => 
    {e.preventDefault();

        const formData = new FormData(); //creating JS object which collects and sends the form data mainly images
        formData.append("event_title", title);
        formData.append("event_presenter", presenter);
        formData.append("event_description", description);
        formData.append("event_date", date);
        formData.append("event_location", location);
        formData.append("event_image1", image);

            const response = await fetch("http://localhost/bookhub/create_event.php", {method: "POST",body: formData,credentials: "include"});
            const data = await response.json();
            if (data.status === "success")
            {
                alert("Event submitted for approval!");
                navigate("/dashboard"); 
            }else{
                alert(data.message || "Something went wrong!");
            }
    };
    return (
        <Container className="mt-5">
         <Menu />
            <div className="d-flex justify-content mb-3">
                <Button variant="secondary" onClick={() => navigate("/dashboard")}>⬅ Back</Button>
            </div>
            <h2 className="mb-4 text-center">🎉 Create a New Event</h2>
            <div className="d-flex justify-content-center">
                <Form
                    onSubmit={handleSubmit}
                    encType="multipart/form-data"
                    className="bg-light p-4 rounded shadow-sm"
                    style={{ width: "600px", maxWidth: "90%" }}>
                        <Form.Group className="mb-3">
                            <Form.Label>Event Title</Form.Label>
                            <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required /> {/*text input every time user types updates the title state with input */}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Presented By</Form.Label>
                            <Form.Control type="text" value={presenter} onChange={(e) => setPresenter(e.target.value)} required /> {/*text input every time user types updates the presenter state with input*/}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} required />
                        </Form.Group> {/*textarea input every time user types updates the description state with input*/}
                        <Form.Group className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                        </Form.Group> {/*date input every time user types updates the date state with input*/}
                        <Form.Group className="mb-3">
                            <Form.Label>Location</Form.Label>
                            <Form.Control type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
                        </Form.Group> {/*text input every time user types updates the location state with input*/}
                        <Form.Group className="mb-4">
                            <Form.Label>Event Image</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required />
                        </Form.Group> {/*file input every time user uploads the image updates to the state with input*/}
                    <Button variant="primary" type="submit">Submit Event</Button> {/*submit button to submit the form*/}
                </Form>
            </div>
        </Container>
    );
};

export default CreateEvent;
