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

		if ($_SERVER['REQUEST_METHOD'] != 'POST' && $_SERVER['REQUEST_METHOD'] != 'GET') {
			echo json_encode(['status'=>false,'data'=>'Only POST, Get request method accepted','code'=>400,'etype'=>'client']);
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
							$this->response = ['status'=>false,'data'=>'You are not logged in','code'=>400,'EVersion'=>'E.1.06'];
						}
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'You are not logged in','code'=>400,'EVersion'=>'E.2.0'];
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
                    $query = "SELECT uid,source_url FROM news  WHERE status = 'pending' ORDER BY rdate ASC  LIMIT 1 OFFSET 0 ";
                    $stmt = $SystemDbConn->prepare($query);
                    if($stmt->execute()){
                        if($stmt->rowCount() > 0){
                            $result = $stmt->fetchAll();
                            $this->source_url = $result[0]->source_url;
                            $this->news_id = $result[0]->uid;
                        }else{
                            $this->IsError = true;
                            $this->response = ['status'=>false,'data'=>'No sources found','totalrows'=>0,"code"=>404];
                        }
                    }else{
                        $this->IsError = true;
                        $this->response = ['status'=>false,'data'=>'Something went wrong',"code"=>400];
                    }

                    
                }
                
                if($this->IsError == false){
					$data['debug'] = false;
    				$data['url'] = $this->source_url;
    				
    				$cURLConnection = curl_init('http://65.108.210.106/article_scraper');
                    curl_setopt($cURLConnection, CURLOPT_POSTFIELDS, $data);
                    curl_setopt($cURLConnection, CURLOPT_RETURNTRANSFER, true);
                
                    $apiResponse = curl_exec($cURLConnection);
                    curl_close($cURLConnection);
                
                    $jsonArrayResponse = json_decode($apiResponse);
                    if($jsonArrayResponse->status != 1){
                        $this->IsError = true;
    				    $this->response = ['status'=>false,'data'=>'Something went wrong','code'=>400,'EVersion'=>'E.1.01'];
    				}
    				
    				$availability_count = 0;
    				
    				$this->article_title = $jsonArrayResponse->data->article_title;
    				$this->full_article = $jsonArrayResponse->data->full_article;
    				$this->article_summary = $jsonArrayResponse->data->article_summary;
    				$this->article_thumbnail = $jsonArrayResponse->data->article_thumbnail;
    				$this->article_video = $jsonArrayResponse->data->article_video;
    				$this->article_keywords = join(',',$jsonArrayResponse->data->article_keywords);
    				
    				if($this->article_title != "" ){
    				    $availability_count += 1;    
    				}
    				
    				if($this->full_article != "" ){
    				    $availability_count += 1;    
    				}
    				
    				
    				if($availability_count == 2){
    				    $this->status = "active";
    				    $this->udate = current_date_time;
                        $query = "UPDATE  news  SET status=:status,image=:image,video=:video,title=:title,description=:description,summary=:summary,tags=:tags,udate=:udate ";
                        $query .= " WHERE (uid=:id) and (status='pending') ";
                        $stmt = $SystemDbConn->prepare($query);
                        $stmt->bindParam(':status',$this->status, PDO::PARAM_STR);
                        $stmt->bindParam(':image',$this->article_thumbnail, PDO::PARAM_STR);
                        $stmt->bindParam(':video',$this->article_video, PDO::PARAM_STR);
                        $stmt->bindParam(':title',$this->article_title, PDO::PARAM_STR);
                        $stmt->bindParam(':description',$this->full_article, PDO::PARAM_STR);
                        $stmt->bindParam(':summary',$this->article_summary, PDO::PARAM_STR);
                        $stmt->bindParam(':tags',$this->article_keywords, PDO::PARAM_STR);
                        $stmt->bindParam(':udate',$this->udate, PDO::PARAM_STR);
                        $stmt->bindParam(':id',$this->news_id, PDO::PARAM_STR);
    					if($stmt->execute()){
    					    if($stmt->rowCount() > 0){
    					        $this->response = ['status'=>true,'data'=>"News update successfully",'code'=>200];    
    					    }else{
        						$this->IsError = true;
        						$this->response = ['status'=>false,'data'=>'Something went wrong',"code"=>400,'EVersion'=>'E.1.2031'];
        					} 
    					    
    					}else{
    						$this->IsError = true;
    						$this->response = ['status'=>false,'data'=>'Something went wrong','error'=>$stmt->errorinfo(),"code"=>400,'EVersion'=>'E.1.2032'];
    					}   
    				}else{
    				    $this->status = "uncomplete";
    				    $this->udate = current_date_time;
                        $query = "UPDATE  news  SET status=:status,udate=:udate ";
                        $query .= " WHERE (uid=:id)";
                        $stmt = $SystemDbConn->prepare($query);
                        $stmt->bindParam(':status',$this->status, PDO::PARAM_STR);
                        $stmt->bindParam(':udate',$this->udate, PDO::PARAM_STR);
                        $stmt->bindParam(':id',$this->news_id, PDO::PARAM_STR);
    					if($stmt->execute()){
    					    if($stmt->rowCount() > 0){
    					        $this->response = ['status'=>false,'data'=>"Uncomplete news",'code'=>400];   
    					    }else{
        						$this->IsError = true;
        						$this->response = ['status'=>false,'data'=>'Something went wrong',"code"=>400,'EVersion'=>'E.1.2033'];
        					} 
    					    
    					}  
    				}
				}
                
                
				
				return $this->response;
			}
		}
		
		$obj = new Signup($_REQUEST);
		$response = $obj->DoSignup();
		echo json_encode($response);
	}catch(Exception $e){
		echo json_encode(['status'=>false,'data'=>'Something went wrong','code'=>400,'etype'=>'exception']); die(); exit();
	}
?>


