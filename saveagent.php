
<DOCTYPE! html>
<html>
    <head>
<title>
Save Conexus Agent Profile
    </title>
</title>
<style>
    .header
    {
        border: 2px solid #444444;
    }
    .headerDiv
{
    position:absolute;
    left:30px;
    top:30px;
    font-family: 'terminal','Courier New';
    color:#333333;
    border: 7px solid #660000;
    border-radius: 8px;
    padding: 5px;
    width: 300px;
}

.genTxt
{ 
    font-family: 'terminal','Courier New';
    color:#888888;
    border: 4px solid #660000;
    border-radius: 8px;
    padding: 5px;
    cursor: pointer;
}
</style> 
   
</head>
<body>
<?php
//Start the output buffer.
//ob_start();

//Set PHP headers for CSV output.
//header('Content-Type: text/csv; charset=utf-8');
//header('Content-Disposition: attachment; filename=csv_export.csv');

//Build data array from posted data
//var_dump($_POST);
//echo("Post Data : <br>" . var_dump($_POST));

//var $agentdata[];
//var $num=count($_POST);
//echo("<br>Items : " . $num);

echo("<br>Agent Id : " . $_GET[0]);
//$agentdata[i]=$_POST[$i];


?>

</body>
</html>