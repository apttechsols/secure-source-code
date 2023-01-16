<?php require_once($_SERVER['DOCUMENT_ROOT']."/system/main/comman_control/_frontend.php");  ?>
<?php
    header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: POST');
	header('Content-Type: application/json');
	header('Access-Control-Allow-Headers:Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');
    echo json_encode("Hello World");
?>