<?php
    session_start();
    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    include 'db_connect.php';

    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }

    $json = file_get_contents("php://input"); //gets request from html body
    if (!$json) { //if empty $json this will excutes
        echo json_encode(["status" => "error", "message" => "No data received"]);
        exit();
    }

    $data = json_decode($json, true); //converts raw json data to PHP assoc arrays
    $book_id = $data['book_id'] ?? null; //
    $text = $data['text'] ?? '';// 
    $rating = $data['rating'] ?? null;

    if (!isset($_SESSION['user_email'])) { //checks if user is looged in or not
        echo json_encode(["status" => "error", "message" => "User not logged in"]);
        exit();
    }

    if (!$book_id) { //if there is empty bookid returns error
        echo json_encode(["status" => "error", "message" => "Book ID is required"]);
        exit();
    } else if (!$text) { //if text box is empty returns error
        echo json_encode(["status" => "error", "message" => "Review text is required"]);
        exit();
    } else if (!$rating) { // if there is no rating given returns error
        echo json_encode(["status" => "error", "message" => "Rating is required"]);
        exit();
    }
    

    $user_name = $_SESSION['name'] ?? 'Anonymous'; //if there is no name uses annonymous

    $query = "INSERT INTO reviews (book_id, user_name, text, rating) VALUES (?, ?, ?, ?)"; //preparing a query to store the revives in db by placeholders intially
    $stmt = $conn->prepare($query);

    if (!$stmt) { //if db connection fails
        echo json_encode(["status" => "error", "message" => "Prepare failed", "sql_error" => $conn->error]);
        exit();
    }

    $stmt->bind_param("isss", $book_id, $user_name, $text, $rating); //binds the incoming values

    if ($stmt->execute()) { //now the insert stmt is excuted
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to save review"]);
    }
?>
