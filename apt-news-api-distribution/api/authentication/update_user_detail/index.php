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
		require($_SERVER['DOCUMENT_ROOT'].'/system/plugin/Apt/Php/Pdo/update.php');
		require($_SERVER['DOCUMENT_ROOT'].'/system/plugin/Apt/Php/Pdo/insert.php');

		if($is_api_error != false){
			if($api_error_type == 'EPASS'){
				echo json_encode(['status'=>false,'data'=>'Something went wrong','code'=>400,'etype'=>'internal1']); die(); exit();
			}else{
				echo json_encode(['status'=>false,'data'=>'Something went wrong','code'=>400,'etype'=>'internal2']); die(); exit();
			}
		}
					

		/*if($_SERVER['HTTP_ORIGIN'] != full_domain_name_secure and $_SERVER['HTTP_ORIGIN'] != full_domain_name_secure){
			$IsError = true;
			$ErrorReason = ['status'=>false,'data'=>'CORS policy volilation detect','code'=>400,'etype'=>'client'];
			echo json_encode($ErrorReason);
			die(); exit();
		}*/

		if ($_SERVER['REQUEST_METHOD'] != 'POST' and $_SERVER['REQUEST_METHOD'] != 'GET') {
			echo json_encode(['status'=>false,'data'=>'Only POST, GET request method accepted','code'=>400,'etype'=>'client']);
			die(); exit();
		}
		
		function rand_string( $length ) {  
			$RandStr = "";
			$chars = "abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz";
			$size = strlen( $chars ); 
			for( $i = 0; $i < $length; $i++ ) {  
			$RandStr = $RandStr . "" . $chars[ rand( 0, $size - 1 ) ];   
			} 
            return $RandStr;
        }
		
		function validateDate($date, $format = 'Y-m-d'){
            $d = DateTime::createFromFormat($format, $date);
            return $d && $d->format($format) === $date;
        }

		class AccountVerfication{

			public function __construct($data = array()){
				$this->IsError = false;
				$this->response = ['status'=>false,'data'=>null,'code'=>400,'eversion'=>'e.0.0','etype'=>'client'];
				
				if($this->IsError == false){
					if(array_key_exists("token",$data)){
						if(preg_match('/[a-z0-9_]$/', $data['token']) and strlen($data['token']) > 0){
							$this->token = $data['token'];
						}else{
							$this->IsError = true;
							$this->response = ['status'=>false,'data'=>'Invalid token','code'=>400,'EVersion'=>'E.1.06'];
						}
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'token is missing','code'=>400,'EVersion'=>'E.2.0'];
					}
				}
				
				if($this->IsError == false && strlen($this->token)>0 ){
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
    				}else{
    				    $this->user_id = $jsonArrayResponse->data->user_id;  
    				    
    				}
				}
				
				if($this->IsError == false){
					if(array_key_exists("fname",$data)){
						if(strlen($data['fname']) > 0){
							$this->fname = htmlspecialchars(strip_tags($data['fname']));
						}else{
							$this->fname = "";
						}
					}else{
						$this->fname = "";
					}
				}
				
				if($this->IsError == false){
					if(array_key_exists("lname",$data)){
						if(strlen($data['lname']) > 0){
							$this->lname = htmlspecialchars(strip_tags($data['lname']));
						}else{
							$this->lname = ".";
						}
					}else{
						$this->lname = ".";
					}
				}
				
				if($this->IsError == false){
					if(array_key_exists("gender",$data)){
						if(strlen($data['gender']) > 0){
							$this->gender = htmlspecialchars(strip_tags($data['gender']));
						}else{
							$this->gender = "";
						}
					}else{
						$this->gender = "";
					}
				}
				
				if($this->IsError == false){
					if(array_key_exists("dob",$data)){
						if(strlen($data['dob']) > 0){
							$this->dob = htmlspecialchars(strip_tags($data['dob']));
							$valide_date = validateDate($this->dob);
							if($valide_date!=true){
							    $this->IsError = true;
						        $this->response = ['status'=>false,'data'=>'Invalid dob','code'=>400,'EVersion'=>'E.2.0'];
							}
						}else{
							$this->dob = "";
						}
					}else{
						$this->dob = "";
					}
				}
				
				if($this->IsError == false){
					if(array_key_exists("language_code",$data)){
						if(strlen($data['language_code']) > 0){
							$this->language_code = htmlspecialchars(strip_tags($data['language_code']));
						}else{
							$this->language_code = "";
						}
					}else{
						$this->language_code = "";
					}
				}
				
				if($this->IsError == false){
					if(array_key_exists("country",$data)){
						if(strlen($data['country']) > 0){
							$this->country = htmlspecialchars(strip_tags($data['country']));
						}else{
							$this->country = "";
						}
					}else{
						$this->country = "";
					}
				}
				

			}
			
			public function DoAccountVerfication(){
				$this->ctime = current_time;
				
				if($this->IsError == false){
					$SystemDbConn = new system_db_conn(['host'=>db_host,'name'=>db_name,'user'=>db_user,'pass'=>db_pass]);
					$SystemDbConn = $SystemDbConn->get_conn();
					if($SystemDbConn['status'] != true){
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'Something went wrong','code'=>400,'EVersion'=>'E.1.05'];
					}else{
						$SystemDbConn = $SystemDbConn['data'];
					}
				}
				
				
				
				if($this->IsError == false){
				    $update_values = "";
				    if(strlen($this->fname) > 0 ){
				        $update_values .= "first_name::::$this->fname";    
				    }
				    if(strlen($this->lname) > 0 ){
				        $update_values .= "::,::last_name::::$this->lname";    
				    }
				    if(strlen($this->language_code) > 0 ){
				        $update_values .= "::,::language::::$this->language_code";    
				    }
				    if( strlen($this->country) > 0 ){
				        $update_values .= "::,::country::::$this->country";    
				    }
				    if( strlen($this->gender) > 0 ){
				        $update_values .= "::,::gender::::$this->gender";    
				    }
				    if( strlen($this->dob) > 0 ){
				        $update_values .= "::,::dob::::$this->dob";    
				    }
				    if(strlen($update_values) > 0){
				        $UpdateResponse = AptPdoUpdate(['Update'=>$update_values,'Condtion'=>"user_id::::$this->user_id",'DbCon'=>$SystemDbConn,'TbName'=>'account_registration','EPass'=>EPASS,'AcceptNullUpdate'=>true]);
    					if($UpdateResponse['code'] != 200 and $UpdateResponse['code'] != 404){
    						$this->IsError = true;
    						if($this->debug == true){
    							$this->response = ['status'=>false,'data'=>"Something went wrong",'code'=>400,'EVersion'=>'E.1.1','reason'=>['msg'=>$UpdateResponse['msg'],'reason'=>$UpdateResponse['reason']]];
    						}else{
    							$this->response = ['status'=>false,'data'=>$UpdateResponse['msg'],'code'=>400,'EVersion'=>'E.1.20'];
    						}
    					}else{
    					    $this->response = ['status'=>true,'data'=>'Update successfully','user_status'=>'active','code'=>200];
    					}    
				    }else{
				        $this->IsError = true;
				        $this->response = ['status'=>false,'data'=>'Change something for update','user_status'=>'active','code'=>400];   
				    }
			        
				}
				
				
				return $this->response;
			}
		}
		if($_SERVER['REQUEST_METHOD'] == 'POST'){
			$obj = new AccountVerfication($_POST);
		}else{
			$obj = new AccountVerfication($_GET);
		}
		$response = $obj->DoAccountVerfication();
		echo json_encode( $response);
	}catch(Throwable $e){
		echo json_encode(['status'=>false,'data'=>'Something went wrong','code'=>400,'etype'=>'Throwable','reason'=>$e]);die(); exit();
	}catch(Exception $e){
		echo json_encode(['status'=>false,'data'=>'Something went wrong','code'=>400,'etype'=>'exception']); die(); exit();
	}
?>


