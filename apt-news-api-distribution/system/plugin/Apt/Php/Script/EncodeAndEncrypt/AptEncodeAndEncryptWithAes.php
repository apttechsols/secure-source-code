<?php

	define('AES_256_CBC', 'aes-256-cbc');
	class AptEncodeAndEncryptWithAes{

		private static function Encode_Base64($data){
			$data = str_split($data); 
			$newencoded_string = "";
			for($i = 0; $i<sizeof($data); $i++){
				$newencoded_char = base64_encode($data[$i]);
				$newencoded_string = "$newencoded_string$newencoded_char";
			}
			return $newencoded_string;
		}

		private static function Decode_Base64($data){
			$newdecoded_string = "";
			$i = 0;
			while($i < strlen($data)){
				$newdecoded_char = base64_decode(substr($data, $i, 4));
				$newdecoded_string = "$newdecoded_string$newdecoded_char";
				$i = $i+4;
			}
			return $newdecoded_string;
		}
		private static function Encrypt_AES_256_CBC($data, $key, $padding){
			$Autokey = 'trWRxYxZVrQ3@*$Yo_f7@SlK&^k@u#4MjG6-CuWwXjh?L';
			$iv = '7&nJ@h?c_4=*64^F';
			$encryption_key = hash_hmac("sha512","$key$Autokey$iv","$key$iv$Autokey$iv$key", true);
			// Encrypt $data using aes-256-cbc cipher with the given encryption key and
			// our initialization vector. The 0 gives us the default options, but can
			// be changed to OPENSSL_RAW_DATA or OPENSSL_ZERO_PADDING
			//openssl_encrypt
			$encrypted = openssl_encrypt($data, AES_256_CBC, $encryption_key, $padding, $iv);
			return $encrypted;
		}
		private static function Decrypt_AES_256_CBC($data, $key, $padding){
			$Autokey = 'trWRxYxZVrQ3@*$Yo_f7@SlK&^k@u#4MjG6-CuWwXjh?L';
			$iv = '7&nJ@h?c_4=*64^F';
			$decryption_key = hash_hmac("sha512","$key$Autokey$iv","$key$iv$Autokey$iv$key", true);
			// Encrypt $data using aes-256-cbc cipher with the given encryption key and
			// our initialization vector. The 0 gives us the default options, but can
			// be changed to OPENSSL_RAW_DATA or OPENSSL_ZERO_PADDING
			//openssl_decrypt
			$decrypted = openssl_decrypt($data, AES_256_CBC, $decryption_key, $padding, $iv);
			return $decrypted;
		}
		private static function ShowAptEncodeAndEncryptWithAesErrorMsg($Data = array()){
			foreach ($Data as $key => $value) {
				${$key} = $value;
			}
			if($msg != ''){
				return ['status'=>'Error','msg'=>$msg.' [Apt Encode And Encrypt With Aes]','code'=>'400'];
			}else{
				return ['status'=>'Error','msg'=>'Encode Or Encrypt can not process [Apt Encode And Encrypt With Aes]','code'=>'400'];
			}
		}

		public static function AptEncodeAndEncryptWithAesRun($AptEncodeAndEncryptWithAesRundata = array()){
			$encrypt_method = 'aes_256_cbc'; $decrypt_method = 'aes_256_cbc'; $encode_method = 'base64'; $decode_method = 'base64';
			foreach ($AptEncodeAndEncryptWithAesRundata as $AptEncodeAndEncryptWithAesRundatakey => $AptEncodeAndEncryptWithAesRundatavalue) {
				${strtolower($AptEncodeAndEncryptWithAesRundatakey)} = $AptEncodeAndEncryptWithAesRundatavalue;
			}

			if(($encrypt_method != 'aes_256_cbc') || ($decrypt_method != 'aes_256_cbc') || ($encode_method != 'base64') || ($decode_method != 'base64')){
				return AptEncodeAndEncryptWithAes::ShowAptEncodeAndEncryptWithAesErrorMsg(['msg'=>'Encode Or Encrypt can not process due to invalid data sent [Method]']);
			}
			
			if(strlen($task) < 1){
				return  AptEncodeAndEncryptWithAes::ShowAptEncodeAndEncryptWithAesErrorMsg(['msg'=>'Encode Or Encrypt can not process due to invalid data sent [Task]']);

			}else{
				$task_Array = explode(":",$task);
			}
			
			if($padding == true){
				$padding = 1;
			}else{
				$padding = 0;
			}
			
			foreach ($task_Array as $TaskName){
				if(strtolower($TaskName) == "encode"){
					if($encode_method == 'base64'){
						$data = AptEncodeAndEncryptWithAes::Encode_Base64($data);
					}else{
						return AptEncodeAndEncryptWithAes::ShowAptEncodeAndEncryptWithAesErrorMsg(['msg'=>'Encode Or Encrypt can not process due to invalid data sent [Encode Method]']);
					}
					if($data == null || $data == ""){
						return AptEncodeAndEncryptWithAes::ShowAptEncodeAndEncryptWithAesErrorMsg(['msg'=>'Encode Or Encrypt can not process due to an technical error']);
					}
				}else if(strtolower($TaskName) == "decode"){
					if($decode_method == 'base64'){
						$data =  AptEncodeAndEncryptWithAes::Decode_Base64($data);
					}else{
						return AptEncodeAndEncryptWithAes::ShowAptEncodeAndEncryptWithAesErrorMsg(['msg'=>'Encode Or Encrypt can not process due to invalid data sent [Decode Method]']);
					}
					if($data == null || $data == ""){
						return AptEncodeAndEncryptWithAes::ShowAptEncodeAndEncryptWithAesErrorMsg(['msg'=>'Encode Or Encrypt can not process due to an technical error']);
					}
				}else{
					if(strlen($key) < 32 || strlen($key) > 256){
						return AptEncodeAndEncryptWithAes::ShowAptEncodeAndEncryptWithAesErrorMsg(['msg'=>'Encode Or Encrypt can not process due to invalid data sent [key]']);
					}else if(strtolower($TaskName) == "encrypt"){
						if($encrypt_method == 'aes_256_cbc'){
							$data =  AptEncodeAndEncryptWithAes::Encrypt_AES_256_CBC($data, $key, $padding);
						}else{
							return AptEncodeAndEncryptWithAes::ShowAptEncodeAndEncryptWithAesErrorMsg(['msg'=>'Encode Or Encrypt can not process due to invalid data sent [Encrypt Method]']);
						}
						if($data == null || $data == ""){
							return AptEncodeAndEncryptWithAes::ShowAptEncodeAndEncryptWithAesErrorMsg(['msg'=>'Encode Or Encrypt can not process due to an technical error']);
						}
					}else if(strtolower($TaskName) == "decrypt"){
						if($decrypt_method == 'aes_256_cbc'){
							$data =  AptEncodeAndEncryptWithAes::Decrypt_AES_256_CBC($data, $key, $padding);
						}else{
							return AptEncodeAndEncryptWithAes::ShowAptEncodeAndEncryptWithAesErrorMsg(['msg'=>'Encode Or Encrypt can not process due to invalid data sent [Decrypt Method]']);
						}
						if($data == null || $data == ""){
							return AptEncodeAndEncryptWithAes::ShowAptEncodeAndEncryptWithAesErrorMsg(['msg'=>'Encode Or Encrypt can not process due to an technical error']);
						}
					}else{
						return AptEncodeAndEncryptWithAes::ShowAptEncodeAndEncryptWithAesErrorMsg(['msg'=>'Encode Or Encrypt can not process due to invalid data sent [Task]']);
					}
				}
			}
			return ['status'=>'Success','msg'=>$data,'code'=>200];
		}
	}
	/* 
	How to use :-
		AptEncodeAndEncryptWithAes::AptEncodeAndEncryptWithAesRun(['Task'=>'encrypt' ,'data'=>'Hello', 'key'=>$EPass,'padding'=>false]);
		$Save_VarName = ob_get_contents();
		ob_end_clean(); @Required for right output
	*/
?>				