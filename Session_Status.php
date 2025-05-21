<?php
    session_start();
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");
    // Handle preflight request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }

    // Check if user is logged in

    if (isset($_SESSION['user_email'])) { //checks if session variable exists
        echo json_encode([ //if exists sends data in json
            "status" => "logged_in",
            "email" => $_SESSION['user_email'],
            "name" => $_SESSION['name'] ?? ""
        ]);
    } else {
        echo json_encode([ //if not logged in
            "status" => "not_logged_in"
        ]);
    }
?>
