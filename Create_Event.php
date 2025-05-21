<?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    session_start();
    include 'db_connect.php'; // Database connection

    // CORS Headers
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");

    // Handle preflight request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }

    //Check if user is logged in
    if (!isset($_SESSION['user_email'])) {
        echo json_encode(["status" => "error", "message" => "Unauthorized"]);
        exit();
    }

    $user_email = $_SESSION['user_email']; // Assign user email from session

    // Validate input
    $event_title       = $_POST['event_title'] ?? '';
    $event_presenter   = $_POST['event_presenter'] ?? '';
    $event_description = $_POST['event_description'] ?? '';
    $event_date        = $_POST['event_date'] ?? '';
    $event_location    = $_POST['event_location'] ?? '';
    $imageFile         = $_FILES['event_image1'] ?? null;

    if (empty($event_title)) {
        echo json_encode(["status" => "error", "message" => "Event title is required."]);
        exit;
    } else if (empty($event_presenter)) {
        echo json_encode(["status" => "error", "message" => "Event presenter is required."]);
        exit;
    } else if (empty($event_description)) {
        echo json_encode(["status" => "error", "message" => "Event description is required."]);
        exit;
    } else if (empty($event_date)) {
        echo json_encode(["status" => "error", "message" => "Event date is required."]);
        exit;
    } else if (empty($event_location)) {
        echo json_encode(["status" => "error", "message" => "Event location is required."]);
        exit;
    } else if (!$imageFile) {
        echo json_encode(["status" => "error", "message" => "Event image is required."]);
        exit;
    }

    // Upload image
    $imageName  = uniqid() . "_" . basename($imageFile["name"]);
    $targetDir  = "assets/events/";
    $targetFile = $targetDir . $imageName;

    if (!move_uploaded_file($imageFile["tmp_name"], $targetFile)) {
        echo json_encode(["status" => "error", "message" => "Failed to upload image."]);
        exit();
    }

    // Insert into database
    $query = "INSERT INTO events (event_title, event_presenter, event_description, event_date, event_location, event_image1, status, user_email)
            VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("sssssss", $event_title, $event_presenter, $event_description, $event_date, $event_location, $imageName, $user_email);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Event submitted for approval."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to create event."]);
    }
?>
