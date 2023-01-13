<?php
session_start();
if ($_SESSION['user'] == 'admin') {



/*
DB SETUP
*/
include '../sql.php';
$conn = sql();



/*
values
*/
$status = 'default';



/*
ulozi vysledek clusteru do db
*/
if (isset($_POST['data'])) {

    // udela pole z dat
    $json = json_decode($_POST['data']);
    $limit1 = sizeof($json);



        // pro kazdou polozku v poli
        for ($i = 0; $i < $limit1; $i++) {

          $limit2 = sizeof($json[$i]);

          // pro kazdy filename v poli
          for ($c = 0; $c < $limit2; $c++) {

            // pouze filename bez koncovky
            $filename = explode('.', $json[$i][$c]);
            $fn = $filename[0];
              // najde id z DB
              $sql = 'SELECT id FROM projectdata WHERE filename = "'.$fn.'"';
              $ress = $conn->query($sql);
              $file = $ress->fetch_object();

            // vlozi id do vysledku
            $result .= $file->id;
            // pokud je tohle kolo mensi nez konec cyklu udela carku
            if ($c != $limit2-1) {
              $result .= ',';
            }

          }

          // pokud je tohle kolo mensi nez konec cyklu udela delimiter
          if ($i != $limit1-1) {
            $result .= '|';
          }

        }



        // prida to do databaze
        $sql = 'INSERT INTO clusters(clusters) VALUES ("'.$result.'")';
        if ($conn->query($sql)) {

          $status = 'success';

        // pokud chyba db, smaze ten upload
        } else {

          $status = 'db insert error';

        }



    } else {

      $status = 'bad post inputs';

    }



}



/*
OUTPUT
*/
echo '
{
  "headder": "clustersUpload",
  "result": "'.$result.'",
  "status": "'.$status.'"
}
';
