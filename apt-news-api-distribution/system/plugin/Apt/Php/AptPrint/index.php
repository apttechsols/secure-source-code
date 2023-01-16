<?php
	/*
	@Note-> User ( //foreach (get_defined_vars() as $SetVarKey=>$SetVarVal){ if($SetVarKey !== 'NotUnsetVarName'){ unset($$SetVarKey); }} unset($SetVarKey,$SetVarVal);  ob_end_clean(); // Unset all vars ) before call return_response function to unset all veriables

	Use -> AptPrint(['msg'=>'This is my msg','status'=>'Success','code'=>200,'IsExit'=>true,'type'=>'Json']);
	*/
	
	function AptPrint($AptPrint = array()){
		$status = 'Error'; $code = 400; $IsExit = true; $type = 'Json';
		foreach ($AptPrint as $key => $value) {
			${$key} = $value;
		}
		if($status == '' || $code == '' || $IsExit == '' || $type == ''){
			echo json_encode(['status'=>'Error','msg'=>'Invalid data sent [AptPrint]','code'=>400]); exit();
		}
		if($msg == ''){
			$Status = 'Error';
			$msg = 'No Msg Found';
		}

		if($type == 'Json'){
			$Response = array();
			$Response['status'] = $status;
			$Response['msg'] = $msg;
			$Response['code'] = $code;
			ob_end_clean();
			if($IsExit == true){
				echo json_encode($Response);
				exit();
			}else{
				echo json_encode($Response);
			}
		}else{
			return ['status'=>'Error','msg'=>'Invalid type detect [AptPrint]','code'=>400];
		}
	}
?>