import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Menu from "./Menu";
import "./Style.css";

const genres = [
  "fiction", "classics", "adventure", "dystopian", "science", "philosophy", "fantasy", "romance",
  "young adult", "historical fiction", "science fiction", "childrens", "horror", "non-fiction",
  "mystery", "picturebooks", "graphic novels", "plays", "poetry", "comics", "travel", "thriller", "drama","mythology"
  ];

  const Bookshelves = () => {
  const navigate = useNavigate();
  const [selectedGenre, setSelectedGenre] = useState(" ");
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch(`http://localhost/bookhub/fetch_books.php?genre=${selectedGenre}`) //sneds a get request to backend for genre
      .then(res => res.json())//backend data to JS object
      .then(data => setBooks(data)) //updates the book list
      .catch(err => console.error("Error fetching books:", err)); //catches if any error
  }, [selectedGenre]);

  const handleGenreClick = (genre) => {setSelectedGenre(genre);}; //updates the selected genre state triggers book fetch

  return (
    <div className="bookshelves-wrapper px-4 py-4">
      <Menu />
      <div className="d-flex justify-content mb-3">
          <Button variant="secondary" onClick={() => navigate("/dashboard")}>⬅ Back</Button>
      </div>
      <h2 className="text-center mb-4">📚 Explore All Genres</h2>
       <div className="genre-grid row px-3">
          {genres.map((genre, idx) => (
            <div key={idx} className="col-6 col-md-4 col-lg-3 mb-3">
              <div
                className={`genre-card p-3 text-center ${selectedGenre === genre ? "selected-genre" : ""}`}
                onClick={() => handleGenreClick(genre)}
                title={`View ${genre} books`}
              >
                <span className="text-capitalize fw-semibold">{genre}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="slider-section px-4 py-4">
          <h3 className="slider-title text-center"> Our Best <span className="text-capitalize">{selectedGenre}</span> Books </h3>
          {books.length === 0 ? (
            <p className="text-center text-muted">No books found in this genre.</p>
          ) : (
            <div className="slider-row">
              {books.map((book) => (
                <div key={book.id} className="book-card" onClick={() => navigate(`/book/${book.id}`)} title={book.title}>
                  <img src={book.cover_img || "https://via.placeholder.com/180x260?text=No+Image"} alt={book.title}/>
                <div className="book-title text-truncate">{book.title}</div>
                </div>
              ))}
            </div>
          )}
        </div>
    </div>
  );
};

export default Bookshelves;
