<?php
session_start();
if ($_SESSION['user'] == 'admin') {



/*
DB SETUP
*/
include '../sql.php';
$conn = sql();



/*
fuknce pro testovani linku
*/
include '../fce.php';



/*
values
*/
$id = isset($_GET['id'])?$_GET['id']:false;
$data = false;
$dataId = false;
$status = 'default';



/*
upload souboru
*/
if ($id && isset($_FILES['files']) && !empty($_FILES['files'])) {

    $pocet = count($_FILES["files"]['name']);

    // projde a uploadne je po jednom souboru
    for ($i = 0; $i < $pocet; $i++) {

        if ($_FILES["files"]["error"][$i] > 0) {

            $status = 'file error: '.$_FILES["files"]["error"][$i];

        // upload souboru
        } else {

            // vytvori nove jmeno souboru
            $newName = false;
            while (file_exists('../../data/projects/'.$newName.'.jpg') || !$newName) {
              $newName = randNazev();
            }

            // uploadne ho a jestli se to podari...
            $adresa = '../../data/projects/'.$newName.'.jpg';

            if (resizeImg($_FILES["files"]["tmp_name"][$i], $adresa, 2048, 2048)) {

              // ...prida ho do databaze
              $sql = 'INSERT INTO projectdata(pid, filename) VALUES ("'.$id.'", "'.$newName.'")';
              if ($conn->query($sql)) {

                $data = $newName;
                $status = 'success';
                $dataId = $conn->insert_id;

              // pokud chyba db, smaze ten upload
              } else {
                unlink($adresa);
                $status = 'db error';
              }

            // pokud upload chyba...
            } else {
              $status = 'upload error';
            }

        }

    }

} else {

  $status = 'bad post inputs';

}



/*
OUTPUT
*/
echo '
{
  "headder": "upload",
  "status": "'.$status.'",
  "data": "'.$data.'",
  "dataId": "'.$dataId.'",
  "id": "'.$id.'"
}
';

}
