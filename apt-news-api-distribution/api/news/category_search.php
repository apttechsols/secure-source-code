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
					    if(strlen($data['token']) > 0){
					        if(preg_match('/[a-z0-9_]/', $data['token'])){
    							$this->token = $data['token'];
    						}else{
    							$this->IsError = true;
    							$this->response = ['status'=>false,'data'=>'You are not logged in','code'=>400,'EVersion'=>'E.1.06'];
    						}    
					    }else{
					        $this->token = "";    
					    }
						
					}else{
						$this->token = ""; 
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
				}else{
				    $this->user_id = null;    
				}
				
				if($this->IsError == false){
					if(array_key_exists("q",$data)){
						if(strlen($data['q']) > 0){
							$this->query = htmlspecialchars(strip_tags($data['query']));
						}else{
							$this->query = "";
						}
					}else{
						$this->query = "";
					}
				}
				
				if($this->IsError == false){
					if(array_key_exists("offset",$data)){
						if(strlen($data['offset']) > 0){
							$this->offset = intval(htmlspecialchars(strip_tags(strtolower($data['offset']))));
						}else{
							$this->offset = 0;
						}
					}else{
						$this->offset = 0;
					}
				}
				
				if($this->IsError == false){
					if(array_key_exists("limit",$data)){
						if(strlen($data['limit']) > 0){
							$this->limit = intval(htmlspecialchars(strip_tags(strtolower($data['limit']))));
						}else{
							$this->limit = 10;
						}
					}else{
						$this->limit = 10;
					}
                }
				
				
				
	


			}
			public function DoSignup(){
				$this->ctime = current_time;

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
                    $query = "SELECT category,count(category) AS CountOf FROM category_linking INNER JOIN news ON(category_linking.rid = news.uid and news.status = 'active') WHERE (news.image IS NOT NULL or news.video IS NOT NULL) && LENGTH(news.title) >= 20 && LENGTH(news.description) >= 80 GROUP BY category ";
                    $stmt = $SystemDbConn->prepare($query);
                    if($stmt->execute()){
                        if($stmt->rowCount() > 0){
                            if($stmt->execute()){
                        if($stmt->rowCount() > 0){
                            $result = $stmt->fetchAll();
                            
                            $this->result_array = array();
                            foreach($result as $key=>$value){
                                $result_array_tmp = array();
                                $result_array = $value;
                                
                                $result_array_tmp['category'] = $result_array->category;
                                $result_array_tmp['countof'] = intval($result_array->CountOf);
                                
                                
                                $this->result_array[] = $result_array_tmp;
                            }
                        }else{
                            $this->IsError = true;
                            $this->response =  ['status'=>false,'data'=>'No categoty found','totalrows'=>0,"code"=>404];
                        }
                    }else{
                        $this->IsError = true;
                        $this->response =  ['status'=>false,'data'=>"Something went wrong","code"=>400];
                    }
                            
                            
                        }
                    }

                    
                }
                
                if($this->IsError == false){
                
                    $query = "SELECT category,count(category) AS CountOf FROM category_linking INNER JOIN news ON(category_linking.rid = news.uid and news.status = 'active') WHERE (news.image IS NOT NULL or news.video IS NOT NULL) && LENGTH(news.title) >= 20 && LENGTH(news.description) >= 80 GROUP BY category ";
                    $stmt = $SystemDbConn->prepare($query);
                    
                    if($stmt->execute()){
                        if($stmt->rowCount() > 0){
                            $this->response = ['status'=>true,'data'=>$this->result_array,'totalrows'=>$stmt->rowCount(),"code"=>200];
                        }else{
                            $this->IsError = true;
                            $this->response =  ['status'=>false,'data'=>'No news found','totalrows'=>0,"code"=>404];
                        }
                    }
                    else{
                        $this->IsError = true;
                        $this->response =  ['status'=>false,'data'=>"Something went wrong",'totalrows'=>0,"code"=>400];
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


