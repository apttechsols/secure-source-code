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
                    $this->image_status = 0;   
                }else{
                    $this->image_status = '1';  
                }
                
                
                
                
                if($this->IsError == false && $this->image_status != 0){
                    $allowed_image = ['png','jpg','jpeg','gif'];
                    if (!(in_array(strtolower($this->image_ext),$allowed_image) && getimagesize($this->image_tmp_name) !== false)){
                        $this->IsError = true;
                        $this->response = ['status'=>false,'data'=>'image support only png,jpg,jpeg,gif format','code'=>400,'EVersion'=>'E.2.0'];
                    }
                }
                

                if($this->IsError == false && $this->image_status != 0 ){
                    if ($this->image_size > 10240){
                        $this->IsError = true;
                        $this->response = ['status'=>false,'data'=>'image file is too large','code'=>400,'EVersion'=>'E.2.0'];
                    }else if ($this->image_size < 1){
                        $this->IsError = true;
                        $this->response = ['status'=>false,'data'=>'image file is too small','code'=>400,'EVersion'=>'E.2.0'];
                    }
                    
                }
                
				
				if($this->IsError == false){
					if(array_key_exists("fname",$data)){
						if(strlen($data['fname']) > 0){
							$this->fname = htmlspecialchars(strip_tags($data['fname']));
						}else{
							$this->IsError = true;
							$this->response = ['status'=>false,'data'=>'Invalid first name provided','code'=>400,'EVersion'=>'E.1.01'];
						}
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'First name is missing','code'=>400,'EVersion'=>'E.2.0'];
					}
				}
				
				if($this->IsError == false){
					if(array_key_exists("lname",$data)){
						if(strlen($data['lname']) > 0){
							$this->lname = htmlspecialchars(strip_tags($data['lname']));
						}else{
							$this->lname = "";
						}
					}else{
						$this->lname = "";
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

				

				if($this->IsError == false){
					if(array_key_exists("password",$data)){
						if(preg_match('/.{8,32}+$/i', $data['password'])){
							$this->password = hash_hmac("sha256",hash_hmac("sha512",$data['password'],EPASS,true),EPASS,false);
						}else{
							$this->IsError = true;
							$this->response = ['status'=>false,'data'=>' Password length must bwtween(8-32 chars)','code'=>400,'EVersion'=>'E.1.02'];
						}
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'Password is missing','code'=>400,'EVersion'=>'E.2.0'];
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
				
				if($this->IsError == false){
					if(array_key_exists("email",$data)){
						if(filter_var($data['email'], FILTER_VALIDATE_EMAIL)){
							$this->email = htmlspecialchars(strip_tags($data['email']));
						}else{
							$this->IsError = true;
							$this->response = ['status'=>false,'data'=>'Invalid email address provided','code'=>400,'EVersion'=>'E.1.01'];
						}
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'email is missing','code'=>400,'EVersion'=>'E.2.0'];
					}
				}
				
				if($this->IsError == false){
					if(array_key_exists("otp",$data)){
						if(preg_match('/[0-9]$/', $data['otp']) and strlen($data['otp']) > 0){
							$this->otp = htmlspecialchars(strip_tags($data['otp']));
						}else{
							$this->IsError = true;
							$this->response = ['status'=>false,'data'=>'OTP is not valid','code'=>400,'EVersion'=>'E.1.03'];
						}
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'OTP is not valid','code'=>400,'EVersion'=>'E.2.0'];
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
				
				
				if($this->IsError == false && $this->image_status != 0){
				    
                    $this->image = 'profile_'.rand_string(3).time().rand_string(3).'.'.$this->image_ext;
                    $this->image_path = $_SERVER['DOCUMENT_ROOT']."/media/profile/$this->image";
                }
                
				
				$is_otp_valid = -1;
				
				if($this->IsError == false){
					$this->buffer = AptPdoFetch(['Condtion'=> "email::::$this->email", 'FetchData'=>'status::::user_id::::ucode','DbCon'=> $SystemDbConn, 'TbName'=> 'account_registration', 'EPass'=> EPASS,'DefaultCheckFor'=>'All']);
					if($this->buffer['code'] == 200 or $this->buffer['code'] == 404){
						if($this->buffer['code'] == 200){
						    $is_otp_valid = 1;
							$this->user_id = $this->buffer['msg']->user_id;
							$user_status = $this->buffer['msg']->status;
							$user_ucode = explode(',',$this->buffer['msg']->ucode);
							$user_ucode_otp = $user_ucode[0];
							$user_ucode_otp_type = $user_ucode[1];
							$user_ucode_otp_time = $user_ucode[2];
							if($user_status != 'pending'){
							    $this->IsError = true;
						        $this->response = ['status'=>true,'data'=>'Your account is already activated','code'=>200];
							}else{
							    $is_otp_valid = 0;
							    if($user_ucode_otp != $this->otp){
							        $this->IsError = true;
						            $this->response = ['status'=>false,'data'=>'OTP is invalid','is_otp_valid'=>$is_otp_valid,'code'=>400,'EVersion'=>'E.1.05'];
							    }else if($user_ucode_otp_type != 'account_activation'){
							        $this->IsError = true;
						            $this->response = ['status'=>false,'data'=>'OTP is invalid','is_otp_valid'=>$is_otp_valid,'code'=>400,'EVersion'=>'E.1.05'];
							    }else if(intval($user_ucode_otp_time)+600 < $this->ctime){
							        $this->IsError = true;
						            $this->response = ['status'=>false,'data'=>'OTP is expired','is_otp_valid'=>$is_otp_valid,'code'=>400,'EVersion'=>'E.1.05'];
							    }
							}
						}else{
							$this->IsError = true;
						    $this->response = ['status'=>false,'data'=>'Something went wrong','is_otp_valid'=>$is_otp_valid,'code'=>400,'EVersion'=>'E.1.05'];
						}
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>"Something went wrong",'is_otp_valid'=>$is_otp_valid,'code'=>400,'EVersion'=>'E.1.311'];
					}
				    
				}
				
				
				if($this->IsError == false){
				    $update_values = "status::::active::,::first_name::::$this->fname::,::last_name::::$this->lname::,::password::::$this->password";
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
				    if($this->image_status != 0){
				        $update_values .= "::,::profile::::$this->image";    
				    }
				    
			        $UpdateResponse = AptPdoUpdate(['Update'=>$update_values,'Condtion'=>"user_id::::$this->user_id",'DbCon'=>$SystemDbConn,'TbName'=>'account_registration','EPass'=>EPASS,'AcceptNullUpdate'=>true]);
					if($UpdateResponse['code'] != 200 and $UpdateResponse['code'] != 404){
						$this->IsError = true;
						if($this->debug == true){
							$this->response = ['status'=>false,'data'=>"Something went wrong",'code'=>400,'EVersion'=>'E.1.1','reason'=>['msg'=>$UpdateResponse['msg'],'reason'=>$UpdateResponse['reason']]];
						}else{
							$this->response = ['status'=>false,'data'=>$UpdateResponse,'code'=>400,'EVersion'=>'E.1.20'];
						}
					}else{
					    $this->response = ['status'=>true,'data'=>'Your account activated successfully','user_status'=>'active','code'=>200];
					    if($this->image_status != 0){
					        move_uploaded_file($this->image_tmp_name,$this->image_path);    
					    }
					}
				}else{
				    
				    if($is_otp_valid == 0){
				        $this->buffer = AptPdoDelete(['Condtion'=> "email::::$this->email::,::status::::pending", 'DbCon'=> $SystemDbConn, 'TbName'=> 'account_registration', 'EPass'=> EPASS]);
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


