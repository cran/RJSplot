<?php include 'header.php'?>
<div id="content">
<?php
include 'formdata.php';
if(isset($_GET["task"])){
  include 'result.php';
}else{
  include 'form.php';
} ?>
</div>
</body>
</html>
