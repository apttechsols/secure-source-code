<?php

print_r($_POST);
print_r($_FILES);

/*
session_start();

function resize_image($file, $meno, $w, $h, $crop = false) {
    list($width, $height) = getimagesize($file);
    $r = $width / $height;
    if ($crop) {
        if ($width > $height) {
            $width = ceil($width-($width*abs($r-$w/$h)));
        } else {
            $height = ceil($height-($height*abs($r-$w/$h)));
        }
        $newwidth = $w;
        $newheight = $h;
    } else {
        if ($w/$h > $r) {
            $newwidth = $h*$r;
            $newheight = $h;
        } else {
            $newheight = $w/$r;
            $newwidth = $w;
        }
    }
    $src = imagecreatefromjpeg($file);
    $dst = imagecreatetruecolor($newwidth, $newheight);
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
    return imagejpeg($dst, $meno);
}

function rand_nazev() {
    $rand = false;
    $ch = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for ($i = 0; $i < 8; $i++) {
        $in = rand(0, strlen($ch) - 1);
        $rand .= $ch[$in];
    }
    return $rand;
}


print_r($_FILES['files']);
$ext = strtolower(pathinfo($_FILES['files']['name'], PATHINFO_EXTENSION));

switch ($ext) {

  // defaultne koncovky odmitne
  default:
    $result = 'invalid';
  break;

  // bere jen .jpg
  case 'jpg': case 'jpeg':

    $new_name = false;
    while (file_exists('../../data/projects/'.$new_name.'.jpg') || !$new_name) {
      $new_name = rand_nazev();
    }

    $img_s = resize_image($_FILES['thumb_input']['tmp_name'], '../../data/projects/s/'.$new_name.'.jpg', 800, 800);
    $img = resize_image($_FILES['thumb_input']['tmp_name'], '../../data/projects/'.$new_name.'.jpg', 2048, 2048);

    if ($img_s && $img) {

      // pridej do db
      $result = 'yaaas';

    } else {
      $result = 'error';
    }

  break;
}

echo $result;
