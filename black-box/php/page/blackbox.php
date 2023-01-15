<?php
session_start();
if (isset($_POST['prjId'])) {



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
promenne
*/
$imgpreload = array();
$vyobrazeni = '';
$keywords = '';
$orderby = '';
$imgset = '';
$html = '';



/*
podle toho jaky je kurator, takovy vypise vysledek
*/
if (isset($_SESSION['kurator'])) {

  // kdyby nekdo prisel na kuratora1 z linku v kuratorovi2 => aby nemenil session, jen vypis
  $kurator = $_SESSION['kurator'];
  if (!is_numeric($_POST['prjId'])) {
    $kurator = 'k1';
  }

  switch ($kurator) {

    case 'k1':

    /*
    vypis vsech postu z projektu
    */
    $sql = 'SELECT id, name, info, info_en, keywords, keywords_en, link FROM projects WHERE link = "'.$_POST['prjId'].'" AND active = 1';
    if ($ress = $conn->query($sql)) {
        $prj = $ress->fetch_object();

          // obrazky a vyobrazeni
          $post = 1;
          $imgs = 'SELECT filename, description, description_en FROM projectdata WHERE pid = "'.$prj->id.'" AND display = "1" ORDER BY main DESC, RAND()';
          $img = $conn->query($imgs);
            while($thumb = $img->fetch_object()){

              // nachysta div
              $pic = '<div class=\\"post moveable'.(($post == 1)?' large\\" style=\\"z-index: 4;':'').'\\" id=\\"post'.$post.'\\"><img src=\\"/data/projects/'.$thumb->filename.'.jpg\\"><div class=\\"num\\">'.$post.'.</div><div class=\\"bigPost\\"></div></div>';

              // schova prvni fotku na konec, zbytek nacpe do html
              if ($post == 1) {
                $mainPic = $pic;
              } else {
                $html .= $pic;
              }

              // vygeneruje vyobrazeni do seznamu
              $vyobrazeni .= '<li>'.$post.'. '.test(lang($thumb->description, $thumb->description_en), 'IMG', 'IMG').' <span class=\\"locate\\" post=\\"'.$post.'\\"></span></li>';
              array_push($imgpreload, '"/data/projects/'.$thumb->filename.'.jpg"');
              $post++;

            }

          // klicove slova
          if (!empty($prj->keywords) || !empty($prj->keywords_en)) {
            //$keywords = '<p>['.preg_replace('/\s*,\s*/', '], [', lang($prj->keywords, $prj->keywords_en)).']</p>';
            $keywords = '<p>'.lang('KLÍČOVÉ SLOVA', 'KEYWORDS').'<br>'.lang($prj->keywords, $prj->keywords_en).'</p>';
          }

          // pricpe do html seznam vyobrazeni a info o projektu
          $html .= '<div style=\\"z-index: 2;\\" class=\\"post moveable info\\" id=\\"vyobrazeni\\"><div class=\\"title\\"><div class=\\"name\\">'.lang('SEZNAM VYOBRAZENÍ', 'LIST OF FIGURES').'</div><div class=\\"moreInfo\\"></div></div><div class=\\"content\\">'.$vyobrazeni.'</div></div>';
          $html .= '<div style=\\"z-index: 3;\\" class=\\"post moveable info\\" id=\\"info\\"><div class=\\"title\\"><div class=\\"name\\">'.$prj->name.'</div><div class=\\"moreInfo\\"></div></div><div class=\\"content\\">'.str_replace('"', '\"', findLinks(lang($prj->info, $prj->info_en))).$keywords.'</div></div>';

          $html .= $mainPic;

    }

    break;

    case 'k2':

    /*
    vypis vsech postu z clusteru
    */
    $sql = 'SELECT clusters FROM clusters ORDER BY id DESC LIMIT 1';
    if ($ress = $conn->query($sql)) {

        // vysledky
        $clusters = $ress->fetch_object();

        // rozdeli do pole po obrazcich
        $cluster = explode('|', $clusters->clusters);

        if (isset($_POST['firstImg'])) {
          $orderby = 'id='.$_POST['firstImg'].' DESC, ';
        }

        $imgs = 'SELECT filename, description, description_en, (SELECT name FROM projects WHERE id = projectdata.pid) AS autor, (SELECT link FROM projects WHERE id = projectdata.pid) AS link FROM projectdata WHERE id IN ('.$cluster[$_POST['prjId']].') ORDER BY '.$orderby.'RAND()';

        $post = 1;
        $keywords = array();
        if ($ress = $conn->query($imgs)) {
          while($thumb = $ress->fetch_object()){

            $popis = test(lang($thumb->description, $thumb->description_en), 'IMG', 'IMG');

            $html .= '<div class=\\"post moveable'.(($post == 1)?' large\\" style=\\"z-index: 4;':'').'\\" id=\\"post'.$post.'\\"><img src=\\"/data/projects/'.$thumb->filename.'.jpg\\"><div class=\\"num\\">'.$post.'.</div><div class=\\"bigPost\\"></div></div>';
            $vyobrazeni .= '<li>'.$post.'. '.$popis.' → <a href=\\"/prj/'.$thumb->link.'\\">'.$thumb->autor.'</a> <span class=\\"locate\\" post=\\"'.$post.'\\"></span></li>';

          array_push($keywords, $popis);
          array_push($imgpreload, '"/data/projects/'.$thumb->filename.'.jpg"');
          $post++;

          }
        }

        $html .= '<div style=\\"z-index: 2;\\" class=\\"post moveable info wider\\" id=\\"vyobrazeni\\"><div class=\\"title\\"><div class=\\"name\\">'.lang('SEZNAM VYOBRAZENÍ', 'LIST OF FIGURES').'</div><div class=\\"moreInfo\\"></div></div><div class=\\"content\\">'.$vyobrazeni.'</div></div>';
        $html .= '<div style=\\"z-index: 3;\\" class=\\"post moveable info\\" id=\\"info\\"><div class=\\"title\\"><div class=\\"name\\">'.lang('SKUPINA', 'CLUSTER').' #'.$_POST['prjId'].'</div><div class=\\"moreInfo\\"></div></div><div class=\\"content\\">'.implode(', ', $keywords).'</div></div>';

    }

    break;

  }

}



/*
output json
*/
echo '
{
  "headder": "blackbox",
  "html": "<div id=\\"blackbox\\">'.$html.'</div>",
  "imgs": ['.join(',', $imgpreload).']
}
';



}
