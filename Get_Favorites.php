<?php
    session_start(); // Start session

    include 'db_connect.php';
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");

    if ($_SERVER['REQUEST_METHOD'] == "OPTIONS") {
        http_response_code(200);
        exit();
    }

    //Check if the user is logged in 
    if (!isset($_SESSION['user_email'])) {
        echo json_encode(["status" => "error", "message" => "Unauthorized"]);
        exit();
    }

    $user_email = $_SESSION['user_email'];  //Store the logged-in user's email from the session


    //SQL query to get books that the user has marked as favorite
    $query = "SELECT books.* FROM books INNER JOIN favorites ON books.id = favorites.book_id 
            WHERE favorites.user_email = ?";     // This joins the 'books' table with the 'favorites' table using the book ID,

    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $user_email); 
    $stmt->execute(); 
    $result = $stmt->get_result(); 

    $favorites = array(); // Initialize an empty array to hold favorite books

    
    while ($row = $result->fetch_assoc()) { 
        $favorites[] = $row; 
    }
    echo json_encode($favorites);
?>
