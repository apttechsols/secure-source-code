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

$html = '<div class=\\"admin\\"><h1>KURÁTOR AI</h1><br>';
$html .= '<ul><li><a href=\\"/admin\\">administrace</a></li></ul><br>';



/*
main funkce
*/
if ($conn) {

  // pokud je setnuta akce
  if (isset($_POST['action'])) {

    // jaka akce je setnuta
    switch ($_POST['action']) {

      // smaze cluster z db
      case 'delete':

          if (isset($_POST['id'])) {

            // sejde z databaze
            $sql = 'DELETE FROM clusters WHERE id = '.$_POST['id'];
            if ($conn->query($sql)) {

                $html .= '<br><h2>SMAZÁNO</h2><br><ul><li><a href=\\"/admin/clusters\\">zpět na seznam verzí kurátora</a></li></ul>';

            } else {
              $html .= '<br><h2>CHYBA DATABÁZE, NESMAZÁNO</h2>';
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

    // formular pro vygenerovani noveho setu clusteru
    $html .= '<h2>VYGENEROVAT NOVOU VERZI AI KURÁTORA</h2>';
    $html .= '<br><ul>';
    $html .= '<li>ke spuštění je nutno napsat \\"<strong>POTVRZUJI</strong>\\" do textového pole</li>';
    $html .= '<li>po dobu generování je <strong>NUTNO ZŮSTAT NA TÉTO STRÁNCE</strong></li>';
    $html .= '<li>generování nové mapy clusterů může trvat <strong>až 20 minut</strong></li>';
    $html .= '</ul><br>';
    $html .= '<form method=\\"post\\" act=\\"add\\" class=\\"clusterForm\\" table=\\"clusters\\"><input name=\\"pojistka\\" placeholder=\\"POTVRZUJI\\" autocomplete=\\"off\\"><input type=\\"submit\\" value=\\"SPUSTIT GENERÁTOR\\"></form>';
    $html .= '<div id=\\"clusterLoading\\"></div>';

    // zobrazi se historie vygenerovanych clusteru
    $sql = 'SELECT * FROM clusters ORDER BY id DESC';
    if ($ress = $conn->query($sql)) {

        $html .= '<br><table class=\\"adminTable\\"><tr><td>ID</td><td>DATUM</td><td>POČET</td><td>AKCE</td></tr>';
        while($obj = $ress->fetch_object()){

            $size = substr_count($obj->clusters, ",")+substr_count($obj->clusters, "|");

            $html .= '<tr><td>'.$obj->id.'</td><td>'.$obj->datum.'</td>';
            $html .= '<td>'.$size.'</td>';
            $html .= '<td><a href=\\"/admin/clusters/delete/'.$obj->id.'\\">[×]</a></td></tr>';

        }
        $html .= '</table>';

    }

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
  "status": "'.$status.'"
}
';
