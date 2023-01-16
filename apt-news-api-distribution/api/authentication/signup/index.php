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

		if ($_SERVER['REQUEST_METHOD'] != 'POST') {
			echo json_encode(['status'=>false,'data'=>'Only POST request method accepted','code'=>400,'etype'=>'client']);
			die(); exit();
		}

		class Signup{

			public function __construct($data = array()){
				$this->IsError = false;
				$this->response = ['status'=>false,'data'=>null,'code'=>400,'eversion'=>'e.0.0','etype'=>'client'];
				
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
				
				

				// if($this->IsError == false){
				// 	$this->allow_direct_account = ['arpitsh018@gmail.com','apttechsols@gmail.com'];
				// }

				// if($this->IsError == false){
				// 	$this->allow_super_admin_account = ['arpitsh018@gmail.com'];
				// }

				// if($this->IsError == false){
				// 	$this->allow_admin_account = ['apttechsols@gmail.com'];
				// }

				// if($this->IsError == false){
				// 	if(in_array($this->email,$this->allow_super_admin_account)){
				// 		$this->user_type = 'superadmin';
				// 	}else if(in_array($this->email,$this->allow_admin_account)){
				// 		$this->user_type = 'admin';
				// 	}else{
				// 		$this->IsError = true;
				// 		$this->response = ['status'=>false,'data'=>$this->email,'code'=>400,'EVersion'=>'E.2.0'];
				// 		$this->user_type = 'user';
				// 	}
				// }
			}
			public function DoSignup(){
				$this->ctime = current_time;

				if($this->IsError == false){
					$this->user_id = 'a'.rand_string(5).time().rand_string(5);
					if(strlen($this->user_id) < 2){
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'Something went wrong','code'=>400,'etype'=>'internal','EVersion'=>'E.1.04'];
					}
					$account_activation_otp = rand_num(6);
					$ucode = $account_activation_otp.',account_activation,'.time();
				}

				if($this->IsError == false){
					$this->token = 'a'.rand_string(15);
					if(strlen($this->token) < 2){
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'Something went wrong','code'=>400,'etype'=>'internal','EVersion'=>'E.1.05'];
					}
				}

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
					$FetchResponse = AptPdoFetch(['Condtion'=> "email::::$this->email::,::status::::active", 'FetchData'=>'user_id','DbCon'=> $SystemDbConn, 'TbName'=> 'account_registration', 'EPass'=> EPASS,'DefaultCheckFor'=>'All']);
					if($FetchResponse['code'] == 200 or $FetchResponse['code'] == 404){
						if($FetchResponse['code'] == 200){
							$this->IsError = true;
							$this->response = ['status'=>false,'data'=>"Something went wrong",'code'=>400,'EVersion'=>'E.1.30'];

							$FetchResponse = AptPdoFetch(['Condtion'=> "email::::".$this->email, 'FetchData'=>'user_id','DbCon'=> $SystemDbConn, 'TbName'=> 'account_registration', 'EPass'=> EPASS,'DefaultCheckFor'=>'Any']);
							if($FetchResponse['code'] == 200){
								$this->response = ['status'=>false,'data'=>"Email address already used",'code'=>400,'etype'=>'client','EVersion'=>'E.1.32'];
							}
						}
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>"Something went wrong",'code'=>400,'EVersion'=>'E.1.33'];
					}
				}
				
				if($this->IsError == false){
					$this->buffer = AptPdoDelete(['Condtion'=> "email::::$this->email", 'DbCon'=> $SystemDbConn, 'TbName'=> 'account_registration', 'EPass'=> EPASS]);
				}

				
				if($this->IsError == false){
				    $this->current_date = current_date_time;
					$Insert = "";
				// 	if(in_array($this->email, $this->allow_direct_account)){
				// 		$Insert .= "status::::active::,::";
				// 	}else{
				// 		$Insert .= "status::::active::,::";
				// 	}
					$Insert .= "status::::pending::,::";
					$Insert .= "user_id::::$this->user_id::,::token::::$this->token::,::email::::$this->email::,::user_type::::user::,::account_type::::individual::,::rdate::::$this->current_date::,::udate::::$this->current_date::,::ucode::::$ucode";
					//echo json_encode($Insert); exit();
					$InsertResponse = AptPdoInsert(['InsertData'=>$Insert,'DbCon'=>$SystemDbConn,'TbName'=> 'account_registration', 'EPass'=> EPASS]);
					if($InsertResponse['code'] != 200){
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>"Something went wrong",'debug'=>$InsertResponse,'code'=>400,'EVersion'=>'E.1.2'];
					}
				}
				
				 if($this->IsError == false){
                    $mail = new PHPMailer;
                    $mail->isSMTP();
                    $mail->Host = smtp_host;
                    $mail->SMTPAuth = smtp_auth;
                    $mail->Username = smtp_username;
                    $mail->Password = smtp_password;
                    $mail->SMTPSecure = smtp_secure;
                    $mail->Port = smtp_port;
                    $mail->setFrom(info_email_id, site_name);
                    $mail->addAddress($this->email);  
                    $mail->isHTML(true); 
                    $mail->AddAttachment($this->new_qr_invoice_pdf); 
                    $mail->Subject = 'OTP for account activation - News';
                    $mail->Body = '<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                                  <div style="margin:50px auto;width:70%;padding:20px 0">
                                    <div style="border-bottom:1px solid #eee">
                                      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">'.site_name.'</a>
                                    </div>
                                    <p style="font-size:1.1em">Hi,</p>
                                    <p>Use the following OTP to complete your Sign Up procedures. OTP is valid for 10 minutes</p>
                                    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">'.$account_activation_otp.'</h2>
                                    
                                    </div>
                                  </div>
                                </div>';
                    $mail->AltBody = "This opt is genrated for account varificationa. Your OTP is $account_activation_otp</b>. OTP is valid for next 10 minutes only. Please do not share this OTP with any one.";
                    if(!$mail->send()) {
                        $this->IsError = true;
                        $this->response = ['status'=>false,'data'=>"Something went wrong",'code'=>400,'EVersion'=>'E.1.1'];
                    } else {
                        $this->response = ['status'=>true,'data'=>"We sent a verification OTP on your email address. please activate your account",'code'=>200];
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


