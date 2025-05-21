<?php
session_start();
    include 'db_connect.php';

    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");

    if (!isset($_SESSION['user_email']) || $_SESSION['user_email'] !== 'bookadmin@gmail.com') {
        echo json_encode(["status" => "error", "message" => "Unauthorized"]);
        exit();
    }

    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data["review_id"])) {
        echo json_encode(["status" => "error", "message" => "Missing review ID"]);
        exit();
    }

    $review_id=(int) $data["review_id"];;
    $query="DELETE FROM reviews WHERE id=?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $review_id);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Review deleted successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to delete review"]);
    }
?>