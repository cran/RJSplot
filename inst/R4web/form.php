<h2>Input data</h2>
<form enctype="multipart/form-data" action="upload.php" method="POST">
<?php 
foreach ($form as $key => $value) {
  echo "<fieldset><legend>$key</legend>";
  switch ($value[0]) {
    case "file":
?>
  <input type="hidden" name="MAX_FILE_SIZE" value="100000" />
  <input name="<?php echo $key; ?>file" type="file" />
<?php 
        break;
    case "matrix":
    case "data.frame":
?>
  <input type="hidden" name="MAX_FILE_SIZE" value="100000" />
  <p>Paste here:</p><textarea cols=80 rows=10 name="<?php echo $key; ?>" ></textarea>
  <p>or upload:</p><input name="<?php echo $key; ?>file" type="file" />
<?php 
        break;
    case "numeric":
      echo "<input name=\"$key\" value=\"".$value[1]."\" type=\"number\" />";
        break;
    case "character":
      echo "<input name=\"$key\" value=\"".$value[1]."\" type=\"text\" />";
        break;
    case "simple":
      echo "<select name=\"$key\">";
      foreach($value[2] as $val){
	echo "<option".($val == $value[1] ? " selected=\"selected\" " : " ")."value=\"$val\">$val</option>";
      }
      echo "</select>";
        break;
    case "multi":
      echo "<select multiple name=\"".$key."[]\">";
      foreach($value[2] as $val){
	echo "<option".(in_array($val,$value[1]) ? " selected=\"selected\" " : " ")."value=\"$val\">$val</option>";
      }
      echo "</select>";
        break;
  }
  echo "</fieldset>";
}
unset($value);
?>
<p><input type="submit" value="Run Analysis" /></p>
</form>
<script>
document.querySelector("div#content>form").onsubmit = function(){
  var x = document.querySelectorAll("textarea"),
      ok = true,
      i = 0;
  for (; i < x.length; ++i)
    if(x[i].value!="" && x[i].value.indexOf("\t")==-1)
      ok = false;
  if(!ok){
    alert("You must paste a tab-separated table");
    return false;
  }
}
</script>
