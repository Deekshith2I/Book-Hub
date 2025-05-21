<?php
    session_start(); //Start session

    include 'db_connect.php';
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");

    // Checks whether the user is logged in or not
    if (!isset($_SESSION['user_email'])) {
        echo json_encode(["status" => "error", "message" => "Unauthorized"]);
        exit();
    }

    $user_email = $_SESSION['user_email'];

    // Read JSON input
    $json = file_get_contents("php://input");
    $data = json_decode($json, true);

    if (!$data) {
        echo json_encode(["status" => "error", "message" => "Missing request data"]);
        exit();
    } else if (!isset($data["book_id"])) {
        echo json_encode(["status" => "error", "message" => "Missing book ID"]);
        exit();
    }

$book_id = (int) $data["book_id"]; // Convert book_id from string to integer

//Check if the book is already in the user's favorites
$check_query = "SELECT * FROM favorites WHERE user_email = ? AND book_id = ?"; // Preparing a SQL SELECT query to find if book already exists
$stmt = $conn->prepare($check_query);  // Prepare the query securely using prepared statements
$stmt->bind_param("si", $user_email, $book_id); //binds the incoming values
$stmt->execute(); // Executes the SELECT query
$result = $stmt->get_result(); // Retrieves matching records from the favorites table

if ($result->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Book is already in favorites"]);
} else {
    $query = "INSERT INTO favorites (user_email, book_id) VALUES (?, ?)";     // Prepare an INSERT query to add this book to favorites
    $stmt = $conn->prepare($query); 
    $stmt->bind_param("si", $user_email, $book_id);  


    // Execute the INSERT query
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Book added to favorites"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to add favorite"]);
    }
}

?>
