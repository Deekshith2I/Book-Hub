import React, { useEffect, useState } from "react";
import { Button, Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Menu from "./Menu";
import "./Style.css";

const MyFavorites = () => {
  const [favorites, setFavorites] = useState([]);   // State to store the list of favorite books
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost/bookhub/get_favorites.php", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setFavorites(data))
      .catch((err) => console.error("Error fetching favorites:", err));
  }, []);

  const handleRemoveFavorite = (bookId) => {   // Function to remove a book from the favorites list
    fetch("http://localhost/bookhub/remove_favorite.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ book_id: bookId }),
            })
              .then((res) => res.json())
              .then((data) => {
                alert(data.message);
                setFavorites((prev) => prev.filter((book) => book.id !== bookId)); // Update the favorites  bylist removing the selected book
              })
              .catch((err) => console.error("Error removing favorite:", err));
          };

          return (
            <Container className="mt-5">
              <Menu />
              <div className="d-flex justify-content mb-3">
                <Button variant="secondary" onClick={() => navigate("/dashboard")}>⬅ Back to Dashboard</Button>
              </div>
               <h2 className="text-center fw-bold mb-4">❤️ My Favorite Books</h2>
              {favorites.length === 0 ? (
                <p className="text-center text-muted">No favorite books found.</p>
                    ) :  (
                    // Display grid of favorite books
                  <div className="favorite-grid"> 
                      {favorites.map(book => (
                            <div className="book-card" key={book.id}>
                                 {/* Clicking on this area navigates to the book detail page */}
                                <div style={{ width: "100%", cursor: "pointer" }} onClick={() => navigate(`/book/${book.id}`)}>
                                  <img src={book.cover_img} alt={book.title} className="card-img-top" />
                                   {/* title of the book and genre */}
                                  <Card.Title className="text-truncate">{book.title}</Card.Title>
                                  <Card.Text className="small text-muted">{book.genre}</Card.Text>
                                </div>
                              <Button className="remove-btn" variant="danger" onClick={() => handleRemoveFavorite(book.id)}>Remove</Button>   {/* Button to remove book from favorites */}
                            </div>
                          )
                        )
                      }
                  </div>
                  )
                }
            </Container>
          );
};
export default MyFavorites;
