<?php
	define('is_api',true);
	require($_SERVER['DOCUMENT_ROOT'].'/system/main/comman_control/_backend.php');

	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: POST');
	header('Content-Type: application/json');
	header('Access-Control-Allow-Headers:Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

	try{
		require($_SERVER['DOCUMENT_ROOT'].'/system/config/database/index.php');
		require($_SERVER['DOCUMENT_ROOT'].'/system/plugin/Apt/Php/Pdo/fetch.php');
		require($_SERVER['DOCUMENT_ROOT'].'/system/plugin/Apt/Php/Pdo/insert.php');
		require($_SERVER['DOCUMENT_ROOT'].'/system/plugin/Apt/Php/Pdo/delete.php');
		require_once($_SERVER['DOCUMENT_ROOT'].'/system/plugin/Apt/Php/Script/PhpMailer/class.phpmailer.php');
        require_once($_SERVER['DOCUMENT_ROOT'].'/system/plugin/Apt/Php/Script/PhpMailer/PHPMailerAutoload.php');

		function rand_string( $length ) {  
			$RandStr = "";
			$chars = "abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz";
			$size = strlen( $chars ); 
			for( $i = 0; $i < $length; $i++ ) {  
			$RandStr = $RandStr . "" . $chars[ rand( 0, $size - 1 ) ];   
			} 
			return $RandStr;
		}
		function rand_num( $length ) {  
			$RandStr = "";
			$chars = "1234567890";
			$size = strlen( $chars ); 
			for( $i = 0; $i < $length; $i++ ) {  
			$RandStr = $RandStr . "" . $chars[ rand( 0, $size - 1 ) ];   
			} 
			return $RandStr;
		}
		
		function Parse ($url) {
            $fileContents= file_get_contents($url);
            $fileContents = str_replace(array("\n", "\r", "\t"), '', $fileContents);
            $fileContents = trim(str_replace('"', "'", $fileContents));
            $simpleXml = simplexml_load_string($fileContents);
            
    
            return $simpleXml;
        }

		if ($_SERVER['REQUEST_METHOD'] != 'POST') {
			echo json_encode(['status'=>false,'data'=>'Only POST request method accepted','code'=>400,'etype'=>'client']);
			die(); exit();
		}

		class Signup{

			public function __construct($data = array()){
				$this->IsError = false;
				$this->response = ['status'=>false,'data'=>null,'code'=>400,'eversion'=>'e.0.0','etype'=>'client'];
				
				if($this->IsError == false){
					if(array_key_exists("token",$data)){
						if(preg_match('/[a-z0-9_]/', $data['token']) and strlen($data['token']) > 0){
							$this->token = $data['token'];
						}else{
							$this->IsError = true;
							$this->response = ['status'=>false,'data'=>'You are not logged in','code'=>400,'EVersion'=>'E.1.06'];
						}
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'You are not logged in','code'=>400,'EVersion'=>'E.2.0'];
					}
				}
				
				if($this->IsError == false){
					$data['debug'] = false;
    				$data['token'] = $this->token;
               		
                    $cURLConnection = curl_init(current_protocol_domain.'/api/authentication/check_login_with_token/index.php');
                    curl_setopt($cURLConnection, CURLOPT_POSTFIELDS, $data);
                    curl_setopt($cURLConnection, CURLOPT_RETURNTRANSFER, true);
                
                    $apiResponse = curl_exec($cURLConnection);
                    curl_close($cURLConnection);
                
                    // $apiResponse - available data from the API request
                    $jsonArrayResponse = json_decode($apiResponse);
                    if($jsonArrayResponse->status != true){
                        $this->IsError = true;
    				    $this->response = ['status'=>false,'data'=>'You are not logged in','code'=>400,'EVersion'=>'E.1.01'];
    				}
				}
				
				
				if($this->IsError == false){
					if(array_key_exists("language",$data)){
						if(strlen($data['language']) > 0){
							$this->language = $data['language'];
						}else{
							$this->IsError = true;
							$this->response = ['status'=>false,'data'=>'Language is missing','code'=>400,'EVersion'=>'E.1.06'];
						}
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'Language is missing','code'=>400,'EVersion'=>'E.2.0'];
					}
				}
				
				if($this->IsError == false){
					if(array_key_exists("category",$data)){
						if(strlen($data['category']) > 0){
							$this->category = $data['category'];
						}else{
							$this->IsError = true;
							$this->response = ['status'=>false,'data'=>'category is missing','code'=>400,'EVersion'=>'E.1.06'];
						}
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'category is missing','code'=>400,'EVersion'=>'E.2.0'];
					}
				}
				
				if($this->IsError == false){
					if(array_key_exists("country",$data)){
						if(strlen($data['country']) > 0){
							$this->country = $data['country'];
							if($this->country == "all"){
							    $this->country = null;    
							}
						}else{
							$this->IsError = true;
							$this->response = ['status'=>false,'data'=>'Country is missing','code'=>400,'EVersion'=>'E.1.06'];
						}
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'Country is missing','code'=>400,'EVersion'=>'E.2.0'];
					}
				}
				
				if($this->IsError == false){
					if(array_key_exists("source_url",$data)){
						if(strlen($data['source_url']) > 0){
							$this->source_url = $data['source_url'];
						}else{
							$this->IsError = true;
							$this->response = ['status'=>false,'data'=>'Source url is missing','code'=>400,'EVersion'=>'E.1.06'];
						}
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'Source url is missing','code'=>400,'EVersion'=>'E.2.0'];
					}
				}

			}
			public function DoSignup(){
				$this->ctime = current_time;
				$this->c_date_time = current_date_time;

				if($this->IsError == false){
					$SystemDbConn = new system_db_conn(['host'=>db_host,'name'=>db_name,'user'=>db_user,'pass'=>db_pass]);
					$SystemDbConn = $SystemDbConn->get_conn();
					if($SystemDbConn['status'] != true){
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'Something went wrong','code'=>400,'EVersion'=>'E.1.06'];
					}else{
						$SystemDbConn = $SystemDbConn['data'];
					}
				}
				
				if($this->IsError == false){
				    $query = "SELECT source_url FROM news_sources WHERE source_url = :source_url ";
                        
                    $stmt = $SystemDbConn->prepare($query);
                    $stmt->bindParam(":source_url",$this->source_url,PDO::PARAM_STR);
                    
                    if($stmt->execute()){
                        if($stmt->rowCount() > 0){
                            $this->IsError = true;
						    $this->response = ['status'=>false,'data'=>'Source url already exist',"code"=>400,'EVersion'=>'E.1.2031'];
                        }
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'Something went wrong',"code"=>400,'EVersion'=>'E.1.2031'];
					}
				}
				
				if($this->IsError == false){
                    
                    $query = "INSERT INTO news_sources (uid,category,language_code,country_code,source_url,rdate,udate) VALUES (:uid_$key,:category_$key,:language_code_$key,:country_code_$key,:source_url_$key,:rdate_$key,:udate_$key) ON DUPLICATE KEY UPDATE ucount = ucount + 1 ";
                    
                    $stmt = $SystemDbConn->prepare($query);
                    
                    $this->uid = 'sources_'.rand_string(3).time().rand_string(3);
                    $stmt->bindParam(":uid_$k",$this->uid,PDO::PARAM_STR);
                    
                    $stmt->bindParam(":category_$k",$this->category,PDO::PARAM_STR);
                    
                    $stmt->bindParam(":language_code_$k",$this->language,PDO::PARAM_STR);
                    
                    $stmt->bindParam(":country_code_$k",$this->country,PDO::PARAM_STR);
                    
                    $stmt->bindParam(":source_url_$k",$this->source_url,PDO::PARAM_STR);
                    
                    $stmt->bindParam(":rdate_$k",$this->c_date_time,PDO::PARAM_STR);
                    
                    $stmt->bindParam(":udate_$k",$this->c_date_time,PDO::PARAM_STR);
                    
					if($stmt->execute()){
					    if($stmt->rowCount() > 0){
					        $this->IsError = false;
					        $this->response = ['status'=>true,'data'=>"Sources add successfully",'code'=>200];    
					    }else{
					        $this->IsError = true;
						    $this->response = ['status'=>false,'data'=>'Something went wrong',"code"=>400,'EVersion'=>'E.1.203'];   
					    }
					    
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>"Something went wrong","code"=>400,'EVersion'=>'E.1.203'];
					}
					
                } 

				return $this->response;
			}
		}
		
		$obj = new Signup($_POST);
		$response = $obj->DoSignup();
		echo json_encode($response);
	}catch(Exception $e){
		echo json_encode(['status'=>false,'data'=>'Something went wrong','code'=>400,'etype'=>'exception']); die(); exit();
	}
?>


