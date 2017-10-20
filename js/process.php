<?php

//protecting sensitive information by putting credentials in an outside file not included in source
$ini_array = parse_ini_file("config/config.ini");

$servername = $ini_array['servername'];
$dbname = $ini_array['dbname'];
$username = $ini_array['username'];
$password = $ini_array['password'];

$table = $_POST['table'];
$field = $_POST['field'];
$amount = $_POST['amount'];
$action = $_POST['action'];

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

switch ($action) {
    case "GET" :
        /*prepared statement
        $sth = $conn->prepare("select ? from ? order by rand() limit ?;");
        $sth->execute($field,$table,$amount);
        $results = $sth->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($results);
        */
        // non-prepared statement
        $sql = "select {$field} from {$table} ORDER BY -LOG(RAND()) / multiplier limit {$amount};";
        $result = $conn->query($sql);
        $emparray = array();
        while ($row = $result->fetch_assoc()) {
            $emparray[] = $row;
        }

        echo json_encode($emparray);
        break;
    
    case "POST" :
        $sql = "update {$table} set skill = {$amount} where name=\"{$field}\";";
        if (mysqli_query($conn,$sql)) {
            echo ("update succesful {$field}s new rating is {$amount}");
            } else {
            echo ("error " . mysqli_error($conn)) ;
        }
        break;
        
    case "TOP" :
        $sql = "select {$field} from {$table} order by skill DESC limit {$amount}";
        $result = $conn->query($sql);
        
        $emparray = array();
        
        while ($row = mysqli_fetch_assoc($result)) {
            $emparray[] = $row;
        }
        
        echo json_encode($emparray);
        
        break;
}

mysqli_close($conn);
?>