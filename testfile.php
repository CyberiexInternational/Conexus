<?php
/*
$testarray = array(
                array("one","two","three"),
                array("four","five","six")
                );
 $teststring="Fuck!";     

                if($handle=fopen("data/newagents.csv", "a")!==FALSE)
                {
                    echo("<br> <b>File Opened</b>"); 
                    #if(fwrite($handle,$teststring)!==FALSE)
                    #{
                        
                        echo(fwrite($handle,$teststring,5));    
                    echo("<br> <b>File Written</b>");
                    #}
                    fclose($handle);
                    echo("<br> <b>File Closed</b>");
                }#if 
                     
*/
echo "<h2>PHP is Fun!</h2>";
echo "Hello world!<br>";
echo "I'm about to learn PHP!<br>";
echo "This ", "string ", "was ", "made ", "with multiple parameters.";

for($i=0;$i<10;$i++)
{
    echo("<br>Loop number " . $i . ".");
}//for

$myfile = fopen("data/newagents.txt", "r") or die("Unable to open file!");
$txt = "John Doe\n";
fwrite($myfile, $txt);

fclose($myfile);

?>
             