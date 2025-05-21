<?php
    session_start(); // ✅ Start session
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

    //  Only allow admin
    if (!isset($_SESSION['user_email'])) {
        echo json_encode(["status" => "error", "message" => "User not logged in"]);
        exit();
    } else if ($_SESSION['user_email'] !== 'bookadmin@gmail.com') {
        echo json_encode(["status" => "error", "message" => "Unauthorized access"]);
        exit();
    }


    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data["book_id"])) {
        echo json_encode(["status" => "error", "message" => "Missing book ID"]);
        exit();
    }

    $book_id = (int) $data["book_id"];

    $query = "DELETE FROM books WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $book_id);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Book deleted successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to delete book"]);
    }
?>
