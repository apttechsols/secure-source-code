<?php
session_start();



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
set vars
*/
$html = '';



/*
html
*/
$html .= '<div id=\\"list\\"><div id=\\"seznam\\" class=\\"grabber\\"><table><tr class=\\"search\\"><td><input class=\\"searchList searchAuthor\\" type=\\"text\\" id=\\"filterName\\" placeholder=\\"'.lang('JMÉNO', 'NAME').'\\" autocomplete=\\"off\\"></td><td><input class=\\"searchList searchDescrip\\" type=\\"text\\" id=\\"filterMaterial\\" placeholder=\\"'.lang('MATERIÁL', 'MATERIAL').'\\" autocomplete=\\"off\\"></td></tr>';
$html .= '</table></div></div>';



/*
json output
*/
echo '
{
  "headder": "list",
  "html": "'.$html.'"
}
';
