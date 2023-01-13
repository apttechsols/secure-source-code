<?php
session_start();

    if ($_SESSION['lang'] == 'cs') {
      $_SESSION['lang'] = 'en';
    } else {
      $_SESSION['lang'] = 'cs';
    }

echo $_SESSION['lang'];
