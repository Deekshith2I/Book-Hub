<?php
    include 'db_connect.php';

    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");

    $search = isset($_GET['search']) ? $_GET['search'] : ''; //using ternary operator checking if any serarch passed
    $genre = isset($_GET['genre']) ? $_GET['genre'] : '';

    if ($search) { 
        $query = "SELECT * FROM books WHERE title LIKE ? OR author LIKE ? ORDER BY id DESC";
        $stmt = $conn->prepare($query);
        $searchTerm = "%$search%"; //matches any string containing search word
        $stmt->bind_param("ss", $searchTerm, $searchTerm);
    } elseif ($genre) { //else if any genre word is runs thtough this loop
        $query = "SELECT * FROM books WHERE genre = ? ORDER BY id DESC";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $genre);
    } else {  //if no word is given then returns all books
        $query = "SELECT * FROM books ORDER BY id DESC"; 
        $stmt = $conn->prepare($query);
    }

    $stmt->execute();
    $result = $stmt->get_result(); //gets the result after execution

    $books = array(); //intializing an empty array
    while ($row = $result->fetch_assoc()) { //loops though each row in the result set 
        $books[] = $row; //adds row to book array
    }

    echo json_encode($books); //this returns matched rows to frontend to display books
?>
