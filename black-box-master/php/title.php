<?php
session_start();



/*
DB SETUP
*/
include './sql.php';
$conn = sql();



/*
FUNKCE
*/
include './fce.php';



/*
titulek setup
*/
if (isset($_POST['url'])) {

  echo titulek($_POST['url'], $conn);

}
