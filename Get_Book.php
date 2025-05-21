<?php
include 'db_connect.php';
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if (!isset($_GET['id'])) {
    echo json_encode(["error" => "Missing book ID"]);
    exit();
}

$bookId = $_GET['id']; 

$query = "SELECT * FROM books WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $bookId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $book = $result->fetch_assoc();
    echo json_encode($book);
} else {
    echo json_encode(null); // Book not found
}
?>
