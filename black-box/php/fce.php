<?php
/*
FUNKCE! OMG!
WOW
LADY GAGA
*/
if (session_status() == PHP_SESSION_NONE) {
  session_start();
}



/*
prepinac jazyku
*/
function lang($cs, $en) {

  // pokud sou oba jazyky vypsane
  if (!empty($cs) && !empty($en)) {

    switch($_SESSION['lang']) {
      default: case 'en':
        return $en;
      break;
      case 'cs':
        return $cs;
      break;
    }

  // pokud je aspon jeden vyplneny, vraci ho
  } else {

    if (empty($cs)) {
      return $en;
    } else if (empty($en)) {
      return $cs;
    } else {
      lang('<i>NEVYPLNĚNO</i>', '<i>UNKNOWN</i>');
    }

  }

}


/*
vraci text misto prazdneho inputu
*/
function test($input, $cs, $en) {
  if (empty($input)) {
    return lang($cs, $en);
  } else {
    return $input;
  }
}



/*
vraci ktere texty obsahuji uvedeny string (vrati oba pokud oba)
*/
function contains($cs, $en, $str) {

  if (!empty($str)) {

    $csRes = strpos($cs, $str);
    $enRes = strpos($en, $str);

    if ($csRes !== false && $enRes !== false) {
      return lang($cs, $en);
    } else if ($csRes !== false) {
      return $cs;
    } else {
      return $en;
    }

  } else {
    return lang($cs, $en);
  }

}



/*
testne v sql ten link a vrati true/false
*/
function sqlLink($link, $conn) {

  $sql = 'SELECT COUNT(*) AS pocet FROM projects WHERE link = "'.$link.'"';
  $ress = $conn->query($sql);
  $obj = $ress->fetch_object();
  if (!$obj->pocet) {
    return true;
  } else {
    return false;
  }

}



/*
prevede text na link
*/
function testForLink($name, $conn) {

  // zakladni prepis
  $najdi = array('ě', 'š', 'č', 'ř', 'ž', 'ý', 'á', 'í', 'é', 'ď', 'ť', 'ň', "'", '"', ' ');
  $vymen = array('e', 's', 'c', 'r', 'z', 'y', 'a', 'i', 'e', 'd', 't', 'n', '',  '',  '-');

  $link = strtolower($name);
  $link = str_replace($najdi, $vymen, $link);
  $link = iconv('UTF-8', 'ISO-8859-1//TRANSLIT//IGNORE', $link);
  $link = preg_replace('/[^A-Za-z0-9\-]/', '', $link);
  $link = preg_replace('/-+/', '-', $link);
  $link .= '-'.date('Y');

  $pass = 0;
  $testLink = $link;

  // cyklus testu
  while (!sqlLink($testLink, $conn)) {

    if ($pass > 0) {
      $testLink = $link.'_'.$pass;
    }

    $pass++;

  }

  return $testLink;

}



/*
generuje random nazev souboru
*/
function randNazev() {
    $rand = false;
    $ch = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for ($i = 0; $i < 8; $i++) {
        $in = rand(0, strlen($ch) - 1);
        $rand .= $ch[$in];
    }
    return $rand;
}



/*
resize img
*/
function resizeImg($file, $dest, $w, $h) {

    list($width, $height) = getimagesize($file);

      $r = $width/$height;

      if ($w/$h > $r) {
          $newwidth = $h*$r;
          $newheight = $h;
      } else {
          $newheight = $w/$r;
          $newwidth = $w;
      }

    // pokud se obrazek nezvetsuje po prepoctu, zmensi ho
    if ($newwidth < $width && $newheight < $height) {

      $src = imagecreatefromjpeg($file);
      $new = imagecreatetruecolor($newwidth, $newheight);
      imagecopyresampled($new, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);

      return imagejpeg($new, $dest);

    // pokud by se zvetsoval, proste ho jen uploadne v soucasnem stavu
    } else {

      return move_uploaded_file($file, $dest);

    }

}



/*
dela input bez znaku co nechci
*/
function repairStr($input) {

  $input = str_replace('"', '&quot;', $input);
  $input = str_replace(array("'", "‘", "’"), '&apos;', $input);
  $input = trim(preg_replace('/\r|\n/', '<br>', $input));

  return $input;

}



/*
dela input z <br> do \n
*/
function editStr($input) {

  $input = str_replace('<br>', '\r\n', $input);
  return $input;

}



/*
www.xy => <a href="www.xy...
*/
function findLinks($input) {

  //return preg_replace('@(http(s)?://)?(([a-zA-Z])([-\w]+\.)+([^\s\.]+[^\s]*)+[^,.\s])@', '<a class="esc" target="_blank" href="http$2://$3">$0</a>', $input);
  //return ereg_replace("[[:alpha:]]+://[^<>[:space:]]+[[:alnum:]/]", '<a href="\\0">\\0</a>', $input);
  $input = preg_replace('/(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,4}(\/\S*)?/', '<a href="$0" target="_blank" class="esc">$0</a>', $input);
  return $input;

}



/*
titulek
*/
function titulek($title, $conn) {

    $path = explode("/", $title);
    $result = lang('ČERNÁ SKŘÍŇKA', 'BLACK BOX');

      // prepinac cesty
      switch($path[1]) {

        default: case 'memex':
          // $result .= ' — MEMEX';
        break;
        case 'prj':
          if ($_SESSION['kurator'] == 'k1') {
            $sql = 'SELECT name FROM projects WHERE link = "'.$path[2].'"';
            $tit = $conn->query($sql);
            $autor = $tit->fetch_object();
            $result .= ' — '.$autor->name;
          } else {
            $result .= ' — '.lang('SKUPINA', 'CLUSTER').' '.$path[2];
          }
        break;
        case 'list':
          $result .= ' — '.lang('DATABÁZE', 'DATABASE');
        break;

      }

    // vrati vysledek
    return $result;

}



/*
vygeneruje og image podle url
*/
function og($conn) {

    $path = explode('/', $_SERVER['REQUEST_URI']);
    if (isset($_SESSION['kurator']) == 'k1' && $path[1] == 'prj') {

      $sql = 'SELECT filename FROM projectdata WHERE pid = (SELECT id FROM projects WHERE link = "'.$path[2].'") ORDER BY main DESC LIMIT 1';
      $res = $conn->query($sql);
      $og = $res->fetch_object();
      $url = '/data/projects/'.$og->filename.'.jpg';

    } else {

      //$url = '/data/og'.rand(1,3).'.png';
      $url = '/data/og.png';

    }

  return $url;

}
