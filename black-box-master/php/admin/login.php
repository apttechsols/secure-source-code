<?php
session_start();

if (isset($_POST['login']) && isset($_POST['pass'])) {

  if (md5($_POST['login']) == '21232f297a57a5a743894a0e4a801fc3' && md5($_POST['pass']) == '00ed7fe19c7c56ecb218a8b991ce15d7') {

    $_SESSION['user'] = 'admin';
    echo 'success';

  } else {

    echo 'wrong';

  }

}
