<?php
	function ConvertToDayFromSec($seconds){
		$dt1 = new DateTime("@0");
		$dt2 = new DateTime("@$seconds");
		return $dt1->diff($dt2)->format('%a Day : %h Hour : %i Min : %s sec');
	}
?>