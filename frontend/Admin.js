import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Pagination, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Style.css";

const Admin = () => {
  const [books, setBooks] = useState([]);
  const [visibleBooks, setVisibleBooks] = useState(10);
  const [reviews, setReviews] = useState([]);
  const [bookCount, setBookCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(5);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [pages, setPages] = useState("");
  const [coverImg, setCoverImg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

        //Checks if logged-in user is admin
      useEffect(() => {
          fetch("http://localhost/bookhub/session_status.php", {   //session status to check login and role
            credentials: "include" //Include cookies for session validation
          })
            .then(res => res.json()) // Parse the JSON response
            .then(data => {
              if (data.status !== "logged_in" || data.email !== "bookadmin@gmail.com") {   // If admin is not logging, redirect to dashboard

                navigate("/dashboard");
              }
            });
        }, [navigate]);


      useEffect(() => {
        axios.get("http://localhost/bookhub/fetch_books.php",  { withCredentials: true })  //sends GET request to backend ensures cookies sent along
            .then(response => 
          {
            setBooks(response.data); //store books
            setBookCount(response.data.length); //counts total books
          });

        axios.get("http://localhost/bookhub/get_reviews.php", { withCredentials: true })
            .then(response => 
          {
            setReviews(response.data); //store reviews
            setReviewCount(response.data.length); //  Counts total reviews
          });
    }, []);

    const handleAddBook = (e) => { //creating a function for handling add books
        e.preventDefault();
        fetch("http://localhost/bookhub/add_book.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ title, author, genre, description, language, pages, cover_img: coverImg })
        })
          .then(res => res.json()) //converting backend response to json
          .then(data => {
            alert(data.message); //shows error or success message to admin
            if (data.status === "success")  //fetchs again to show newly added book on admin panel
             {
               axios.get("http://localhost/bookhub/fetch_books.php", { withCredentials: true })
               .then(response => {
                setBooks(response.data); //updates book list
                setBookCount(response.data.length); //updates total no.of books
                });
                setTitle(""); setAuthor(""); setGenre(""); setDescription(""); setLanguage(""); setPages(""); setCoverImg("");
              }
          });
      };

      const handleDeleteBook = (bookId) => {
        fetch("http://localhost/bookhub/delete_book.php", { //goes to backend with book ID to delete
          method: "POST",  //sending the data to backend to delete 
          headers: { "Content-Type": "application/json" }, //telling backend that data comes in JSON format
          credentials: "include", //including the session cookies
          body: JSON.stringify({ book_id: bookId })
        })
          .then(res => res.json()) //sends backend in json
          .then(data => {
            alert(data.message);
            if (data.status === "success") 
              { //fetching the list after successfull deletion
                axios.get("http://localhost/bookhub/fetch_books.php", { withCredentials: true })
                .then(response => {
                  setBooks(response.data); //updates books after deleting 
                  setBookCount(response.data.length); //updated no.of books after delete
                });
              }
          });
      };
      const handleDeleteReview = (ReviewId) => {
        fetch("http://localhost/bookhub/delete_review.php", {
          method: "POST",   
          headers: { "Content-Type": "application/json" },
          credentials: "include", 
          body: JSON.stringify({ review_id: ReviewId })
        })
          .then(res => res.json()) 
          .then(data => {
            alert(data.message);
            if (data.status === "success") 
              { 
                axios.get("http://localhost/bookhub/get_reviews.php", { withCredentials: true })
                .then(response => {
                  setReviews(response.data);
                  setReviewCount(response.data.length); 
                });
              }
          });
      };

      const filteredBooks = books.filter(book => //filetrs book based on search term
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const visibleFilteredBooks = filteredBooks.slice(0, visibleBooks); //displays limited no.of books
      const handleLoadMore = () => setVisibleBooks(prev => prev + 10); //handles loads more button

      const indexOfLastReview = currentPage * reviewsPerPage; //calculates index for current review pages
      const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
      const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview); //slices reviews for current page

      const paginate = (pageNumber) => setCurrentPage(pageNumber); //sets page number when pagination is cliked

      return (
        <Container className="mt-5">
            <h2 className="text-center mb-4"> Admin Dashboard</h2>
            <Row className="mb-4 text-center">
              <Col md={6}>
                <div className="summary-card bg-light p-3 rounded shadow-sm">
                  <h5 className="mb-0">📚 Total Books</h5>
                  <span className="fs-4 fw-bold text-primary">{bookCount}</span>
                </div>
              </Col>
              <Col md={6}>
                <div className="summary-card bg-light p-3 rounded shadow-sm">
                  <h5 className="mb-0">📝 Total Reviews</h5>
                  <span className="fs-4 fw-bold text-success">{reviewCount}</span>
                </div>
              </Col>
            </Row>
            <Button variant="primary" onClick={() => navigate("/dashboard")} className="mb-3">⬅ Back to Dashboard </Button>
            <Form onSubmit={handleAddBook} className="mb-4 p-3 shadow-sm bg-white rounded">
              <h4 className="mb-3">➕ Add a New Book</h4>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" value={title} onChange={e => setTitle(e.target.value)} required />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Author</Form.Label>
                    <Form.Control type="text" value={author} onChange={e => setAuthor(e.target.value)} required />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Genre</Form.Label>
                    <Form.Control type="text" value={genre} onChange={e => setGenre(e.target.value)} required />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Language</Form.Label>
                    <Form.Control type="text" value={language} onChange={e => setLanguage(e.target.value)} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label>Pages</Form.Label>
                    <Form.Control type="number" value={pages} onChange={e => setPages(e.target.value)} required />      
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={3} value={description} onChange={e => setDescription(e.target.value)} required />
                  </Form.Group>
                  <Form.Group className="mb-2"> 
                    <Form.Label>Cover Image URL</Form.Label>
                    <Form.Control type="text" value={coverImg} onChange={e => setCoverImg(e.target.value)} required />
                  </Form.Group>
                </Col>
              </Row>
              <Button variant="success" type="submit" className="mt-2">Add Book</Button>
            </Form>
          <Form.Group className="mb-3">
            <Form.Control type="text" placeholder="🔍 Search books by title, author, or genre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </Form.Group>
          <h4>All Books</h4>
          <Table striped bordered hover>
            <thead>
              <tr><th>Title</th><th>Author</th><th>Genre</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {visibleFilteredBooks.map(book => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.genre}</td>
                  <td><Button variant="danger" size="sm" onClick={() => handleDeleteBook(book.id)}>Delete</Button></td>
                </tr>
                ))
              }
            </tbody>
          </Table>
          {visibleBooks < filteredBooks.length && (
            <div className="text-center mb-4">
              <Button variant="secondary" onClick={handleLoadMore}>Load More</Button>
            </div>
          )}
          <h4 className="mt-5">📋 User Reviews</h4>
          <Table bordered hover>
            <thead><tr><th>Title</th><th>User</th><th>Rating</th><th>Review</th><th>Action</th></tr></thead>
            <tbody>
              {currentReviews.map((rev, idx) => (
                <tr key={idx}>
                  <td>{rev.book_title}</td>
                  <td>{rev.user_name}</td>
                  <td>{rev.rating}</td>
                  <td>{rev.text}</td>
                  <td><Button variant="danger" size="sm" onClick={() => handleDeleteReview(rev.id)}>Delete</Button></td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination className="justify-content-center">
            {Array.from({ length: Math.ceil(reviews.length / reviewsPerPage) }, (_, i) => (
              <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
                {i + 1}
              </Pagination.Item>
            ))}
          </Pagination>
      </Container>
    );
};
export default Admin;