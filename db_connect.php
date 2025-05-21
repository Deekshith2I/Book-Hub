<?php
$servername = "localhost";
$username = "root"; // Default XAMPP username
$password = ""; // Default password (leave empty)
$database = "book_hub"; // Your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
