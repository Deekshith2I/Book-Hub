<?php
session_start(); // Starting the session 

include 'db_connect.php';

// CORS HEADERS Allow requests from frontend (React running on localhost:3000)
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true"); // Allow sending cookies
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Methods allowed
header("Access-Control-Allow-Headers: Content-Type"); // Allowed headers
header("Content-Type: application/json"); // Response content type



//only logged-in admin to access 
if (!isset($_SESSION['user_email'])) {
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit();
} else {
    if ($_SESSION['user_email'] !== 'bookadmin@gmail.com') {
        echo json_encode(["status" => "error", "message" => "Unauthorized"]);
        exit();
    }
}

$json = file_get_contents("php://input"); // Get raw JSON input from front-end
if (!$json) {
    echo json_encode(["status" => "error", "message" => "No data received"]);
    exit();
}

$data = json_decode($json, true); // Convert JSON to PHP associative array

// Extract values from decoded php
$title = $data["title"] ?? '';
$author = $data["author"] ?? '';
$genre = $data["genre"] ?? '';
$description = $data["description"] ?? '';
$language = $data["language"] ?? '';
$pages = $data["pages"] ?? '';
$cover_img = $data["cover_img"] ?? '';

// Validate Input Fields
if (!$title) {
    echo json_encode(["status" => "error", "message" => "Title is required"]);
    exit();
} else if (!$author) {
    echo json_encode(["status" => "error", "message" => "Author is required"]);
    exit();
} else if (!$genre) {
    echo json_encode(["status" => "error", "message" => "Genre is required"]);
    exit();
} else if (!$description) {
    echo json_encode(["status" => "error", "message" => "Description is required"]);
    exit();
} else if (!$language) {
    echo json_encode(["status" => "error", "message" => "Language is required"]);
    exit();
} else if (!$pages) {
    echo json_encode(["status" => "error", "message" => "Pages count is required"]);
    exit();
} else if (!$cover_img) {
    echo json_encode(["status" => "error", "message" => "Cover image URL is required"]);
    exit();
}

// inseritng data into database

//Prepare SQL query using placeholders to prevent SQL injection
$query = "INSERT INTO books (title, author, genre, description, language, pages, cover_img) 
          VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($query);

// Bind actual values to placeholders
$stmt->bind_param("sssssis", $title, $author, $genre, $description, $language, $pages, $cover_img);

// Execute the query 
if ($stmt->execute()) {
    echo json_encode([
        "status" => "success", 
        "message" => "Book added successfully", 
        "book_id" => $stmt->insert_id // return new book ID
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to add book"]);
}
?>
