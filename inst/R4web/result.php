<h2>Results</h2>
<?php
$task = $_GET["task"];
$filename = "tasks/".$task."/index.html";
//echo "Variable por get".$task;

if(!file_exists($filename)) {
	echo "<p>Processing, please wait for the result.<p>";
	echo "<img src='images/progressdot.gif'>";
	$redirect="Location:index.php?task=".$task;
	$url="index.php?task=".$task;
	header( "refresh:3;url=$url" );
} else{
	//echo "<p>Aquí saldría el resultado deseado, se parsearan los resultados 
	//	se mostraran y se borrarian los archivos generados<p>";
	echo '<iframe onload="this.style.height=this.contentDocument.body.scrollHeight+\'px\';" src="'.$filename.'" scrolling="no" allowfullscreen></iframe>';
}
?>
