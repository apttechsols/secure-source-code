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
        
        function get_string_between($string, $start, $end){
            $string = ' ' . $string;
            $ini = strpos($string, $start);
            if ($ini == 0) return '';
            $ini += strlen($start);
            $len = strpos($string, $end, $ini) - $ini;
            return substr($string, $ini, $len);
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
				$this->c_date_time = current_date_time;

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
					$data['debug'] = false;
    				$data['token'] = $this->token;
               		
                    $cURLConnection = curl_init(current_protocol_domain.'/api/news/sources_search.php');
                    curl_setopt($cURLConnection, CURLOPT_POSTFIELDS, $data);
                    curl_setopt($cURLConnection, CURLOPT_RETURNTRANSFER, true);
                
                    $apiResponse = curl_exec($cURLConnection);
                    curl_close($cURLConnection);
                
                    // $apiResponse - available data from the API request
                    $jsonArrayResponse = json_decode($apiResponse);
                    if($jsonArrayResponse->status != true){
                        $this->IsError = true;
                        if($jsonArrayResponse->code == 404){
                            $this->response = ['status'=>true,'data'=>"News Already Up to date 1",'code'=>200];
                        }else{
                            $this->IsError = true;
    				        $this->response = ['status'=>false,'data'=>$jsonArrayResponse->data,'code'=>400,'EVersion'=>'E.1.01'];
                        }
    				}else{
    				    $this->source_uid = $jsonArrayResponse->data->uid;
    				    $this->source_url = $jsonArrayResponse->data->source_url;
    				    $this->language_code = $jsonArrayResponse->data->language_code;
    				    $this->country_code = $jsonArrayResponse->data->country_code;
    				    $this->category = $jsonArrayResponse->data->category;
    				}
				}
				
				if($this->IsError == false){
				    $simpleXml = Parse($this->source_url);
				    $Newsjsondata =json_encode($simpleXml);
				    $this->News_data_array = json_decode($Newsjsondata,TRUE);
				    
				    if(array_key_exists('entry',$this->News_data_array) == true){
				        $news_data_entery_key = key($this->News_data_array['entry']);
				    
    				    if($news_data_entery_key !== 0){
    				        $this->News_data_array['entry'] = [$this->News_data_array['entry']];
    				    }
				    }else{
				        $this->News_data_array['entry'] = [];
				    }
				    
				    
				    foreach ($this->News_data_array['entry'] as $Key=>$value){
				        $this->News_data_array['entry'][$Key]['published'] = str_replace("Z","",str_replace("T"," ",$value['published'])); 
				        
 				        $source_url = get_string_between($value['link']['@attributes']['href'],"&url=", "&ct");
 				        $this->News_data_array['entry'][$Key]['source_url'] = $source_url;
 				        
 				        $source_domain = explode('/',$source_url)[2]; 
				        $this->News_data_array['entry'][$Key]['source_domain'] = $source_domain; 
				        $source = explode('.',$source_domain); 
 				        $this->News_data_array['entry'][$Key]['source'] = count($source) > 2 ?$source[1]:$source[0];
 				        
				    }
    				
				}
				
				if($this->IsError == false){
				    $this->news_uids = [];  
				    $this->newsids = [];
				    $this->allowed_source_url = [];
				    $this->final_news_add_list = [];
				}
				
				if($this->IsError == false){
				    if(count($this->News_data_array['entry']) > 0){
                        $query = "SELECT source_url FROM news WHERE id > 0 && (";
                        
                        foreach ($this->News_data_array['entry'] as $key => $item){
                            if($key > 0){
                                $query .= "or ";
                            }
                            $query .= "source_url LIKE :source_url_$key ";
                        }
                        $query .= ") GROUP BY source_url LIMIT ".count($this->News_data_array['entry'])." OFFSET 0 ";
                        
                        $stmt = $SystemDbConn->prepare($query);
                        foreach ($this->News_data_array['entry'] as $key => $item){
                            $stmt->bindParam(":source_url_$key",$item['source_url'],PDO::PARAM_STR);
                        }
                        
                        if($stmt->execute()){
                            $result = $stmt->fetchAll();
                            foreach ($result as $key=>$value){
                                if(!in_array($value->source_url,$this->allowed_source_url)){
                                    array_push($this->allowed_source_url,$value->source_url);
                                }
                            }
    					}else{
    						$this->IsError = true;
    						$this->response = ['status'=>false,'data'=>'Something went wrong','error'=>$stmt->errorinfo(),"code"=>400,'EVersion'=>'E.1.2031'];
    					}
                    }
				}
				
				
				if($this->IsError == false){
				    foreach ($this->News_data_array['entry'] as $key => $item){
				        if(!in_array($item['source_url'],$this->allowed_source_url)){
				            array_push($this->final_news_add_list,$item);
				        }
				    }
				}
				
				if($this->IsError == false){
                        
                    if(count($this->final_news_add_list) > 0){
                        $query = "INSERT INTO news (uid,status,language_code,country_code,source_domain,source_name,source_url,publish_date,rdate,udate) VALUES ";
                        $count = 0;
                        foreach ($this->final_news_add_list as $key => $item){
                            if($count > 0){
                                $query .= ",";
                            }
                            $query .= "(:uid_$key,:status_$key,:language_code_$key,:country_code_$key,:source_domain_$key,:source_name_$key,:source_url_$key,:publish_date_$key,:rdate_$key,:udate_$key)";
                            
                            $count ++;
                        }
                        $query .= " ON DUPLICATE KEY UPDATE ucount = ucount + 1 ";
                    
                        $stmt = $SystemDbConn->prepare($query);
                        
                        foreach ($this->final_news_add_list as $k => $v){ 
                            
                            
                            
                            ${'uid_'.strval($k)} = 'news_'.rand_string(3).time().rand_string(3);
                            array_push($this->newsids,${'uid_'.strval($k)});
                            $stmt->bindParam(":uid_$k",${'uid_'.strval($k)},PDO::PARAM_STR);
                            
                            
                            ${'status_'.strval($k)} = "pending";
                            $stmt->bindParam(":status_$k",${'status_'.strval($k)},PDO::PARAM_STR);
                                
                            ${'language_code_'.strval($k)} = $this->language_code;
                            $stmt->bindParam(":language_code_$k",${'language_code_'.strval($k)},PDO::PARAM_STR);  
                            
                            ${'country_code_'.strval($k)} = $this->country_code;
                            $stmt->bindParam(":country_code_$k",${'country_code_'.strval($k)},PDO::PARAM_STR);
                            
                            ${'source_domain_'.strval($k)} = ($v['source_domain']);
                            $stmt->bindParam(":source_domain_$k",${'source_domain_'.strval($k)},PDO::PARAM_STR);
                            
                            ${'source_name_'.strval($k)} = ($v['source']);
                            $stmt->bindParam(":source_name_$k",${'source_name_'.strval($k)},PDO::PARAM_STR);
                            
                            ${'source_url_'.strval($k)} = ($v['source_url']);
                            $stmt->bindParam(":source_url_$k",${'source_url_'.strval($k)},PDO::PARAM_STR);
                            
                            ${'publish_date_'.strval($k)} = ($v['published']);
                            $stmt->bindParam(":publish_date_$k",${'publish_date_'.strval($k)},PDO::PARAM_STR);
                            
                            $this->ctime = current_date_time;
                            ${'rdate_'.strval($k)} = $this->ctime;
                            $stmt->bindParam(":rdate_$k",${'rdate_'.strval($k)},PDO::PARAM_STR);
                            
                            ${'udate_'.strval($k)} = $this->ctime;
                            $stmt->bindParam(":udate_$k",${'udate_'.strval($k)},PDO::PARAM_STR);
                            
                            
                        }
                        
                        if($stmt->execute()){
    					    $this->response = ['status'=>true,'data'=>"News add successfully",'code'=>200];
    					}else{
    						$this->IsError = true;
    						$this->response = ['status'=>false,'data'=>'Something went wrong','error'=>$stmt->errorinfo(),"code"=>400,'EVersion'=>'E.1.2032'];
    					}
                    }
                } 
                
                

                // if($this->IsError == false){
                //     $query = "SELECT uid FROM news WHERE id > 0 and (";
                //     $count = 0;
                //     foreach ($this->newsids as $val){
                //         if($count > 0){
                //             $query .= " OR ";
                //         }
                //         $query .= " (uid = '$val') ";   
                //         $count ++;
                //     }
                //     $query .= ") "; 
                //     $stmt = $SystemDbConn->prepare($query);
                //     if($stmt->execute()){
                //         if($stmt->rowCount() > 0){
                //             $result = $stmt->fetchAll();
                //             $this->result_array = array();
                //             foreach($result as $key=>$value){
                //                 array_push($this->news_uids,$value->uid);
                //             }
                //         }
                //     }
                // }
                
                if($this->IsError == false){
                    if(count($this->newsids) > 0){
                        $query = "INSERT INTO category_linking (uid,rid,category,rdate,udate) VALUES ";
                        $count = 0;
                        foreach ($this->newsids as $key => $item){
                            if($count > 0){
                                $query .= ", ";
                            }
                            $query .= "(:uid_$key,:rid_$key,:category,:rdate,:udate) ";
                            
                            $count ++;
                        }
                        $query .= "ON DUPLICATE KEY UPDATE ucount = ucount + 1 ";
                    
                        $stmt = $SystemDbConn->prepare($query);
                        
                        foreach ($this->newsids as $k => $v){ 
                            
                            ${'uid_'.strval($k)} = 'category_linking_'.rand_string(3).time().rand_string(3);
                            $stmt->bindParam(":uid_$k",${'uid_'.strval($k)},PDO::PARAM_STR);
                            
                            
                            ${'rid_'.strval($k)} = $v;
                            $stmt->bindParam(":rid_$k",${'rid_'.strval($k)},PDO::PARAM_STR);
                        }
                    
                    
                        $stmt->bindParam(":category",$this->category,PDO::PARAM_STR);
                        $stmt->bindParam(":rdate",$this->ctime,PDO::PARAM_STR);
                        $stmt->bindParam(":udate",$this->ctime,PDO::PARAM_STR);
    					if($stmt->execute()){
    					    if($stmt->rowCount() < 1){
    					   //     $this->IsError = true;
    						  //  $this->response = ['status'=>false,'data'=>'Something went wrong',"code"=>400,'EVersion'=>'E.1.2032'];   
    						  #continue
    					    }
    					    
    					}else{
    						$this->IsError = true;
    						$this->response = ['status'=>false,'data'=>'Something went wrong',"code"=>400,'EVersion'=>'E.1.2033'];
    					}
                    }
                } 
				
				if($this->IsError == false){
                    $query = "UPDATE news_sources SET udate=:udatetime ";
                    $query .= " WHERE uid = :uid ";
                    $stmt = $SystemDbConn->prepare($query);
                    $stmt->bindParam(':uid',$this->source_uid, PDO::PARAM_STR);
                    $stmt->bindParam(':udatetime',$this->c_date_time, PDO::PARAM_STR);
					if($stmt->execute()){
					    if($stmt->rowCount() > 0){
					        //$this->response = ['status'=>true,'data'=>"News update successfully",'code'=>200];    
					    }else{
    				// 		$this->IsError = true;
    				// 		$this->response = ['status'=>false,'data'=>'Something went wrong',"code"=>400,'EVersion'=>'E.1.2034'];
    					} 
					    
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'Something went wrong',"code"=>400,'EVersion'=>'E.1.2035'];
					}   
				}
				
				if($this->IsError == false){
				    if(count($this->final_news_add_list) > 0){
				        $this->response = ['status'=>true,'data'=>"News Added Successfully",'code'=>200];
				    }else{
				        $this->response = ['status'=>true,'data'=>"News Already Up to date",'code'=>200];   
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


