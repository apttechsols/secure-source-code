<?php
	class system_db_conn{
		private $debug;
		private $db_host;
		private $db_name;
		private $db_user;
		private $db_pass;
		private $db_conn;

		private $IsError = false;
		private $IsWarning = false;
		private $response = ['status'=>false,'data'=>null,'code'=>400,'EVersion'=>'E.0.0'];

		public function __construct($data=array()){

			if($this->IsError == false){
				if(array_key_exists("debug",$data)){
					if($data['debug'] == true or $data['debug'] == false){
						$this->debug = $data['debug'];
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'Debug have invalid properties','code'=>400,'EVersion'=>'E.1.0'];
					}
				}else{
					$this->debug = false;
				}
			}

			if($this->IsError == false){
				if(array_key_exists("host",$data)){
					if(preg_match('/[a-zA-Z0-9_-]{1,}+$/i', $data['host'])){
						$this->db_host = $data['host'];
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'Database host is not valid','code'=>400,'EVersion'=>'E.1.0'];
					}
				}else{
					$this->IsError = true;
					$this->response = ['status'=>false,'data'=>'Database host not found','code'=>400,'EVersion'=>'E.2.0'];
				}
			}

			if($this->IsError == false){

				if(array_key_exists("name",$data)){
					if(preg_match('/[a-zA-Z0-9_-]{1,}+$/i', $data['name'])){
						$this->db_name = $data['name'];
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'Database name is not valid','code'=>400,'EVersion'=>'E.3.0'];
					}
				}else{
					$this->IsError = true;
					$this->response = ['status'=>false,'data'=>'Database name not found','code'=>400,'EVersion'=>'E.4.0'];
				}
			}

			if($this->IsError == false){
				if(array_key_exists("user",$data)){
					if(preg_match('/[a-zA-Z0-9_-]{1,}+$/i', $data['user'])){
						$this->db_user = $data['user'];
					}else{
						$this->IsError = true;
						$this->response = ['status'=>false,'data'=>'Database user is not valid','code'=>400,'EVersion'=>'E.5.0'];
					}
				}else{
					$this->IsError = true;
					$this->response = ['status'=>false,'data'=>'Database user not found','code'=>400,'EVersion'=>'E.6.0'];
				}
			}

			if($this->IsError == false){
				if(array_key_exists("pass",$data)){
					$this->db_pass = $data['pass'];
				}else{
					$this->db_pass = null;
				}
			}
		}

		private function secure_get_conn(){
			if($this->IsError != false){
				return $this->response;
			}

			try {
				$this->db_conn = new PDO("mysql:host=".$this->db_host.";dbname=".$this->db_name,$this->db_user,$this->db_pass);
				$this->db_conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
				$this->response = ['status'=>true,'data'=>$this->db_conn,'code'=>200];
			} catch (PDOException $e) {
				$this->IsError = true;
				if($this->debug  == true){
					$this->response = ['status'=>false,'data'=>'Something going wrong','code'=>400,'EVersion'=>'E.7.0','reason'=>$e];
				}else{
					$this->response = ['status'=>false,'data'=>'Something going wrong','code'=>400,'EVersion'=>'E.7.0'];

				}
			}
			return $this->response;
		}

		public function get_conn(){
			return $this->secure_get_conn();
		}
	}

?>