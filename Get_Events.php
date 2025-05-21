<?php
    include("db_connect.php");

    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Credentials: true");
    header("Content-Type: application/json");

    $query = "SELECT * FROM events WHERE is_approved = 1 AND status != 'deleted' ORDER BY event_date ASC";
   //fetchs approved events, excluding those marked as 'deleted', ordered by nearest event date first  
   
   $result = mysqli_query($conn, $query); //excutes sql qeury using existing dbconnection
    $events = []; //initializing an empty array
    while ($row = mysqli_fetch_assoc($result)) { //fetches one row at a time as an associative array
        $events[] = $row;
    }

    echo json_encode($events);
?>
