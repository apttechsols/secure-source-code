<?php
    function apt_validate_v1_common($data=array()){

        if($is_error == false){
            if(isset($data['string'])){
                $string = $data['string'];
            }else{
                $string = '';
            }
        }
        
        if($is_error == false){
            if(isset($data['len'])){
                $tmp = explode(':',$data['len']);
                $min_len = (strlen(intval($tmp[0])) > 0)?intval($tmp[0]) : null;
                $max_len = (strlen(intval($tmp[1])) > 0)?intval($tmp[1]) : null;
            }else{
                $min_len = null; $max_len = null;
            }
        }

        if($is_error == false){
            if(isset($data['accepted_null'])){
                if($data['accepted_null'] == "true"){
                    $accepted_null = true;
                }else{
                    $accepted_null = false;
                }
            }else{
                $accepted_null = false;
            }
        }
        

        if($is_error == false){
            if(isset($data['regex'])){
                if(strlen($data['regex']) > 0){
                    $regex = $data['regex'];
                }else{
                    $regex = null;
                }
            }else{
                $regex = null;
            }
        }

        if($is_error == false){
            if(isset($data['is_numeric'])){
                if($data['is_numeric'] == 'true'){
                    $is_numeric = true;
                }else{
                    $is_numeric = false;
                }
            }else{
                $is_numeric = false;
            }
        }

        if($is_error == false){
            if(isset($data['equal'])){
                $is_equal = true;
                $equal = $data['equal'];
            }else{
                $is_equal = false;
            }
        }
        
        if($is_error == false){
            if(isset($data['equal_strict'])){
                $is_equal_strict = true;
                $equal_strict = $data['equal_strict'];
            }else{
                $is_equal_strict = false;
            }
        }

        if($is_error == false){
            if($accepted_null == true){
                if(strlen($string) == 0){
                    $is_error = true; $response = 1;
                }
            }else{
                if(strlen($string) == 0){
                    $is_error = true;  $response = 0;
                }
            }
        }

        if($is_error == false){
           if($min_len != null){
                if(strlen($string) <  $min_len){
                    $is_error = true; $response = 0;
                }
            }
        }

        if($is_error == false){
           if($max_len != null){
                if(strlen($string) >  $max_len){
                    $is_error = true; $response = 0;
                }
            }
        }

        if($is_error == false){
           if($regex != null){
               if(strlen(preg_replace($regex, '', $string)) != 0){
                $is_error = true; $response = 0;
               }
                // if(!preg_match($regex, $string)){
                //     $is_error = true; $response = 0;
                // }
            }
        }

        if($is_error == false){
           if($is_numeric == true){
                if(!is_numeric($string)){
                    $is_error = true; $response = 0;
                }
            }
        }

        if($is_error == false){
            if($is_equal == true){
                $is_equal_match = false;
                if(is_array($equal)){
                    foreach ($equal as $equal_item){
                        if($string == $equal_item){
                            $is_equal_match = true;
                        }
                    }
                }else{
                    if($string == $equal){
                        $is_equal_match = true;
                    }
                }
                if($is_equal_match == false){
                    $is_error = true; $response = 0;
                }
            }
        }

        if($is_error == false){
            if($is_equal_strict == true){
                $is_equal_strict_match = false;
                if(is_array($equal_strict)){
                    foreach ($equal_strict as $equal_strict_item){
                        if($string === $equal_strict_item){
                            $is_equal_strict_match = true;
                        }
                    }
                }else{
                    if($string === $equal_strict){
                        $is_equal_strict_match = true;
                    }
                }
                if($is_equal_strict_match == false){
                    $is_error = true; $response = 0;
                }
            }
        }

        if($is_error == false){ $response = 1; }

        return $response;
    }

    # use santax
    # apt_validate_v1_common([ here paste conditions ])
    # string = any string and int
    # len = '1:3' or '1' or ':3'
    # accepted_null = true
    # regex '/^[0-9]{1,4}$/'
    # is_numeric = true
    # equal = ['1'] or 1
    # equal_strict = ['1'] or 1
?>