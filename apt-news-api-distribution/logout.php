<?php
//   if ($_SERVER['REQUEST_METHOD'] == 'GET') {
//     require_once($_SERVER['DOCUMENT_ROOT']."/system/main/comman_control/_frontend.php");
//     setcookie( 'token', '', time()-100, '/', false, false, true);
//     if(!isset($_COOKIE['token']) or strlen($_COOKIE['token']) < 1){
//       header("Location: ".current_protocol_domain);
//     }else{

//       // $apiResponse - available data from the API request
//       $jsonArrayResponse = json_decode($apiResponse);
//       if($jsonArrayResponse->status == true){
//         setcookie( 'token', '', time()-100, '/', false, false, true);
//         header("Location: ".current_protocol_domain."/manage/view/client/dashboard/login.php");
//       }else{
//       header("Location: ".current_protocol_domain."/manage/view/client/dashboard/index.php?status=error&time=".time()."&type=logout&msg=Logout : somthing went wrong");
//       }
//     }
//   }
?>