import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(""); //use state to store the user email

  useEffect(() => {
    fetch("http://localhost/bookhub/session_status.php", { //fetchs data from session status
      credentials: "include"
    })
      .then(res => res.json()) //response into json format
      .then(data => {
        if (data.status === "logged_in") { //if data from backend says logged in then it stores in email state
          setUserEmail(data.email);
        }
      });
  }, []);

  const handleLogout = () => {
    fetch("http://localhost/bookhub/logout.php", {method: "POST", credentials: "include" })
      .then(() => navigate("/"))
      .catch(() => alert("Logout failed. Please try again."));
  };

  return (
    <div className="d-flex justify-content-end mb-3">
      <Dropdown> {/*Dropdown for menu*/}
        <Dropdown.Toggle variant="secondary">Menu</Dropdown.Toggle>
        <Dropdown.Menu>
          {/*when ever user clicks it navigates to respective page*/}
          <Dropdown.Item onClick={() => navigate("/myfavorites")}>My Favorites</Dropdown.Item>
          <Dropdown.Item onClick={() => navigate("/bookshelves")}>Bookshelves</Dropdown.Item>
          <Dropdown.Item onClick={() => navigate("/create-event")}>Create Event</Dropdown.Item>
          <Dropdown.Item onClick={() => navigate("/about")}>About Us</Dropdown.Item>

          {/*Show only if admin */}
          {userEmail === "bookadmin@gmail.com" && (
            <Dropdown.Item onClick={() => navigate("/admin-events")}>Manage Events</Dropdown.Item>
          )}

          <Dropdown.Divider />
          <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};
export default Menu;
