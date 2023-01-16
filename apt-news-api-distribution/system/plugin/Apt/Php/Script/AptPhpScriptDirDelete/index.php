<?php
    /*

    *@filename AptPhpScriptDirDelete/index.php
    *@des ---
    *@Author Arpit sharma
    */

    function AptPhpScriptDirDeleteInside($Data = array()){
        foreach ($Data as $key => $value) {
            ${$key} = $value;
        }
        
        if(!isset($Dir) || $Dir == ''){
            return ["status"=>"Error","msg"=>"Invalid Data format detect [Apt Php Script Dir Delete]"]; exit();
        }

        if (!is_dir($Dir)) {
            return ["status"=>"Error","msg"=>"$Dir is not foud [Apt Php Script Dir Delete]","code"=>400]; exit();
        }
        if (is_dir($Dir)) {
            $objects = scandir($Dir);
            foreach ($objects as $object) {
            if ($object != "." && $object != "..") {
                if (filetype($Dir."/".$object) == "dir") 
                AptPhpScriptDirDeleteInside(['Dir'=>$Dir."/".$object]); 
                else unlink   ($Dir."/".$object);
            }
            }
            reset($objects);
            rmdir($Dir);
        }
    }

    function AptPhpScriptDirDelete($Data = array()){
        foreach ($Data as $key => $value) {
            ${$key} = $value;
        }
        
        if(!isset($Dir) || $Dir == ''){
            return ["status"=>"Error","msg"=>"Invalid Data format detect [Apt Php Script Dir Delete]"]; exit();
        }

        if (!is_dir($Dir)) {
            return ["status"=>"Error","msg"=>"$Dir is not foud [Apt Php Script Dir Delete]","code"=>400]; exit();
        }
        if (is_dir($Dir)) {
            $objects = scandir($Dir);
            foreach ($objects as $object) {
              if ($object != "." && $object != "..") {
                if (filetype($Dir."/".$object) == "dir") 
                AptPhpScriptDirDeleteInside(['Dir'=>$Dir."/".$object]); 
                else unlink   ($Dir."/".$object);
              }
            }
            reset($objects);
            rmdir($Dir);
        }
        return ["status"=>"Success","msg"=>"Given directory delete successfully","code"=>200];
    }
?>