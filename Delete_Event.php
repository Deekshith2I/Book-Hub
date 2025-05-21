<?php
    session_start();
    include 'db_connect.php';

    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");

    //Check if admin
    if (!isset($_SESSION['user_email']) || $_SESSION['user_email'] !== 'bookadmin@gmail.com') {
        echo json_encode(["status" => "error", "message" => "Unauthorized"]);
        exit();
    }

    //Get event ID from POST body
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['event_id'])) {
        echo json_encode(["status" => "error", "message" => "Missing event ID"]);
        exit();
    }
    $data = json_decode(file_get_contents("php://input"), true);

    $event_id = (int)$data['event_id'];

    $query = "UPDATE events SET status = 'deleted' WHERE event_id = ?";     // deletes the event and sets the status to deleted
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $event_id);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Event deleted successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to delete event"]);
    }
?>