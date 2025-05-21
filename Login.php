<?php
    session_start();
    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    header("Access-Control-Allow-Origin: http://localhost:3000"); // CORS HEADERS Allow requests from frontend (React running on localhost:3000)
    header("Access-Control-Allow-Credentials: true"); // Allow sending cookies
    header("Access-Control-Allow-Methods: POST, OPTIONS"); // Methods allowed
    header("Access-Control-Allow-Headers: Content-Type"); // Allowed headers
    header("Content-Type: application/json"); // Response content type

    // Preflight OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }

    include 'db_connect.php';

    //Read raw input from frontend
    $json = file_get_contents("php://input"); 

    if (!$json) {
        echo json_encode(["status" => "error", "message" => "No data received"]);
        exit();
    }

    $data = json_decode($json, true); //converts html request to php asscoiative array
    $email = $data["email"] ?? ""; 
    $password = $data["password"] ?? "";

    if (!$email || !$password) {
        echo json_encode(["status" => "error", "message" => "Missing email or password"]);
        exit();
    } //so if both email and password are empty then it shows missing file

    // Check DB
    $query = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($query);  //prepared statement
    $stmt->bind_param("s", $email); //binds the string  email to placeholder
    $stmt->execute(); //excutes 
    $result = $stmt->get_result(); //gets the result and stores in variable

    if ($result->num_rows === 1) { 
        $user = $result->fetch_assoc(); 
        if (password_verify($password, $user["password"])) { //now if $password value and above hashed password matches it 
            $_SESSION["user_email"] = $user["email"];
            $_SESSION["name"] = $user["name"];
            $is_admin = ($user["email"] === "bookadmin@gmail.com");
            echo json_encode(["status" => "success", "is_admin" => $is_admin]); //checks if admin loggin in
        } else {
            echo json_encode(["status" => "error", "message" => "Invalid credentials"]); //if the passowrd wont match
        }
    } else {
        echo json_encode(["status" => "error", "message" => "User not found"]);// if nothing found
    }
?>
