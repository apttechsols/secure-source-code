<?php
session_start();
if ($_SESSION['user'] == 'admin') {



/*
values
*/
$status = 'default';



/*
provede pythnovskou clusterovacku
*/
if (isset($_POST['url'])) {

    $cmd = escapeshellcmd('nice -15 ../../python/env/bin/python ../../python/cluster.py \'path='.$_POST['url'].'\'');
    $output = shell_exec('nohup '.$cmd.' 2>&1 &');

    // odstrani nove radky a pak uvozovky
    $output = trim(preg_replace('/\s+/', ' ', $output));
    $output = trim(str_replace('"', '\"', $output));
    $output = trim(str_replace('\'', '\\\'', $output));



    /*
    dekoduje json
    */
    $json = json_decode($output, true);
    if ($json['success'] == true) {

      $status = 'success';


    } else {

      $status = 'ERROR';

    }


// konec isset $_post
} else {

  $status = 'ERROR';

}


}



/*
OUTPUT
*/
echo '
{
  "headder": "clustersExe",
  "result": "'.$output.'",
  "status": "'.$status.'"
}
';
