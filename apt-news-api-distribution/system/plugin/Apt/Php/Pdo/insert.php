<?php
	
	function AptPdoInsert($Data=array()){
		$AcceptNullValue = False;
		
		foreach ($Data as $key=>$value){
			${ $key } = $value;
		}
		
		if(!array_key_exists("InsertData",$Data) or !array_key_exists("DbCon",$Data) or !array_key_exists("TbName",$Data) or $InsertData == '' or $DbCon == '' or $TbName == '' or ($AcceptNullValue != False && $AcceptNullValue != true)){
			return ["status"=>"Error","msg"=>"Invalid Data format detect","code"=>400];
		}
		
		$InsertDataArray = explode("::,::",$InsertData);
		$StmtPreapredData = array();
		$InsertDataOptions = array();
		$StmtInsertKey = '';
		$StmtInsertVal = '';
		foreach ($InsertDataArray as $value) {
			
			if(strpos($value, "::::") != false || $AcceptNullValue==true){
				$TmpInsertDataArray = explode("::::",$value);
			} else{
				return ["status"=>"Error","msg"=>"Null Insert Value not support without AcceptNullValue enable Code -1","code"=>400]; exit();
			}
			
			if(preg_replace("/[^A-Za-z0-9_]/","",$TmpInsertDataArray[0]) !== ""){
				if(preg_replace("/^[ ]/","",$TmpInsertDataArray[1]) != "" || $AcceptNullValue === true){
					if(strtolower($TmpInsertDataArray[1]) == ''){
						$StmtInsertKey .= ', '.$TmpInsertDataArray[0];
						$StmtInsertVal .= ',null';
					}else{
						$StmtInsertKey .= ', '.$TmpInsertDataArray[0];
						$StmtInsertVal .= ', :'.$TmpInsertDataArray[0].'InsertKey';
						$StmtPreapredData[$TmpInsertDataArray[0].'InsertKey'] = $TmpInsertDataArray[1];
					}
				}else{
					return ["status"=>"Error","msg"=>"Null Insert Value not support without AcceptNullValue enable Code -2","code"=>400]; exit();
				}
			}else{
				return ["status"=>"Error","msg"=>"Invalid Insert Key detect","code"=>400]; exit();
			}
		}
		$StmtInsertKey = trim($StmtInsertKey,', ');
		$StmtInsertVal = trim($StmtInsertVal,', ');
		
		$stmt = $DbCon->prepare("INSERT INTO $TbName ($StmtInsertKey) VALUES ($StmtInsertVal)");

		foreach ($StmtPreapredData as $key=>$value) {
			$stmt->bindValue(":".$key, $value, PDO::PARAM_STR);
		}

		if($stmt->execute()){
			if($stmt->rowCount() > 0){
				return ["status"=>"Success","msg"=>'Data Insert Successfully',"code"=>200];
			}else{
				return ["status"=>"Success","msg"=>'Data Insert Proccess done but data not inserted','reason'=>json_encode($stmt->errorinfo()),"code"=>404];
			}
		}else{
			return ["status"=>"Error","msg"=>"Data Not Insert due to technical error",'reason'=>json_encode($stmt->errorinfo()),"code"=>400];
		}
	}
?>