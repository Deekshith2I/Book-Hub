import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Menu from "./Menu";
import "./Style.css";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost/bookhub/get_book.php?id=${id}`).then(res => res.json()), //getting book info 
      fetch(`http://localhost/bookhub/get_reviews.php?book_id=${id}`).then(res => res.json()), //fetching book reviews
      fetch("http://localhost/bookhub/get_favorites.php", { credentials: "include" }).then(res => res.json()) //fetches if favorites 
    ])
      .then(([bookData, reviewsData, favoritesData]) => {
        setBook(bookData); //stores book data
        setReviews(reviewsData); //sets list of reviews
        const fav = favoritesData.find(favBook => favBook.id.toString() === id);
        setIsFavorite(!!fav);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading book details:", err);
        setLoading(false);
      });
  }, [id]);

  const handleAddReview = async () => {
    if (!reviewText.trim()) { //checks if the review text is empty 
      alert("Please provide a review text.");
    } else if (rating < 1 || rating > 5) {
      alert("Please provide a valid rating between 1 and 5.");
    } else {
      // All validations passed, proceed with submitting the review
    }
    

    const response = await fetch("http://localhost/bookhub/add_review.php", {
      method: "POST", //sends post request
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ book_id: parseInt(id), text: reviewText, rating: parseInt(rating) }) //converts string to number
    });

    const data = await response.json(); 
    if (data.status === "success") { //if backend successfully adds review
      setReviewText("");
      setRating(0);
      const res = await fetch(`http://localhost/bookhub/get_reviews.php?book_id=${id}`); //fetchs the updated review list
      const updatedReviews = await res.json();
      setReviews(updatedReviews);
    } else { //if fails to add review shows error alert
      alert(data.message || "Failed to add review");
    }
  };

  const toggleFavorite = async () => {
    const url = isFavorite ? "remove_favorite.php" : "add_favorite.php"; //if true removes if false it adds
    const response = await fetch(`http://localhost/bookhub/${url}`, { //sends the data to backend in json format
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ book_id: id })
    });

    const data = await response.json(); //waits for the repsonse from backend
    if (data.status === "success") { //if successfully done shows added to favorites
      setIsFavorite(!isFavorite);
    } else {
      alert("Something went wrong"); //if fails gives error
    }
  };

  const renderStars = (value, onClick = () => {}, editable = false) => { //detarimines if stars are clickable
    return [...Array(5)].map((_, i) => ( //creates an array of 5 loops through by using map
      <span
        key={i} onClick={() => editable && onClick(i + 1)} //allows star to click
        style={{ cursor: editable ? "pointer" : "default", color: i < value ? "gold" : "#ccc", fontSize: "20px" }} > 
        ★
      </span>//shows pinter if clickable and fills stars 
    ));
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /> Loading...</div>;
  if (!book) return <div className="text-center mt-5 text-danger">Book not found.</div>;

  return (
    <Container className="mt-5">
              <Menu />
              <div className="d-flex justify-content mb-3">
                <Button variant="secondary" onClick={() => navigate("/dashboard")}>⬅ Back</Button>
              </div>

              <h3 className="mb-4 text-primary fw-bold">📖 Book Details</h3>
              <Row>
                <Col md={4}>
                  <Card className="shadow-sm">
                    <Card.Img
                      src={book.cover_img || "https://via.placeholder.com/250x375?text=No+Image"}
                      style={{ height: "420px", objectFit: "contain" }}
                    />
                  </Card>
                </Col>
                <Col md={8}>
                  <h4 className="fw-bold">{book.title}</h4>
                  <p><strong>Author:</strong> {book.author}</p>
                  <p><strong>Genre:</strong> {book.genre}</p>
                  <p><strong>Language:</strong> {book.language}</p>
                  <p><strong>Pages:</strong> {book.pages}</p>
                  <p><strong>Description:</strong></p>
                  <p>{book.description}</p>
                  <Button variant={isFavorite ? "danger" : "success"} onClick={toggleFavorite} className="mt-2"> {/*danger if already in favorites succes if not there in favorites*/}
                    {isFavorite ? "Remove from Favorites" : "Add to Favorites"}  {/*the button label chnages based on book status*/}
                  </Button>
                </Col>
              </Row>
        <Form className="mb-4">
          <div className="review-box-wrapper">
            <hr className="my-5" />
            <h4 className="review-section">User Reviews</h4>
              <Form.Group>
                <Form.Label>Rating</Form.Label>
                <div className="rating-stars">{renderStars(rating, setRating, true)}</div>
              </Form.Group>
              <Form.Control as="textarea" rows={3} value={reviewText} onChange={(e) => setReviewText(e.target.value)}/>
              <Button className="mt-2 btn-submit-review" onClick={handleAddReview}>Submit Review</Button>
          </div>
        </Form>
          {reviews.length === 0 ? (
            <p>No reviews yet for this book.</p>) : 
            (
                reviews.map((review, index) => (
                  <Card key={index} className="mb-3 shadow-sm review-card">
                      <Card.Body>
                          <div>{renderStars(review.rating)}</div>
                          <small className="text-muted">By {review.user_name || "Anonymous"}</small>
                          <Card.Text className="mt-2">{review.text}</Card.Text>
                      </Card.Body>
                  </Card>
                )
              )
            )
          }
    </Container>
  );
};
export default BookDetails;
