<?php
session_start();

  if (isset($_POST['kurator'])) {

    if ($_SESSION['kurator'] == $_POST['kurator']) {
      echo 'same';
    } else {
      $_SESSION['kurator'] = $_POST['kurator'];
      echo 'changed';
    }

  }
