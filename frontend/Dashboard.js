import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, InputGroup, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Menu from "./Menu";
import "./Style.css";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { //checks whether the user logen in or not 
    fetch("http://localhost/bookhub/session_status.php", { credentials: "include" })
      .then(res => res.json())
      .then(data => { 
        if (data.status === "logged_in") { 
          setUserName(data.name);
          setUserEmail(data.email);
        } else {
          navigate("/"); //if not looged in redirect to login page
        }
      });
  }, [navigate]);

  useEffect(() => {
    axios.get("http://localhost/bookhub/fetch_books.php", { withCredentials: true }) //fetch the data from backend by get request
      .then(res => { 
        const books = res.data; 
        setRecentBooks(books.slice(0, 6)); //slices the books list from first 6 books of recently added
      })
      .catch(err => console.error("Error fetching recent books:", err)); //if failed fetch shows error
  }, []);

  useEffect(() => {
    axios.get("http://localhost/bookhub/Get_Trending_Books.php", { withCredentials: true }) //fetch trending books by get request
      .then(res => setTrendingBooks(res.data)) //extracts data from response and updates to tredning books state
      .catch(err => console.error("Error fetching trending books:", err)); //catches if any errors
  }, []); 

  const handleSearch = () => {
    if (!searchTerm.trim()) return; 

    axios.get(`http://localhost/bookhub/fetch_books.php?search=${encodeURIComponent(searchTerm)}`, { //if user enters word in search it replaces search term in the URL
      withCredentials: true,
    })
      .then(res => {
        setSearchResults(res.data); //the recevied data from backend is stored in setSearchResult
        setShowSearchResults(true); //shows the search results
      })
      .catch(err => {
        console.error("Search error:", err); ///if any error it catchs and shows eroor
        setShowSearchResults(false); //hides the result if any errors
      });
  };

  const renderBooks = (books) => ( //defining the reusable structure for displaying
    <Row className="justify-content-center">
      {books.map(book => (
        <Col key={book.id} md={3} sm={6} xs={10} className="mb-4">
          <Card
            style={{ cursor: "pointer", height: "100%" }}
            className="shadow-sm border-0 h-100"
            onClick={() => navigate(`/book/${book.id}`)}
          >
            <Card.Img
              src={book.cover_img || "https://via.placeholder.com/250x375?text=No+Image"}
              style={{ height: "320px", objectFit: "contain", padding: "10px" }}
            />
            <Card.Body className="text-center">
              <Card.Title style={{ fontSize: "1rem" }}>{book.title}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );

  return (
    <Container className="mt-5">
      <h4 className="mb-4 text-center">Welcome, {userEmail === "bookadmin@gmail.com" ? "Admin" : userName || "Guest"}!</h4> {/*displaying the user based on name given while registering account*/}

      <Menu />

      <div className="header-bar d-flex align-items-center justify-content-between flex-wrap mb-4">
        <h2 className="fw-bold mb-2 mb-md-0">📚 BookHub</h2>
        <InputGroup className="search-bar" style={{ maxWidth: "600px" }}>
          <Form.Control placeholder="Search by Title, Author..." value={searchTerm} 
           onChange={(e) => 
            { setSearchTerm(e.target.value);
              if (e.target.value === "") 
                {
                  setShowSearchResults(false);
                  setSearchResults([]);
                }
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()} //listens for key press if press click handleSearch triggers
          />
          <Button variant="primary" onClick={handleSearch}>🔍</Button>
        </InputGroup>
      </div>

      {userEmail === "bookadmin@gmail.com" && (
        <div className="my-4 text-center">
          <Button variant="warning" onClick={() => navigate("/admin")}>📋 Go to Admin Panel</Button>
        </div>
      )}

      <div className="my-4 text-center">
        <img
          src="http://localhost/bookhub/assets/Banner.jpg" alt="Upcoming Events"
          className="img-fluid rounded shadow-sm"
          style={{ cursor: "pointer", maxHeight: "280px", objectFit: "cover" }}
          onClick={() => navigate("/events")}
        />
      </div>

      {/* Search results */}
      {showSearchResults && (
        <>
          <h4 className="mb-3 text-center fw-bold text-info">Search Results</h4>
          {searchResults.length > 0 ? renderBooks(searchResults) : (
            <p className="text-center text-muted">No books found matching your search.</p>
          )}
        </>
      )}

      {!showSearchResults && (
        <>
          <section className="my-5">
            <div className="d-flex align-items-center text-center mb-4">
              <div className="flex-grow-1 border-top border-secondary"></div>
              <h4 style={{ color: "#4169E1" }} className="fw-bold px-3 m-0">Everyone Is Talking About</h4>
              <div className="flex-grow-1 border-top border-secondary"></div>
            </div>
            <div className="mt-3">{renderBooks(trendingBooks)}</div>
          </section>

          <section className="my-5">
            <div className="d-flex align-items-center text-center mb-4">
              <div className="flex-grow-1 border-top border-secondary"></div>
              <h4 style={{ color: "#6A0DAD" }} className="fw-bold px-3 m-0">New Arrivals</h4>
              <div className="flex-grow-1 border-top border-secondary"></div>
            </div>
            <div className="mt-3">{renderBooks(recentBooks)}</div>
          </section>
        </>
      )}
    </Container>
  );
};

export default Dashboard;
