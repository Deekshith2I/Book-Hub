<?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    include 'db_connect.php';
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");
    // Read JSON from frontend
    $json = file_get_contents("php://input");
    if (!$json) {
        echo json_encode(["status" => "error", "message" => "No data received"]);
        exit();
    }
    $data = json_decode($json, true); // Decode JSON input into a PHP associative array
    
    // Extract fields from the request
    $name = $data["name"] ?? '';
    $email = $data["email"] ?? '';
    $password = $data["password"] ?? '';
    
    if (!$name || !$email || !$password) {
        // Validate that all required fields are provided
        echo json_encode(["status" => "error", "message" => "All fields are required"]);
        exit();
    }
    
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);     //hashing the user's password using BCRYPT
    $query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($query); 
    $stmt->bind_param("sss", $name, $email, $passwordHash); 
    // Bind name, email, and hashed password to the query
    
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Signup successful!"]);   // If insertion is successful return success
    } else {
        echo json_encode(["status" => "error", "message" => "Email already exists"]);    // If email already exists returns error

    }
?>
