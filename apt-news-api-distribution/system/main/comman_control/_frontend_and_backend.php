<?php
	define('IsAppLive',false);
    if(IsAppLive == true){
        // error_reporting(0);
		error_reporting(E_ERROR);
    }else{
		// error_reporting(0);
		error_reporting(E_ERROR);
        // error_reporting(E_ALL & ~E_NOTICE);
	}
	
	if(!defined('DomainName')){
        $protocol = ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
        define('DomainName',$protocol . $_SERVER['HTTP_HOST'].'/');
    }
    session_start();
    if(!isset($_SESSION['api_session_key'])){
		$_SESSION['api_session_key'] = 'TQnhTcgmFTnTc'.mt_rand(10400, 99997999).'tHAN6IewZt88u';
	}

	require_once($_SERVER['DOCUMENT_ROOT'].'/system/plugin/Apt/Php/Script/EncodeAndEncrypt/AptEncodeAndEncryptWithAes.php');

	define("domain_protocol",  ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://");
	define("domain_name",  $_SERVER['HTTP_HOST']);
	define("site_name", 'News');
	define("site_short_name", 'AptTechSols News');
	define("site_footer_name", 'AptTechSols News');
	define("site_footer_url", 'https://apttechsols.com');
	define("full_domain_name",  'http://'.domain_name);
	define("full_domain_name_secure",  'https://'.domain_name);
	define("current_protocol_domain",  domain_protocol.domain_name);
	define("current_full_url",  current_protocol_domain.$_SERVER['REQUEST_URI']);
	define("current_full_secure_url",  'https://'.domain_name.$_SERVER['REQUEST_URI']);
	define("current_full_insecure_url",  'http://'.domain_name.$_SERVER['REQUEST_URI']);
	define("current_full_exact_url",  explode('?', current_full_url)[0]);
	define("current_support_url",  current_protocol_domain."/contact-us");
	define("db_host",  'localhost');
	define("db_name",  'newsapi');
	define("db_user", 'newsapi');
	define("db_pass",  'st8kT8K8GpnTEZTf');
	define('EPASS','UwRHu5F9pRw9y3IZpLD8TImqTwRx56mN');
	define("api_public_key",  'FmnD8TImqTwR8P2TTQnhaBHTcL1pyx');
	define("api_session_key",  isset($_SESSION['api_session_key']) ? $_SESSION['api_session_key'] : 'TQnhTTc'.mt_rand(10400, 99997999).'tHAN6IewZt88u');
	define("api_tmp_key",  'SRHGEh2uZpLD1g8qTVTHATIIm888TIm88D');
	define("api_private_key",  'NLMF9pRSRHGEh2g8qTVGpaJjE2uuS');
	define("vip_key",  'NLMF9hYtEvh2gdsd78jJjE2uuS');
	date_default_timezone_set('UTC');
	define("current_time",  time());
	define("current_date",  date('Y-m-d'));
	define("current_date_time",  date('Y-m-d H:i:s'));
	define("utc_date",  gmdate('Y-m-d'));
	define("utc_date_time",  gmdate('Y-m-d H:i:s'));
	define("info_email_id",  'contact@apttechsols.com');
	define("info_phone",  '+91 9166363325');
	define("info_phone_second",  '+1 (647) 430-0860');
	define("proxy_username",  'mm360');
	define("proxy_password",  'jieHwSwJaVYB3sIa');
	define("proxy_address",  'proxy.packetstream.io');
	define("proxy_port",  '31112');
	define("email_received",  'contact@apttechsols.com');
    define("smtp_email",  'contact@apttechsols.com');
    define("smtp_host",  'smtp.gmail.com');
    define("smtp_auth",  true);
    define("smtp_username",  'bootesoft@gmail.com');
    define("smtp_password",  'gccpdbnudroziyvz');
    define("smtp_secure",  'tls');
    define("smtp_port",  587);
    
    define("our_rates", ['website-traffic'=>0.0022,'product-and-brand-consideration'=>1,'brand-awareness-and-reach'=>0.0015,'app-promotion'=>0.142,'promote-on-twitter'=>1,'promote-youtube-video'=>0.025]);
    
    define("allowed_coupon", ['foorke'=>['1'=>['discount'=>10,'max_discount'=>-1],'10'=>['discount'=>20,'max_discount'=>-1],'100'=>['discount'=>25,'max_discount'=>-1],'1000'=>['discount'=>27,'max_discount'=>-1],'10000'=>['discount'=>29,'max_discount'=>-1],'50000'=>['discount'=>31,'max_discount'=>-1]]]);
    
	$user_token = isset($_COOKIE['token']) ? $_COOKIE['token'] : null;
	if(strlen($user_token) > 0){
		$user_token = AptEncodeAndEncryptWithAes::AptEncodeAndEncryptWithAesRun(['Task'=>'decrypt' ,'data'=>$user_token, 'key'=>EPASS,'padding'=>false])['msg'];
	}else{
		$user_token = null;
	}
	define('user_token',$user_token);
	
	
	if(!defined('is_api')){
	    define("is_api",  false);
	}

// 	if(IsAppLive == true){
// 		define('https_required',true);
// 	}else{
// 		define('https_required',false);
// 	}

// 	if(is_api != true){
//  		if(!defined('https_required')){
//  		    define('https_required',true);
//  		}
// 	}
	
// 	if(!defined('https_required')){
// 	    define('https_required',false);
// 	}
	
// 	if(!defined('http_required')){
// 	    define('http_required',false);
// 	}
	
// 	if(https_required == true){
// 	    if(domain_protocol != 'https://'){
// 		    header("Location:".current_full_secure_url); exit();
// 		}
// 	}else if(http_required == true){
// 	    if(domain_protocol != 'http://'){
// 		    header("Location:".current_full_insecure_url); exit();
// 		}
// 	}

	if(!defined('IsLoginCheck')){
	    define('IsLoginCheck',true);
	}
	
    if (IsLoginCheck == true){
		$cURLConnection = curl_init(current_protocol_domain.'/api/authentication/check_login_with_token/index.php?token='.user_token);
		curl_setopt($cURLConnection, CURLOPT_RETURNTRANSFER, true);
		
		$apiResponse = curl_exec($cURLConnection);
		$apiResponse_error = curl_errno($cURLConnection);
		curl_close($cURLConnection);
		
		// $apiResponse - available data from the API request
		$IsLogin = json_decode($apiResponse);
		
		if($IsLogin->status == true){
		    if(!defined('is_login_status')){define('is_login_status',true);}
		}else if(isset($IsLogin->user_status) and  $IsLogin->user_status == 'account_activation'){
		    if(!defined('is_login_status')){define('is_login_status',true);}
		}
	}
    
	if(!defined('is_login_status')){define('is_login_status',false);}
	
	if(!defined('page_id')){
	    define('page_id',null);
	}
?>
