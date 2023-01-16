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
		require($_SERVER['DOCUMENT_ROOT'].'/system/plugin/Apt/Php/Script/PhpMailer/class.phpmailer.php');
        require($_SERVER['DOCUMENT_ROOT'].'/system/plugin/Apt/Php/Script/PhpMailer/PHPMailerAutoload.php');

		if($is_api_error != false){
			if($api_error_type == 'EPASS'){
				echo json_encode(['status'=>false,'data'=>'Something went wrong','code'=>400,'etype'=>'internal1']); die(); exit();
			}else{
				echo json_encode(['status'=>false,'data'=>'Something went wrong','code'=>400,'etype'=>'internal2']); die(); exit();
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

		class ClassObj{

			public function __construct($data = array()){
				$this->IsError = false;
				$this->response = ['status'=>false,'data'=>null,'code'=>400,'eversion'=>'e.0.0','etype'=>'client'];
				
				if($this->IsError == false){
					if(array_key_exists("email",$data)){
						if(filter_var($data['email'], FILTER_VALIDATE_EMAIL)){
							$this->email = htmlspecialchars(strip_tags($data['email']));
						}else{
							$this->IsError = true;
							$this->response = ['status'=>false,'data'=>'Please provide vaild email address','code'=>400,'EVersion'=>'E.1.02'];
						}
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'Please provide vaild email address','code'=>400,'EVersion'=>'E.2.0'];
					}
				}

				if($this->IsError == false){
					if(array_key_exists("name",$data)){
						if(strlen($data['name']) > 0){
							$this->name = htmlspecialchars(strip_tags($data['name']));
						}else{
							$this->IsError = true;
							$this->response = ['status'=>false,'data'=>'Please provide vaild name','code'=>400,'EVersion'=>'E.1.02'];
						}
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'Please provide vaild name','code'=>400,'EVersion'=>'E.2.0'];
					}
				}
				
				if($this->IsError == false){
					if(array_key_exists("subject",$data)){
						if(strlen($data['subject']) > 0){
							$this->subject = htmlspecialchars(strip_tags($data['subject']));
						}else{
							$this->IsError = true;
							$this->response = ['status'=>false,'data'=>'Please provide vaild subject','code'=>400,'EVersion'=>'E.1.02'];
						}
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'Please provide vaild subject','code'=>400,'EVersion'=>'E.2.0'];
					}
				}
				
				
				if($this->IsError == false){
					if(array_key_exists("message",$data)){
						if(strlen($data['message']) > 0){
							$this->message = htmlspecialchars(strip_tags($data['message']));
						}else{
							$this->IsError = true;
							$this->response = ['status'=>false,'data'=>'Please provide vaild message','code'=>400,'EVersion'=>'E.1.02'];
						}
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'Please provide vaild message','code'=>400,'EVersion'=>'E.2.0'];
					}
				}

			}
			
			public function DoClassObj(){
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
                    $mail = new PHPMailer;
                    $mail->isSMTP();                                      // Set mailer to use SMTP
                    $mail->Host = smtp_host;  // Specify main and backup SMTP servers
                    $mail->SMTPAuth = smtp_auth;                               // Enable SMTP authentication
                    $mail->Username = smtp_username;                 // SMTP username
                    $mail->Password = smtp_password;                           // SMTP password
                    $mail->SMTPSecure = smtp_secure;
                    $mail->Port = smtp_port;                                    // TCP port to connect to
                    $mail->setFrom(smtp_email, site_name);
                    $mail->addAddress(email_received);  
                    $mail->isHTML(true);
                    $mail->Subject = 'Contact request from '.$this->name;
                    $mail->Body    = "Name : $this->name
                                      <br>
                                      Email : $this->email
                                      <br>
                                      Subject : $this->subject
                                      <br>
                                      Message : $this->message
                                        ";
                    if($mail->send()) {
						$this->response = ['status'=>true,'data'=>'We received your request. Our experts will call you within 24 hours.','code'=>200,];
                    }else{
                        $this->IsError = true;
						$this->response = ['status'=>false,'data'=>'Something went wrong','code'=>400,'EVersion'=>'E.1.05'];
                    }
                }
				
				return $this->response;
			}
		}

		$obj = new ClassObj($_POST);
		$response = $obj->DoClassObj();
		echo json_encode( $response);
	}catch(Throwable $e){
		echo json_encode(['status'=>false,'data'=>'Something went wrong','code'=>400,'etype'=>'Throwable','reason'=>$e]);die(); exit();
	}catch(Exception $e){
		echo json_encode(['status'=>false,'data'=>'Something went wrong','code'=>400,'etype'=>'exception']); die(); exit();
	}
?>