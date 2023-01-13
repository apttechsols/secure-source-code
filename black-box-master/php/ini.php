<?php
session_start();



/*
SESSIONS SETUP for defaults
*/
// language
if (!isset($_SESSION['lang'])) {
  // default jazyk prohlizece
  $defaultLang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
    // pokud neni cestina, automaticky en
    if ($defaultLang == 'cs') {$lang = 'cs';} else {$lang = 'en';}

  $_SESSION['lang'] = $lang;
}
// kurator
if (!isset($_SESSION['kurator'])) {$_SESSION['kurator'] = 'k1';}
// user
if (!isset($_SESSION['user'])) {$_SESSION['user'] = 'visitor';}
