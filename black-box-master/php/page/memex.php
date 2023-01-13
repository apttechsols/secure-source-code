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



// zakladni promenne
$imgpreload = array();
$imgset = '';
$html = '';



/*
podle toho jaky je kurator, takovy vypise vysledek
*/
if (isset($_SESSION['kurator'])) {

  switch ($_SESSION['kurator']) {

    /*
    kurator 1 => defaultni
    */
    case 'k1':

        // vypise vsecky projekty kuratora 1
        $sql = 'SELECT id, name, '.lang('keywords', 'keywords_en').' AS keywords, link, (SELECT filename FROM projectdata WHERE pid = projects.id AND main = 1) AS mainpic FROM projects WHERE active = "1"';
        if ($ress = $conn->query($sql)) {
            while($prj = $ress->fetch_object()){

              // hlavni fotka
              $imgset = '<img src=\\"/data/projects/'.$prj->mainpic.'.jpg\\" class=\\"mainPic\\">';
              array_push($imgpreload, '"/data/projects/'.$prj->mainpic.'.jpg"');

              // obrazky
              $imgs = 'SELECT filename FROM projectdata WHERE pid = "'.$prj->id.'" AND display = "1" AND filename <> "'.$prj->mainpic.'" ORDER BY RAND() LIMIT 2';
              $img = $conn->query($imgs);
                while($thumb = $img->fetch_object()){
                  $imgset .= '<img src=\\"/data/projects/'.$thumb->filename.'.jpg\\" class=\\"sidekick\\">';
                  array_push($imgpreload, '"/data/projects/'.$thumb->filename.'.jpg"');
                }

              // nacpe do html
              $html .= '<div class=\\"prj\\" tags=\\"'.preg_replace('/\s*,\s*/', ',', $prj->keywords).'\\" id=\\"prj'.$prj->link.'\\">'.$imgset.'<div class=\\"title\\"><a href=\\"/prj/'.$prj->link.'\\">'.$prj->name.'</a></div></div>';

            }
        }

    break;

    /*
    kurator 2 => AI
    */
    case 'k2':

      // vypise vsecky projekty kuratora 1
      $sql = 'SELECT clusters FROM clusters ORDER BY id DESC LIMIT 1';
      if ($ress = $conn->query($sql)) {

        // vysledky
        $clusters = $ress->fetch_object();

        // rozdeli do pole po obrazcich
        $cluster = explode('|', $clusters->clusters);

        // projede po clusteru
        for ($i = 0; $i < sizeof($cluster); $i++) {

          // tagy
          $desc = array();
          $imgset = '';

          // vybere 3 fotky nahodne a da je do projektu
          $prj = 'SELECT id, filename FROM projectdata WHERE id IN ('.$cluster[$i].') ORDER BY RAND() LIMIT 3';

          $pos = 1;
          if ($ress = $conn->query($prj)) {
            while($thumb = $ress->fetch_object()){

                // fotky co tam budou videt
                $class = ($pos == 1)?'mainPic':'sidekick';
                $imgset .= '<img src=\\"/data/projects/'.$thumb->filename.'.jpg\\" class=\\"'.$class.'\\" imgid=\\"'.$thumb->id.'\\">';
                array_push($imgpreload, '"/data/projects/'.$thumb->filename.'.jpg"');

                $pos++;

            }
          }

          // zapise vsechny distinct(descriptions) fotek
          $tags = 'SELECT DISTINCT '.lang('description', 'description_en').' AS description FROM projectdata WHERE id IN ('.$cluster[$i].')';
          if ($ress = $conn->query($tags)) {
            while($tag = $ress->fetch_object()){

                // description pro spojnice
                if (!in_array($tag->description, $desc)) {
                  array_push($desc, $tag->description);
                }

            }
          }

          // nacpe do html
          $html .= '<div class=\\"prj\\" tags=\\"'.implode(',', $desc).'\\" id=\\"prj'.$i.'\\">'.$imgset.'<div class=\\"title\\"><a href=\\"/prj/'.$i.'\\">'.lang('SKUPINA', 'CLUSTER').' #'.$i.'</a></div></div>';

        }

      }

    break;


  }

}



// OUTPUT json
echo '
{
  "headder": "memex",
  "html": "'.$html.'",
  "imgs": ['.join(',', $imgpreload).']
}
';
