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
				
				$this->image = $data['image'];
                $this->image_size = $data['image_size'];
                $this->image_ext = $data['image_ext'];
                $this->image_tmp_name = $data['image_tmp_name'];
                
                 
                
                
                if($this->image_tmp_name == null or strlen($this->image_tmp_name) < 1){
                    $this->IsError = true;
                    $this->response = ['status'=>false,'data'=>'image is missing','code'=>400,'EVersion'=>'E.2.0'];   
                }
                
                
                
                
                
                if($this->IsError == false ){
                    $allowed_image = ['png','jpg','jpeg','gif'];
                    if (!(in_array(strtolower($this->image_ext),$allowed_image) && getimagesize($this->image_tmp_name) !== false)){
                        $this->IsError = true;
                        $this->response = ['status'=>false,'data'=>'image support only png,jpg,jpeg,gif format','code'=>400,'EVersion'=>'E.2.0'];
                    }
                }
                

                if($this->IsError == false ){
                    if ($this->image_size > 10240){
                        $this->IsError = true;
                        $this->response = ['status'=>false,'data'=>'image file is too large','code'=>400,'EVersion'=>'E.2.0'];
                    }else if ($this->image_size < 1){
                        $this->IsError = true;
                        $this->response = ['status'=>false,'data'=>'image file is too small','code'=>400,'EVersion'=>'E.2.0'];
                    }
                    
                }
                
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
				
				
				if($this->IsError == false ){
				    
                    $this->image = 'profile_'.rand_string(3).time().rand_string(3).'.'.$this->image_ext;
                    $this->image_path = $_SERVER['DOCUMENT_ROOT']."/media/profile/$this->image";
                }
                
				
				
				if($this->IsError == false){
				    $update_values = "profile::::$this->image";
			        $UpdateResponse = AptPdoUpdate(['Update'=>$update_values,'Condtion'=>"user_id::::$this->user_id",'DbCon'=>$SystemDbConn,'TbName'=>'account_registration','EPass'=>EPASS,'AcceptNullUpdate'=>true]);
					if($UpdateResponse['code'] == 200 ){
					    $this->response = ['status'=>true,'data'=>'Your profile image update successfully','user_status'=>'active','code'=>200];
					    move_uploaded_file($this->image_tmp_name,$this->image_path);   
						
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
    		$_POST['image'] = $_FILES['image'];
            $_POST['image_tmp_name'] = $_FILES['image']['tmp_name'];
    	    $_POST['image_size'] = round($_FILES['image']['size'] / 1024, 2);
            $_POST['image_ext'] = str_replace('.','',image_type_to_extension(getimagesize($_FILES['image']['tmp_name'])[2]));
            
			$obj = new AccountVerfication($_POST);
		}else{
		    $_GET['image'] = $_FILES['image'];
            $_GET['image_tmp_name'] = $_FILES['image']['tmp_name'];
    	    $_GET['image_size'] = round($_FILES['image']['size'] / 1024, 2);
            $_GET['image_ext'] = str_replace('.','',image_type_to_extension(getimagesize($_FILES['image']['tmp_name'])[2]));
            
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


