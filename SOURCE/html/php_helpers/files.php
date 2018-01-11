


<?php
/*header('Content-Type: application/json');*/
/*usage : http://127.0.0.1:8080/php_helpers/files.php?path=../PROJECTS/slideshow/&filetype=jpg */





$dir          = $_GET['path'];
$type          = $_GET['filetype'];

$list = array(); //main array
if (strtolower($_SERVER['HTTP_HOST'])=="127.0.0.1:8080"||strtolower($_SERVER['HTTP_HOST'])=="jonathanrobles.net"){
if(is_dir($dir)){
    if($dh = opendir($dir)){
        while(($file = readdir($dh)) != false){

            if($file == "." or $file == ".." or strpos ( $file,".".$type)==false){
                //...
            } else { //create object with two fields
                $list3 = array(
                'file' => $file,
                    /*'kind' => strpos ( $file,".".$type),*/
                    'size' => filesize($dir.$file));
                array_push($list, $list3);
            }
        }
    }

    $return_array = array('files'=> $list);
    
    echo json_encode($return_array);
}
} else {
   echo '{"error":"Access denied for '. $_SERVER['HTTP_HOST']. '"}' ;
};



?>