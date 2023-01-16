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
			echo json_encode(['status'=>false,'data'=>'Only POST, GET request method accepted','code'=>400,'etype'=>'client']);
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
							$this->query = htmlspecialchars(strip_tags($data['q']));
						}else{
							$this->query = "";
						}
					}else{
						$this->query = "";
					}
				}
				
				if($this->IsError == false){
					if(array_key_exists("summary",$data)){
						if(strlen($data['summary']) > 0){
							$this->summary = intval(htmlspecialchars(strip_tags($data['summary'])));
						}else{
							$this->summary = 0;
						}
					}else{
						$this->summary = 0;
					}
				}
				
				if($this->IsError == false){
					if(array_key_exists("category",$data)){
						if(strlen($data['category']) > 0){
							$this->category = strtolower(htmlspecialchars(strip_tags($data['category'])));
							if($this->category == "all"){
							    $this->category = "";   
							}
						}else{
							$this->category = "";
						}
					}else{
						$this->category = "";
					}
				}
				
				if($this->IsError == false){
					if(array_key_exists("language",$data)){
						if(strlen($data['language']) > 0){
							$this->language = htmlspecialchars(strip_tags($data['language']));
							if($this->language == "all"){
							    $this->language = "";   
							}
						}else{
							$this->language = "";
						}
					}else{
						$this->language = "";
					}
				}
				
				if($this->IsError == false){
					if(array_key_exists("country",$data)){
						if(strlen($data['country']) > 0){
							$this->country = htmlspecialchars(strip_tags($data['country']));
							if($this->country == "all"){
							    $this->country = "";   
							}
						}else{
							$this->country = "";
						}
					}else{
						$this->country = "";
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
						if(intval($data['limit']) > 0 && intval($data['limit']) <= 100){
							$this->limit = intval($data['limit']);
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
                    $query = "SELECT bookmark_items.uid as bookmark_id,bookmark_items.rid,news.*,category_linking.category,rating_items.uid as rating_id,rating_items.rating,(SELECT count(id) FROM rating_items WHERE rid = news.uid) as total_like  ";
                    $query .= " FROM news  ";
                    
                    if(strlen($this->category)>0){ 
                        $query .= " INNER JOIN category_linking ON(category_linking.rid = news.uid and category_linking.category =:category) ";   
                    }else{
                        $query .= " LEFT JOIN category_linking ON(category_linking.rid = news.uid) ";     
                    }
                    $query .= " LEFT JOIN bookmark_items ON (news.uid = bookmark_items.rid and bookmark_items.user_id = :user_id)  LEFT JOIN rating_items ON (rating_items.rid = news.uid and rating_items.user_id = :user_id)  WHERE news.status = 'active' && (news.image IS NOT NULL or news.video IS NOT NULL) && LENGTH(news.title) >= 20 && LENGTH(news.description) >= 80 ";
                    
                    if($this->query != ""){
                        $query .= " and news.title LIKE :query ";    
                    }
                    
                    if($this->country != ""){
                        $query .= " and news.country_code = :country_code ";    
                    }
                    
                    if($this->language != ""){
                        $query .= " and news.language_code = :language_code ";    
                    }
                    if($this->summary == 1){
                        $query .= " and LENGTH(news.summary) > 50 ";    
                    }
                    
                    
                    $query .= " ORDER BY news.publish_date DESC ";
                    $query .= "LIMIT $this->limit OFFSET $this->offset ";
                    
                    $stmt = $SystemDbConn->prepare($query);
                    $stmt->bindParam(':user_id',$this->user_id,PDO::PARAM_STR);
                    if(strlen($this->category)>0){
                        $stmt->bindParam(':category',$this->category,PDO::PARAM_STR);    
                    }
                    if($this->country != ""){
                        $stmt->bindParam(':country_code',$this->country,PDO::PARAM_STR);    
                    }
                    
                    if($this->language != ""){
                        $stmt->bindParam(':language_code',$this->language,PDO::PARAM_STR);     
                    }
                    if (strlen($this->query)>0){
                        $query_like = '%'.$this->query.'%';
                        $stmt->bindParam(':query',$query_like,PDO::PARAM_STR);
                    }
                    if($stmt->execute()){
                        if($stmt->rowCount() > 0){
                            $result = $stmt->fetchAll();
                            
                            $this->result_array = array();
                            $this->index_list = array();
                            foreach($result as $key=>$value){
                                if($key + 1 < 4){
                                    array_push($this->index_list,$key + 1);    
                                }
                                
                                $result_array_tmp = array();
                                $result_array = $value;
                                
                                $result_array_tmp['uid'] = $result_array->uid;
                                $result_array_tmp['status'] = $result_array->status;
                                $result_array_tmp['language_code'] = $result_array->language_code;
                                $result_array_tmp['country_code'] = $result_array->country_code;
                                $result_array_tmp['source_domain'] = $result_array->source_domain;
                                $result_array_tmp['source_name'] = $result_array->source_name;
                                $result_array_tmp['source_url'] = $result_array->source_url;
                                $result_array_tmp['image'] = $result_array->image;
                                $result_array_tmp['video'] = $result_array->video;
                                $result_array_tmp['title'] = $result_array->title;
                                $result_array_tmp['description'] = $result_array->description;
                                $result_array_tmp['summary'] = $result_array->summary;
                                $result_array_tmp['publish_date'] = date('d F Y', strtotime(explode(' ',$result_array->publish_date)[0]));
                                $result_array_tmp['category'] = $result_array->category;
                                $result_array_tmp['bookmark_id'] = $result_array->bookmark_id;
                                $result_array_tmp['rid'] = $result_array->rid;
                                $result_array_tmp['rating_id'] = $result_array->rating_id;
                                $result_array_tmp['rating'] = $result_array->rating;
                                $result_array_tmp['total_like'] = $result_array->total_like;
                                
                                $result_array_tmp['rdate'] = $result_array->rdate;
                                $result_array_tmp['total_article'] = $result_array->total_article;
                                $result_array_tmp['category_list'] = $result_array->category_list;
                                
                                
                                $this->result_array[] = $result_array_tmp;
                            }
                        }else{
                            $this->IsError = true;
                            $this->response =  ['status'=>false,'data'=>'No news found','totalrows'=>0,"code"=>404];
                        }
                    }else{
                        $this->IsError = true;
                        $this->response =  ['status'=>false,'data'=>"Something went wrong","code"=>400];
                    }

                    
                }
                
                if(1==1){
                    $this->category_count_list = [
                        array('category'=>'all','CountOf'=>'0'),
                    ];
                    $query = "SELECT category,count(category) AS CountOf FROM category_linking INNER JOIN news ON(category_linking.rid = news.uid and news.status = 'active') GROUP BY category ";
                    $stmt = $SystemDbConn->prepare($query);
                    if($stmt->execute()){
                        if($stmt->rowCount() > 0){
                            $result = $stmt->fetchAll();
                            foreach ($result as $v ){
                                array_push($this->category_count_list,$v);  
                            }
                            
                            
                        }
                    }

                    
                }
                
                if($this->IsError == false){
                
                    $query = "SELECT NULL ";
                    $query .= " FROM news  ";
                    if(strlen($this->category)>0){
                        $query .= " INNER JOIN category_linking ON(category_linking.rid = news.uid and category_linking.category =:category) ";    
                    }else{
                        $query .= " LEFT JOIN category_linking ON(category_linking.rid = news.uid) ";     
                    }
                    $query .= " LEFT JOIN bookmark_items ON (news.uid = bookmark_items.rid and bookmark_items.user_id = :user_id)  LEFT JOIN rating_items ON (rating_items.rid = news.uid and rating_items.user_id = :user_id)  WHERE news.status = 'active' && (news.image IS NOT NULL or news.video IS NOT NULL) && LENGTH(news.title) >= 20 && LENGTH(news.description) >= 80 ";
                    
                    if($this->query != ""){
                        $query .= " and news.title LIKE :query ";    
                    }
                    
                    if($this->country != ""){
                        $query .= " and news.country_code = :country_code ";    
                    }
                    
                    if($this->language != ""){
                        $query .= " and news.language_code = :language_code ";    
                    }
                    if($this->summary == 1){
                        $query .= " and LENGTH(news.summary) > 50 ";    
                    }
                    
                    $query .= " ORDER BY news.publish_date DESC ";
                    $stmt = $SystemDbConn->prepare($query);
                    $stmt->bindParam(':user_id',$this->user_id,PDO::PARAM_STR);
                    if(strlen($this->category)>0){
                        $stmt->bindParam(':category',$this->category,PDO::PARAM_STR);    
                    }
                    if($this->country != ""){
                        $stmt->bindParam(':country_code',$this->country,PDO::PARAM_STR);    
                    }
                    
                    if($this->language != ""){
                        $stmt->bindParam(':language_code',$this->language,PDO::PARAM_STR);     
                    }
                    if (strlen($this->query)>0){
                        $query_like = '%'.$this->query.'%';
                        $stmt->bindParam(':query',$query_like,PDO::PARAM_STR);
                    }
                    if($stmt->execute()){
                        if($stmt->rowCount() > 0){
                            $this->response = ['status'=>true,'data'=>$this->result_array,'category_count_list'=>$this->category_count_list,'totalrows'=>$stmt->rowCount(),"code"=>200];
                        }else{
                            $this->IsError = true;
                            $this->response =  ['status'=>false,'data'=>'No news found','category_count_list'=>$this->category_count_list,'totalrows'=>0,"code"=>404];
                        }
                    }
                    else{
                        $this->IsError = true;
                        $this->response =  ['status'=>false,'data'=>"Something went wrong",'totalrows'=>0,"code"=>400];
                    }
                }
                $this->response['category_count_list'] = $this->category_count_list;
                $this->response['index_list'] = $this->index_list;
				
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


