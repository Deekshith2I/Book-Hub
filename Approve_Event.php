<?php
    session_start();

    include 'db_connect.php';
    
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");

    // Handle CORS preflight request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
    if (!isset($_SESSION['user_email']) || $_SESSION['user_email'] !== 'bookadmin@gmail.com') { // checks the user
        echo json_encode(["status" => "error", "message" => "Unauthorized"]);
        exit();
    }
    $json = file_get_contents("php://input");
    $data = json_decode($json, true);
    $event_id = $data['event_id'] ?? null;
    if (!$event_id) {
        echo json_encode(["status" => "error", "message" => "Missing event ID"]);
        exit();
    } 
    $query = "UPDATE events SET is_approved = 1, status = 'approved' WHERE event_id = ?"; //aprroved is set to 1
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $event_id);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Event approved successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to approve event"]);
    }
?>
