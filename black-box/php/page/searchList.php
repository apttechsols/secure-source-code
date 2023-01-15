<?php
session_start();
if (isset($_POST['autor']) && isset($_POST['descrip'])) {



/*
DB SETUP
*/
include '../sql.php';
$conn = sql();



/*
FUNKCE
*/
include '../fce.php';



/*
vars
*/
$data = array();
$where = array();
$sqlWhere = '';




/*
stavba WHERE selektoru pro sql
*/
if (isset($_POST['autor']) && !empty($_POST['autor'])) {
  $autor = repairStr($_POST['autor']);
  array_push($where, 'pid IN (SELECT id FROM projects WHERE name LIKE "%'.$autor.'%")');
}
if (isset($_POST['descrip']) && !empty($_POST['descrip'])) {
  $popis = repairStr($_POST['descrip']);
  array_push($where, '(description LIKE "%'.$popis.'%" OR description_en LIKE "%'.$popis.'%")');
}
if ($_SESSION['kurator'] == 'k1') {
  array_push($where, 'display = 1');
}



/*
setne WHERE do SQL pokud nejake jsou
*/
if (sizeof($where) > 0)  {
  $sqlWhere = ' AND '.join(' AND ', $where);
}



/*
vygeneruje json seznam
*/
$imgs = 'SELECT filename, description, description_en, (SELECT name FROM projects WHERE id = projectdata.pid) AS autor FROM projectdata WHERE (SELECT active FROM projects WHERE id = projectdata.pid) = 1'.$sqlWhere.' ORDER BY RAND()';
$img = $conn->query($imgs);
  while($tr = $img->fetch_object()){

    array_push($data, '{"img": "/data/projects/'.$tr->filename.'.jpg", "autor": "'.$tr->autor.'", "descrip": "'.contains($tr->description, $tr->description_en, $_POST['descrip']).'"}');

  }



/*
json output
*/
echo '
{
  "headder": "searchlist",
  "results": ['.join(',', $data).']
}
';



}
