
<?php
    include 'db_connect.php';

    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");

    //Only fetch events where is_approved = 0
    $query = "SELECT * FROM events WHERE is_approved = 0 ORDER BY created_at DESC";
    $result = mysqli_query($conn, $query);

    $pending_events = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $pending_events[] = $row;
    }

    echo json_encode($pending_events);
?>
