<?php
include 'formdata.php';

   function run_in_background($Command, $Priority = 0)
   {
       if($Priority)
           $PID = shell_exec("nohup nice -n $Priority $Command  > /dev/null 2> /dev/null & echo $!");
       else
           $PID = shell_exec("nohup $Command  > /dev/null 2> /dev/null & echo $!");
       return($PID);
   }

   function is_process_running($PID)
   {
       exec("ps $PID", $ProcessState);
       return(count($ProcessState) >= 2);
   }

$ok = true;
$status = "";
$task = substr(md5(uniqid(rand())),0,20);
mkdir("tasks/".$task);
$destino = "tasks/".$task;
$args = 'dir="'.$destino.'";';
foreach ($form as $key => $value) {
  $secuencia = $_POST[$key];
  switch ($value[0]) {
    case "file":
    case "matrix":
    case "data.frame":
	$archivo = $_FILES[$key."file"]['name'];
	if ($archivo != "") {
		if (copy($_FILES[$key."file"]['tmp_name'],$destino."/".$key)) {
		  $status = $status."<p>file uploaded: <b>".$archivo."</b></p>";
		} else {
		  $status = $status."<p>Error: a file has not been uploaded</p>";
		  $ok = false;
		}
	}else if($secuencia != ""){
		$fh = fopen($destino."/".$key, 'w') or die("can't open file");
		fwrite($fh, $secuencia);
		fclose($fh);
		$status = $status."<p>Pasted sequences has been uploaded: ".$destino."</p>";
	}else{
		$status = $status."<p>Error: Empty input</p>";
		$ok = false;
	}
	$args = $args.$key.'="'.$destino."/".$key.'";';
      break;
    case "numeric":
	$args = $args.$key.'='.($secuencia == "" ? 0 : $secuencia).';';
      break;
    case "multi":
	$args = $args.$key.'=c("'.implode('","',$secuencia).'");';
      break;
    default:
	$args = $args.$key.'="'.$secuencia.'";';
  }
  $status = $status."<p>Parameter introduced</p>";
}

if($ok){
	$comando="Rscript --vanilla command.R '".$args."'";
	run_in_background($comando);
	$redirect="Location:index.php?task=".$task;
	header($redirect);
}else{
  echo $status;
}
?>
