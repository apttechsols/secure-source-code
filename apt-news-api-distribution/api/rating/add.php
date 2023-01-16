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
					if(array_key_exists("token",$data)){
						if(preg_match('/[a-z0-9_]/', $data['token']) and strlen($data['token']) > 0){
							$this->token = $data['token'];
						}else{
							$this->IsError = true;
							$this->response = ['status'=>false,'data'=>'You are not logged in...','code'=>400,'EVersion'=>'E.1.06'];
						}
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'You are not logged in.....','code'=>400,'EVersion'=>'E.2.0'];
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
    				}else{
    				    $this->user_id = $jsonArrayResponse->data->user_id;  
    				    
    				}
				}
				
				if($this->IsError == false){
					if(array_key_exists("news_id",$data)){
						if(strlen($data['news_id']) > 0){
							$this->news_id = htmlspecialchars(strip_tags($data['news_id']));
						}else{
							$this->IsError = true;
							$this->response = ['status'=>false,'data'=>'News is missing','code'=>400,'EVersion'=>'E.1.01'];
						}
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'News is missing','code'=>400,'EVersion'=>'E.2.0'];
					}
				}
				
				if($this->IsError == false){
					if(array_key_exists("rating",$data)){
						if(strlen($data['rating']) > 0){
							$this->rating = floatval(htmlspecialchars(strip_tags($data['rating'])));
						}else{
							$this->IsError = true;
							$this->response = ['status'=>false,'data'=>'Rating is missing','code'=>400,'EVersion'=>'E.1.01'];
						}
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'Rating is missing','code'=>400,'EVersion'=>'E.2.0'];
					}
				}
			}
			public function DoSignup(){

				$this->current_datetime = current_date_time;

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
                
                    $query = "SELECT id FROM news WHERE news.status = 'active' and uid = :news_id ";
                    $stmt = $SystemDbConn->prepare($query);
                    $stmt->bindParam(':news_id',$this->news_id,PDO::PARAM_STR);
                    if($stmt->execute()){
                        if($stmt->rowCount() < 1){
                            $this->IsError = true;
                            $this->response =  ['status'=>false,'data'=>'Invalid News','totalrows'=>0,"code"=>404];
                        }
                    }
                    else{
                        $this->IsError = true;
                        $this->response =  ['status'=>false,'data'=>"Something went wrong",'totalrows'=>0,"code"=>400];
                    }
                }
				

				
				if($this->IsError == false){
                    $rating ='rating_'.rand_string(3).time().rand_string(3);
                    $query = "INSERT INTO rating_items (uid,rid,rating,user_id,rdate,udate) VALUES ";
                    $query .= "(:uid,:rid,:rating,:user_id,:rdate,:udate)";
                    $query .= " ON DUPLICATE KEY UPDATE ucount = ucount + 1 ";
                    $stmt = $SystemDbConn->prepare($query);
                    $stmt->bindParam(":uid",$rating,PDO::PARAM_STR);
                    $stmt->bindParam(":rid",$this->news_id,PDO::PARAM_STR);
                    $stmt->bindParam(":rating",$this->rating,PDO::PARAM_STR);
                    $stmt->bindParam(":user_id",$this->user_id,PDO::PARAM_STR);
                    $stmt->bindParam(":rdate",$this->current_datetime,PDO::PARAM_STR);
                    $stmt->bindParam(":udate",$this->current_datetime,PDO::PARAM_STR);
					if($stmt->execute()){
					    if($stmt->rowCount() > 0){
					        $this->IsError = false;
					        $this->response = ['status'=>true,'data'=>"Rating add successfully",'code'=>200];    
					    }else{
					        $this->IsError = true;
						    $this->response = ['status'=>false,'data'=>'Something went wrong',"code"=>400,'EVersion'=>'E.1.203'];   
					    }
					    
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'Something went wrong',"code"=>400,'EVersion'=>'E.1.203'];
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


