<?php
    session_start(); // ✅ Start session

    include 'db_connect.php';
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");
    if ($_SERVER['REQUEST_METHOD'] === "OPTIONS") {
        http_response_code(200);
        exit();
    }
    //checks if the user is logged in
    if (!isset($_SESSION['user_email'])) {
        echo json_encode(["status" => "error", "message" => "Unauthorized"]);
        exit();
    }

    $user_email = $_SESSION['user_email'];

    //Decode the JSON request body to extract book_id
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data["book_id"])) {
        //if book ID is missing in request returns error
        echo json_encode(["status" => "error", "message" => "Missing book ID"]);
        exit();
    }

    $book_id = (int) $data["book_id"]; // Convert book_id to integer
    $query = "DELETE FROM favorites WHERE user_email = ? AND book_id = ?";  //Prepare DELETE query to remove the book
    $stmt = $conn->prepare($query);
    $stmt->bind_param("si", $user_email, $book_id);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Book removed from favorites"]);    // removes the book from favorites

    } else {
        echo json_encode(["status" => "error", "message" => "Failed to remove favorite"]);  //Failed to  delete

    }

?>
