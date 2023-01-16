<?php
	/*
	*@filename  AptPhpScriptDeleteTable/index.php
	*@des ---
	*@Author Arpit sharma
	*/

	function AptPhpScriptDeleteTable($Data = array()){
		$DefaultCheckType = 'Equal';
		foreach ($Data as $key => $value) {
			${$key} = $value;
		}

		if($Table == '' || $DbCon == '' || $DbName == '' || ($DefaultCheckType != 'Equal' && $DefaultCheckType != 'ValLike' && $DefaultCheckType != 'LikeVal' && $DefaultCheckType != 'LikeValLike')){
			return ["status"=>"Error","msg"=>"Invalid Data format detect [Apt Php Script Delete Table]","code"=>400];
		}

		$TableArray = explode("::,::",$Table);
		$TbNmStore = array();
		foreach ($TableArray as $value){
			$TmpTbAry = explode("::::",$value);
			if($TmpTbAry[1] != ''){
				if($TmpTbAry[1] == 'Equal' || $TmpTbAry[1] == 'ValLike' || $TmpTbAry[1] == 'LikeVal' || $TmpTbAry[1] == 'LikeValLike'){
					$TempCheckType = $TmpTbAry[1];
				}else{
					$TempCheckType = $DefaultCheckType;
				}
			}else{
				$TempCheckType = $DefaultCheckType;
			}

			if($TempCheckType == 'Equal'){
				$TmpSrhTbName = $TmpTbAry[0];
			}else if($TempCheckType == 'ValLike'){
				$TmpSrhTbName = $TmpTbAry[0].'%';
			}else if($TempCheckType == 'LikeVal'){
				$TmpSrhTbName = '%'.$TmpTbAry[0];
			}else if($TempCheckType == 'LikeValLike'){
				$TmpSrhTbName = '%'.$TmpTbAry[0].'%';
			}

			$results = $DbCon->query("select TABLE_NAME from information_schema.tables WHERE TABLE_SCHEMA = '$DbName' AND TABLE_NAME LIKE '$TmpSrhTbName'");
			if($results->rowCount() > 0){
				foreach ($results->fetchAll() as $value_like) {
					$TbNmStore[$DbName.'.'.$value_like->TABLE_NAME] = 1;
				}
				continue;
			}else{
				return ["status"=>"Error","msg"=>"Some Table Not found [Apt Php Script Delete Table]","code"=>404];
				break;
			}
		}
		$TmpTbName = '';
		foreach ($TbNmStore as $key => $value) {
			$TmpTbName .= ", $key";
		}
		$TmpTbName = trim($TmpTbName, ', ');

		$sql = $DbCon->query("DROP TABLE if exists $TmpTbName");
    	if($sql->execute() === TRUE){
    		return ["status"=>"Success","msg"=>"All table deleted Successfully [Apt Php Script Delete Table]",'deletetable'=>sizeof($TbNmStore),"code"=>200];
    	}else{
    		return ["status"=>"Error","msg"=>"Table can not deleted due t technical error [Apt Php Script Delete Table]",'deletetable'=>0,'reason'=>json_encode($sql->errorinfo()),"code"=>400]; exit();
    	}
	}
?>