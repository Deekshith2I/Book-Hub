<?php
    include 'db_connect.php';

    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");

    if (isset($_GET['book_id'])) {
        // Fetch reviews for a specific book
        $bookId = $_GET['book_id'];
        $query = "SELECT user_name, text, rating FROM reviews WHERE book_id = ? ORDER BY created_at DESC";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $bookId);
        $stmt->execute();
        $result = $stmt->get_result();
    } else {
        // Fetch all reviews with book title
        $query = "SELECT reviews.id, reviews.user_name, reviews.text, reviews.rating, reviews.created_at, books.title AS book_title 
                FROM reviews 
                LEFT JOIN books ON reviews.book_id = books.id
                ORDER BY reviews.created_at DESC";
        $result = $conn->query($query);
    }

    $reviews = [];
    while ($row = $result->fetch_assoc()) {
        $reviews[] = $row;
    }

    echo json_encode($reviews);
?>
