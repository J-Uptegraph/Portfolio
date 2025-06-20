<html lang="en">
  <head>
    <title>Welcome Request A Print </title>
    <meta name="author" content="Johnathan Uptegraph">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

    <!-- CSS -->
    <link rel="stylesheet" href="JUptegraph.dev/demos/PrintManagerPrintManager.css" type="text/css" media="screen">
    <link href='http://fonts.googleapis.com/css?family=Orienta' rel='stylesheet' type='text/css'>
  </head>
  <body>
    <div class="top clearfix">
      <span class="right">
        <a href="http://johnathanuptegraph.com/IMS222/MyInterest/index.php">Click Return Home...</a>
      </span>
    </div>
    <center>
    <div class="content">
      <div id="menu">
        <ul class="menu">
          <li class="charcoal">
            <a href="index.php">Home</a>
          </li>
          <li class="charcoal1">
            <a href="RequestPrint.php">Request a Print</a>
          </li>
          <!--
          <li class="charcoal">
            <a href="FilamentGuide.php">Filament Guide</a>
          </li>
          <li class="charcoal">
            <a href="AboutTheEnder3.php">About the Ender 3</a>
          </li>
          -->
          <li class="charcoal">
            <a href="ContactMe.php">Contact Me</a>
          </li>
        </ul>
      </div>
    </div>
    
    <div class="divide">
      <h1>Welcome to Request A Print</h1>
      <h2>Upload STL Files or GCode to Print</h2>
    </div>
    <center> 
  <?php
    if(isset($_REQUEST)){
      foreach($_REQUEST as $key => $value) {
        echo '$key='.$key.' - $value='.$value.'<br>';
        $$key=$value;
      }
    }
    $target_dir="MyInterest/Uploads";
    $target_file=$target_dir.basename($_FILES["fileToUpload"]["name"]);
    $uploadOk='yes';
    $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

    // Check if image file is a actual image or fake image
    if(isset($_REQUEST["upload_file"])) {
      $check = filesize($_FILES["fileToUpload"]["tmp_name"]);
      if($check !== false) {
        // Note... this can later be substituted for credentials of the size of the file 
        echo "File exists " .$check["mime"].".";
        $uploadOk='yes';
      } else {
        echo "File is not the right size. ";
        $uploadOk='no';
      }
      // Check if file already exists
      if(file_exists($target_file)){
        echo "Sorry, file already exists. ";
        $uploadOk='no';
      }
      // Check file size
      if ($_FILES["fileToUpload"]["size"] > 50000000) {
        echo "Sorry, your file is too large. ";
        $uploadOk='no';
      }
      // Allow certain file formats
      if($imageFileType != "STL"
        && $imageFileType != "stl"
        && $imageFileType != "Gcode"
        && $imageFileType != "gcode"
        )
      {
        echo "Sorry, only STL, stl, gcode and GCode files are allowed. ";
        $uploadOk='no';
      }
      // Check if $uploadOk is set to 0 by an error
      if($uploadOk=='no'){
        echo "Sorry, your file was not uploaded.";
        // if everything is ok, try to upload file
      } else {
        if(move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)){
          echo "The file ". htmlspecialchars( basename( $_FILES["fileToUpload"]["name"]))." has been uploaded.";
        } else {
          echo "Sorry, there was an error uploading your file.";
        }
      }
    }
    echo '<form name="ThisFormOfCourse" action="'.basename($_SERVER["PHP_SELF"]).'" METHOD="post" ENCTYPE="multipart/form-data">';
    echo '<center><h1 style="margin-top:1em;">Upload STL or gcode File</h1></center>';
    echo '<center><label for="fileToUpload" class="hide">Upload File</label></center>';
    echo '<input type="file" name="fileToUpload" accept=".stl,.STL,.gcode,.Gcode">';
    echo '<br>';
    echo '<input type="submit" name="upload_file" value="upload file">';
    echo '</form>';
    echo '</div>';
    ?>
    </body>
    <footer> 
        <center><div class="footer">
        <p>2020 Johnathan Uptegraph.<br>All Rights Reserved.<br></p>
    </footer>
    </html>