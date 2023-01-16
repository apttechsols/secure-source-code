<?php
	define('is_api',true);
	define('IsLoginCheck',false);
	require($_SERVER['DOCUMENT_ROOT'].'/system/main/comman_control/_backend.php');

	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: POST,GET');
	header('Content-Type: application/json');
	header('Access-Control-Allow-Headers:Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');
	
	try{
		
		require($_SERVER['DOCUMENT_ROOT'].'/system/config/database/index.php');
		require($_SERVER['DOCUMENT_ROOT'].'/system/plugin/Apt/Php/Pdo/fetch.php');
		require($_SERVER['DOCUMENT_ROOT'].'/system/plugin/Apt/Php/Pdo/update.php');

		if($is_api_error != false){
			if($api_error_type == 'EPASS'){
				echo json_encode(['status'=>false,'data'=>'Something went wrong','code'=>400,'etype'=>'internal']); die(); exit();
			}else{
				echo json_encode(['status'=>false,'data'=>'Something went wrong','code'=>400,'etype'=>'internal']); die(); exit();
			}
		}

		if ($_SERVER['REQUEST_METHOD'] != 'GET' && $_SERVER['REQUEST_METHOD'] != 'POST') {
			echo json_encode(['status'=>false,'data'=>'Only POST, GET request method accepted','code'=>400,'etype'=>'client']);
			die(); exit();
		}

		class IsValidAPIKey{

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
			}

			public function DoIsValidAPIKey(){
				$this->ctime = current_time;

				if($this->IsError == false){
					$SystemDbConn = new system_db_conn(['host'=>db_host,'name'=>db_name,'user'=>db_user,'pass'=>db_pass]);
					$SystemDbConn = $SystemDbConn->get_conn();
					if($SystemDbConn['status'] != true){
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'Somthing went wrong','code'=>400,'EVersion'=>'E.10.0'];
					}else{
						$SystemDbConn = $SystemDbConn['data'];
					}
				}

				if($this->IsError == false){
					$this->buffer = AptPdoFetch(['Condtion'=> "token::::".$this->token, 'FetchData'=>'status::::account_type::::user_type::::user_id::::email::::first_name::::last_name::::language::::country::::gender::::profile::::dob','DbCon'=> $SystemDbConn, 'TbName'=> 'account_registration', 'EPass'=> EPASS,'DefaultCheckFor'=>'All']);
					if($this->buffer['code'] == 200 or $this->buffer['code'] == 404){
						if($this->buffer['code'] != 200){
							$this->IsError = true;
							$this->response = ['status'=>false,'data'=>'Invalid token','code'=>400,'EVersion'=>'E.11.0'];
						}else{
							$status = $this->buffer['msg']->status;
							$login_data = unserialize($this->buffer['msg']->login_data);
							$username = $this->buffer['msg']->username;
							$account_type = $this->buffer['msg']->account_type;
							$email = $this->buffer['msg']->email;
							$user_type = $this->buffer['msg']->user_type;
							$user_id = $this->buffer['msg']->user_id;
							$token = $this->token;
							$first_name = $this->buffer['msg']->first_name;
							$last_name = $this->buffer['msg']->last_name;
							$language = $this->buffer['msg']->language;
							$country = $this->buffer['msg']->country;
							$gender = $this->buffer['msg']->gender;
							$image = $this->buffer['msg']->profile;
							$dob = $this->buffer['msg']->dob;
						}
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'Somthing went wrong','code'=>400,'EVersion'=>'E.12.0'];
					}
				}
				
				if($this->IsError == false){
				    if($status == 'active'){
				        $this->response = ['status'=>true,'data'=>[
				            'status'=>$status,
				            'account_type'=>$account_type,
				            'email'=>$email,
				            'user_type'=>$user_type,
				            'user_id'=>$user_id,
				            'token'=>$token,
				            'first_name'=>$first_name,
				            'last_name'=>$last_name,
    				        'country'=>$country,
    				        'language'=>$language,
    				        '$dob'=>$dob,
    				        'dob'=>date('Y F d', strtotime($dob)),
    				        'gender'=>$gender,
				        ],'code'=>200];
				        if($image != null){
				            $this->response['data']['profile'] =  current_protocol_domain."/media/profile/$image";   
				        }else{
				            $this->response['data']['profile'] =  current_protocol_domain."/media/profile/default/profileimage.png";     
				        }
				    }else if($status == 'account_activation'){
				        $this->IsError = true;
						$this->response = ['status'=>false,'data'=>'Your account need activation','email'=>$email,'token'=>$token,'user_type'=>$user_type,'user_status'=>$status,'code'=>400,'EVersion'=>'E.12.01','response_id'=>'account_activation'];
				    }else{
				        $this->IsError = true;
						$this->response = ['status'=>false,'data'=>'Your account status is not activate','code'=>400,'EVersion'=>'E.12.01','response_id'=>'status'];
				    }
				}

				return $this->response;
			}
		}
		if ($_SERVER['REQUEST_METHOD'] == 'GET'){
			$obj = new IsValidAPIKey($_GET);
		}else{
			$obj = new IsValidAPIKey($_POST);
		}
		$response = $obj->DoIsValidAPIKey();
		echo json_encode($response);
	}catch(Throwable $e){
		echo json_encode(['status'=>false,'data'=>'Invalid token','code'=>400,'etype'=>'Throwable','reason'=>$e]);die(); exit();
	}catch(Exception $e){
		echo json_encode(['status'=>false,'data'=>'Invalid token','code'=>400,'etype'=>'exception']); die(); exit();
	}
?>


