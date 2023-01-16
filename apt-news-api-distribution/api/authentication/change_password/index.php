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
		require($_SERVER['DOCUMENT_ROOT'].'/system/plugin/Apt/Php/Pdo/delete.php');

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
					if(array_key_exists("old_password",$data)){
						if(preg_match('/.{8,32}+$/i', $data['old_password'])){
							$this->old_password = hash_hmac("sha256",hash_hmac("sha512",$data['old_password'],EPASS,true),EPASS,false);
						}else{
							$this->IsError = true;
							$this->response = ['status'=>false,'data'=>'Old password length must bwtween(8-32 chars)','code'=>400,'EVersion'=>'E.1.02'];
						}
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'Old password is missing','code'=>400,'EVersion'=>'E.2.0'];
					}
				}

				if($this->IsError == false){
					if(array_key_exists("password",$data)){
						if(preg_match('/.{8,32}+$/i', $data['password'])){
							$this->password = hash_hmac("sha256",hash_hmac("sha512",$data['password'],EPASS,true),EPASS,false);
						}else{
							$this->IsError = true;
							$this->response = ['status'=>false,'data'=>'New password length must bwtween(8-32 chars)','code'=>400,'EVersion'=>'E.1.02'];
						}
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'New password is missing','code'=>400,'EVersion'=>'E.2.0'];
					}
				}

				if($this->IsError == false){
					if(array_key_exists("confirm_password",$data)){
						if($data['confirm_password'] != $data['confirm_password']){
							$this->IsError = true;
							$this->response = ['status'=>false,'data'=>'Confirm password not match','code'=>400,'EVersion'=>'E.1.03'];
						}
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'Confirm password not found','code'=>400,'EVersion'=>'E.2.0'];
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
				    $this->current_date = current_date_time;
				    $update_values = "password::::$this->password::,::udate::::$this->current_date";
			        $UpdateResponse = AptPdoUpdate(['Update'=>$update_values,'Condtion'=>"user_id::::$this->user_id::,::password::::$this->old_password",'DbCon'=>$SystemDbConn,'TbName'=>'account_registration','EPass'=>EPASS,'AcceptNullUpdate'=>true]);
					if($UpdateResponse['code'] == 200 ){
					    $this->response = ['status'=>true,'data'=>'Your password update successfully','user_status'=>'active','code'=>200];
						
					}else{
					    $this->IsError = true;
						if($this->debug == true){
							$this->response = ['status'=>false,'data'=>"Something went wrong",'code'=>400,'EVersion'=>'E.1.1','reason'=>['msg'=>$UpdateResponse['msg'],'reason'=>$UpdateResponse['reason']]];
						}else{
							$this->response = ['status'=>false,'data'=>$UpdateResponse,'code'=>400,'EVersion'=>'E.1.20'];
						}  
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


