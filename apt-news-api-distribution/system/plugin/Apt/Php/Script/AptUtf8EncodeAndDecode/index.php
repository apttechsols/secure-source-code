<?php
	/*
	*@filename AptSpecialCharacterEncode/index.php
	*@des --- 
	*@Author Arpit sharma
	*/

	function AptUtf8Decode($str){
		$data = '';
		foreach (explode(';', $str) as $key1 => $value1) {
			$tmp = preg_replace("/[^0-9]/", '',$value1);
			if($tmp != '' ){
				$data .= chr($tmp);
			}
		}
		return $data;

	}

	function AptUtf8Encode($str) {
	    $str = mb_convert_encoding($str , 'UTF-32', 'UTF-8');
	    $t = unpack("N*", $str);
	    $t = array_map(function($n) { return "&#$n;"; }, $t);
	    return implode("", $t);
	}
?>