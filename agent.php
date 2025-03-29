<DOCTYPE! html>
<html>
    <head>
<title>
Conexus Agents Profile
    </title>
</title>
<style>
    .header
    {
        border: 2px solid #444444;
    }
</style> 
   
</head>
<body>

<?php
$agentarray=[]; 
$row = 1;
$agentId=$_GET["agent"];
#Try to open the Agents data file...
if (($handle = fopen("data/agents.csv", "rw")) !== FALSE) 
{
    #File opened successfully so continue to pull CSV records out one at a time until fgetcsv returns false at end of file
    while (($agentdata = fgetcsv($handle, 1000, ",")) !== FALSE) 
    {
        #Count the number of fields in this record
        $num = count($agentdata);
        #Check to see if the first field (agent ID) matches the id that we've been passed in $_GET
     
        if($agentdata[0]==$agentId)
        {
            #Set the data array to the agent info
            $data=$agentdata;
            #Pull the first field (agent Id)
            echo ("<br><br><br><b>Agent " . $agentdata[0] . "</b><br>&nbsp;<br>");
    
            #Loop through the record and pull each field in turn
            for ($c=0; $c < $num; $c++) 
            {
                echo $agentdata[$c] . "<br/>";
            }//for
            #$agentdata[1]="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
           fputcsv($handle,$agentdata);
        }#if
        $row++;

    }#while

    #$agentdata = fgetcsv($handle, 1000, ",")) !== FALSE
    
    fclose($handle);
  
}#if
else
{
    echo("Open csv file failed");
}
/*
/*
$filename = 'test.txt';
#chmod($filename, 0777);
if (file_exists($filename)) 
{
    chmod($filename, 0777);
    echo "<br>The file $filename exists";
} else 
#{
#    echo "<br>The file $filename does not exist";
#}

                $txt="Hope this fwrite function works.....";
                echo "<br> <b>File Open result : </b>";
                $handle2=fopen($filename, "a+") or die("Unable to open file!");
                #$handle2 = fopen($filename, "rw");
                echo "<br>File Write result : ";
                fwrite($handle2, $txt);
                fclose($handle2);
                echo "<br>File Closed";
                
                $contents="Hope this file_put_contents function works.....";
                $filename = "data/newtest.txt";
                if(!file_put_contents ($contents, $filename)) {
                    // Write failed!
                    echo("File write failed");
                }
                
                ?>
                */
            
/*
$data = [
	['Symbol', 'Company', 'Price'],
	['GOOG', 'Google Inc.', '800'],
	['AAPL', 'Apple Inc.', '500'],
	['AMZN', 'Amazon.com Inc.', '250'],
	['YHOO', 'Yahoo! Inc.', '250'],
	['FB', 'Facebook, Inc.', '30'],
];

$data=[['Agent'],['Name']];


echo("Data array : " . $data(0));
$filename = 'data/agent-test.csv';

// open csv file for writing
$f = fopen($filename, 'a+');

if ($f === false) {
	die('Error opening the file ' . $filename);
}

// write each row at a time to a file
foreach ($data as $row) {
	fputcsv($f, $row);
}

// close the file
fclose($f);
*/
?>
<div class="header">Agent ID:
<?php //echo ($_GET["agent"]);?>
</div>
</body>

</html>    
