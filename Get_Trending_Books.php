<?php
session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'db_connect.php';
if (!$conn) {
    echo json_encode(["status" => "error", "message" => "DB connection failed"]);
    exit();
}


// ✅ CORS Headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

//Handle OPTIONS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

//Get books sorted by average rating (simulate trending)
$query = "SELECT b.*, IFNULL(AVG(r.rating), 0) AS avg_rating FROM books b LEFT JOIN
         reviews r ON b.id = r.book_id GROUP BY b.id HAVING avg_rating > 0 ORDER BY avg_rating DESC LIMIT 6;";

$result = $conn->query($query);

if (!$result) {
    echo json_encode(["status" => "error", "message" => "Query failed"]);
    exit();
}

$books = [];
while ($row = $result->fetch_assoc()) {
    $books[] = $row;
}

echo json_encode($books);
?>
