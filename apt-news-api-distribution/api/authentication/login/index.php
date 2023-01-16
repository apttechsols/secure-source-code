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

		if($is_api_error != false){
			if($api_error_type == 'EPASS'){
				echo json_encode(['status'=>false,'data'=>'Something went wrong 6','code'=>400,'etype'=>'internal1']); die(); exit();
			}else{
				echo json_encode(['status'=>false,'data'=>'Something went wrong 7','code'=>400,'etype'=>'internal2']); die(); exit();
			}
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

		if ($_SERVER['REQUEST_METHOD'] != 'POST') {
			echo json_encode(['status'=>false,'data'=>'Only POST request method accepted','code'=>400,'etype'=>'client']);
			die(); exit();
		}

		class Login{

			public function __construct($data = array()){
				$this->IsError = false;
				$this->response = ['status'=>false,'data'=>null,'code'=>400,'eversion'=>'e.0.0','etype'=>'client'];

				if($this->IsError == false){
					if(array_key_exists("email",$data)){
						if(filter_var($data['email'], FILTER_VALIDATE_EMAIL)){
							$this->email = htmlspecialchars(strip_tags($data['email']));
						}else{
							$this->IsError = true;
							$this->response = ['status'=>false,'data'=>'Email or Password invalid','code'=>400,'EVersion'=>'E.1.02'];
						}
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'Email or Password invalid','code'=>400,'EVersion'=>'E.2.01'];
					}
				}

				if($this->IsError == false){
					if(array_key_exists("password",$data)){
						if(preg_match('/.{6,32}+$/i', $data['password'])){
							$this->password = hash_hmac("sha256",hash_hmac("sha512",$data['password'],EPASS,true),EPASS,false);
						}else{
							$this->IsError = true;
							$this->response = ['status'=>false,'data'=>'Email or Password invalid','code'=>400,'EVersion'=>'E.1.03'];
						}
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'Email or Password invalid','code'=>400,'EVersion'=>'E.2.02'];
					}
				}

			}
			public function DoLogin(){
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
					$this->buffer = AptPdoFetch(['Condtion'=> "email::::".$this->email."::,::password::::".$this->password, 'FetchData'=>'status::::user_id::::token::::user_type::::first_name::::last_name::::language::::country','DbCon'=> $SystemDbConn, 'TbName'=> 'account_registration', 'EPass'=> EPASS,'DefaultCheckFor'=>'All']);
					if($this->buffer['code'] == 200 or $this->buffer['code'] == 404){
						if($this->buffer['code'] != 200){
							$this->IsError = true;
							$this->response = ['status'=>false,'data'=>"Email or Password invalid",'code'=>400,'EVersion'=>'E.1.30'];
						}else{
						    if($this->buffer['msg']->status == 'active' or $this->buffer['msg']->status == 'account_activation'){
								$user_id = $this->buffer['msg']->user_id;
								$token = $this->buffer['msg']->token;
							    $old_login_data = $this->buffer['msg']->login_data;
							    $this->user_type = $this->buffer['msg']->user_type;
							    $this->user_status = $this->buffer['msg']->status;
							    $this->last_name = $this->buffer['msg']->last_name;
							    $this->first_name = $this->buffer['msg']->first_name;
							    $this->language = $this->buffer['msg']->language;
							    $this->country = $this->buffer['msg']->country;
						    }else{
						        $this->IsError = true;
							    $this->response = ['status'=>false,'data'=>"Email or Password invalid ",'code'=>400,'EVersion'=>'E.1.30.0'];
						    }
						}
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>"Something went wrong",'code'=>400,'EVersion'=>'E.1.31'];
					}
				}

				if($this->IsError == false){
					$this->response = [
					    'status'=>true,
					    'data'=>"Welcome back!",
					    'uid'=>$user_id,
					    'email'=>$this->email,
					    'token'=>$token,
					    'user_type'=>$this->user_type,
					    'user_status'=>$this->user_status,
					    'first_name'=>$this->first_name,
					    'last_name'=>$this->last_name,
					    'language'=>$this->language,
					    'country'=>$this->country,
					    'code'=>200
					 ];
				}
				
				return $this->response;
			}
		}

		$obj = new Login($_POST);
		$response = $obj->DoLogin();
		echo json_encode( $response);
	}catch(Throwable $e){
		echo json_encode(['status'=>false,'data'=>'Something went wrong 4','code'=>400,'etype'=>'Throwable','reason'=>$e]);die(); exit();
	}catch(Exception $e){
		echo json_encode(['status'=>false,'data'=>'Something went wrong 5','code'=>400,'etype'=>'exception']); die(); exit();
	}
?>


