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
$id = false;
$status = 'default';
$html = '<div class=\\"admin\\"><h1>DATA</h1><br>';



/*
main funkce
*/
if ($conn) {

  // pokud je setnuta akce
  if (isset($_POST['action'])) {

    $html .= '<ul><li><a href=\\"/admin\\">administrace</a></li><li><a href=\\"/admin/projects\\">projekty</a></li></ul>';

    // jaka akce je setnuta
    switch ($_POST['action']) {

      // prida data do projektu => pouze formular (upload se deje v souboru /admin/dataUpload.php)
      case 'add':

        // pokud je zadano id, zobrazi formular
        if (isset($_POST['id'])) {

          // vypsat nazev projektu
          $sql = 'SELECT * FROM projects WHERE id = "'.$_POST['id'].'"';
          $ress = $conn->query($sql);
          $obj = $ress->fetch_object();

          $html .= '<br><h2>🗁 PŘIDAT DATA do PROJEKTU '.$obj->name.'</h2><br>';
          $html .= '<ul>';
          $html .= '<li><a href=\\"/prj/'.$obj->link.'\\">[otevřít projekt]</a></li>';
          $html .= '<li><a href=\\"/admin/data/show/'.$obj->id.'\\">zobrazit data projektu</a></li>';
          $html .= '<li><a href=\\"/admin/projects/edit/'.$obj->id.'\\">upravit projekt ['.$obj->id.'] '.$obj->name.'</a></li>';
          $html .= '</ul><br>';
          $html .= '<h3>NAHRÁT .jpg</h3>';
          $html .= '<ul id=\\"fronta\\"></ul>';
          $html .= '<form idkey=\\"'.$obj->id.'\\" method=\\"post\\" enctype=\\"multipart/form-data\\" class=\\"uploadForm\\" table=\\"data\\" act=\\"add\\">';
          $html .= '<input type=\\"file\\" name=\\"files[]\\" multiple accept=\\"image/jpeg\\" id=\\"files\\"><br><br>';
          $html .= '<input type=\\"submit\\" name=\\"submit\\" value=\\"NAHRÁT\\">';
          $html .= '</form>';

        } else {

          $html .= '<h1>CHYBÍ ID PROJEKTU</h1>';
          $status = 'error: project id not provided';

        }

      break;

      // upravi data => pouze SQL exekuce, formular se generuje v case: 'show' / pri uploadu
      case 'edit':

          if (isset($_POST['sql']) && $_POST['sql'] == true && isset($_POST['id'])) {

            $sql = 'UPDATE projectdata SET description = "'.repairStr($_POST['popis']).'", description_en = "'.repairStr($_POST['popis_en']).'" WHERE id = "'.$_POST['id'].'"';
            if ($conn->query($sql)) {
              $status = 'success';
              $id = $_POST['id'];
            } else {
              $status = 'db error';
            }

          } else {

            $html .= '<h1>CHYBÍ ID a SQL</h1>';
            $status = 'error: id not provided, sql not true';

          }

      break;

      // smaze z db i serveru data
      case 'delete':

          if (isset($_POST['id'])) {

            $sql = 'SELECT pid, filename FROM projectdata WHERE id = "'.$_POST['id'].'"';
            if ($ress = $conn->query($sql)) {
              $obj = $ress->fetch_object();
              $filename = $obj->filename.'.jpg';
              $pid = $obj->pid;
            }

            // sejde z databaze
            $sql = 'DELETE FROM projectdata WHERE id = '.$_POST['id'];
            if ($conn->query($sql)) {

              // sejde ze serveru
              chmod('../../data/projects/'.$filename, 0777);
              if (unlink('../../data/projects/'.$filename)) {
                $html .= '<br><h2>SMAZÁNO</h2><br><ul><li><a href=\\"/admin/data/show/'.$pid.'\\">zpět na seznam nahraných dat</a></li></ul>';
              } else {
                $html .= '<br><h2>CHYBA NA SERVERU: SOUBOR SMAZÁN Z DATABÁZE, ALE ZŮSTAL NA SERVERU</h2><br>Jméno souboru: '.$filename.'<br>Kontaktujte podporu a zašlete jí jméno souboru, jinak soubor bude dělat neplechu u generování clusterů pro AI kurátora.';
              }

            } else {
              $html .= '<br><h2>CHYBA DATABÁZE, NESMAZÁNO</h2>';
            }

          } else {

            $html .= '<br><h2>CHYBÍ ID</h2>';

          }

      break;

      // zobrazi vsechny data v tabulce
      case 'show':

          // vypsat nazev projektu
          $sql = 'SELECT * FROM projects WHERE id = "'.$_POST['id'].'"';
          if ($ress = $conn->query($sql)) {

              while($obj = $ress->fetch_object()){
                  $html .= '<br><h2>🗁 DATA PROJEKTU '.$obj->name.'</h2><br>';
                  $html .= '<ul>';
                  $html .= '<li><a href=\\"/prj/'.$obj->link.'\\">[otevřít projekt]</a></li>';
                  $html .= '<li><a href=\\"/admin/data/add/'.$obj->id.'\\">přidat data do projektu</a></li>';
                  $html .= '<li><a href=\\"/admin/projects/edit/'.$obj->id.'\\">upravit projekt ['.$obj->id.'] '.$obj->name.'</a></li>';
                  $html .= '</ul>';
              }
          }

          // vypsat data co spadaji do toho projektu
          $sql = 'SELECT * FROM projectdata WHERE pid = "'.$_POST['id'].'"';
          if ($ress = $conn->query($sql)) {

              $html .= '<br><table class=\\"adminTable\\"><tr><td>ID</td><td>DATA</td><td>POPIS CZ/EN</td><td>AKCE</td></tr>';
              while($obj = $ress->fetch_object()){

                  $plus = $obj->display?'-':'+';
                  $command = $obj->display?'remove':'add';
                  $display = $obj->display?'selected':'not';
                  $main = $obj->main?'selected':'not';

                  $html .= '<tr><td>'.$obj->id.'</td><td><img src=\\"/data/projects/'.$obj->filename.'.jpg\\"></td>';
                  $html .= '<td><form method=\\"post\\" act=\\"edit\\" class=\\"adminForm\\" table=\\"data\\" idKey=\\"'.$obj->id.'\\"><input name=\\"popis\\" placeholder=\\"POPIS\\" value=\\"'.$obj->description.'\\" autocomplete=\\"off\\"><input name=\\"popis_en\\" placeholder=\\"DESCRIPTION\\" value=\\"'.$obj->description_en.'\\" autocomplete=\\"off\\"><input type=\\"submit\\" value=\\"ULOŽIT\\"></form></td>';
                  $html .= '<td><span class=\\"toggleKurator '.$display.'\\" data=\\"'.$_POST['id'].'-'.$obj->id.'-'.$command.'\\">[KURÁTOR'.$plus.']</span><a href=\\"/admin/data/main/'.$_POST['id'].'-'.$obj->id.'\\" class=\\"'.$main.'\\">[HLAVNÍ]</a><a href=\\"/admin/data/delete/'.$obj->id.'\\">[×]</a></td></tr>';

              }
              $html .= '</table>';
          }

      break;

      // zarazeni do kategorie kuratora 1
      case 'display':

          if (isset($_POST['id'])) {

            $val = explode('-', $_POST['id']);
            $idPost = $val[0];
            $idData = $val[1];
            switch ($val[2]) {
              case 'add':
                $display = 1;
                $msg = 'ZAŘAZENO DO VÝBĚRU';
                $status = 'added';
              break;
              case 'remove':
                $display = 0;
                $msg = 'VYŘAZENO Z VÝBĚRU';
                $status = 'removed';
              break;
            }

            $sql = 'UPDATE projectdata SET display = "'.$display.'" WHERE id = "'.$idData.'"';
            if ($conn->query($sql)) {
              $html .= '<br><h2>'.$msg.'</h2><br><ul><li><a href=\\"/admin/data/show/'.$idPost.'\\">zpět na seznam nahraných dat</a></li></ul>';
            } else {
              $html .= '<br><h2>CHYBA DATABÁZE</h2>';
            }

          } else {

            $html .= '<br><h2>CHYBÍ ID</h2>';

          }

      break;

      // oznaceni jako hlavni fotka
      case 'main':

          if (isset($_POST['id'])) {

            $val = explode('-', $_POST['id']);
            $idPost = $val[0];
            $idData = $val[1];

            $sqlDethrone = 'UPDATE projectdata SET main = "0" WHERE pid = "'.$idPost.'" AND main = "1"';
            $sqlThrone = 'UPDATE projectdata SET main = "1" WHERE id = "'.$idData.'"';
            if ($conn->query($sqlDethrone) && $conn->query($sqlThrone)) {
              $html .= '<br><h2>ULOŽENO JAKO HLAVNÍ FOTKA</h2><br><ul><li><a href=\\"/admin/data/show/'.$idPost.'\\">zpět na seznam nahraných dat</a></li></ul>';
            } else {
              $html .= '<br><h2>CHYBA DATABÁZE</h2>';
            }

          } else {

            $html .= '<br><h2>CHYBÍ ID</h2>';

          }

      break;

      // zadna z vybranych akci neni setnuta => chyba
      default:

        $html .= '<h1>NESPRÁVNÁ AKCE</h1>';
        $status = 'wrong action';

      break;

    }

  // zadna akce neni setnuta => zobrazi jen menu
  } else {

    $html .= '<ul><li><a href=\\"/admin\\">administrace</a></li><li><a href=\\"/admin/projects\\">projekty</a></li></ul>';
    $status = 'action not set';

  }

// nejede sql
} else {

  $html .= '<h1>ERROR DATABÁZE</h1>';
  $status = 'db error';

}

$html .= '</div>';

// neni admin
} else {

  $html .= '<div class=\\"admin\\"><h1>DATA</h1><br>Nejste přihlášen/a, <a href=\\"/admin\\">přihlásit</a>.</div>';
  $status = 'not logged in';

}


/* JSON */
echo '
{
  "headder": "admin",
  "html": "'.$html.'",
  "status": "'.$status.'",
  "id": "'.$id.'"
}
';
