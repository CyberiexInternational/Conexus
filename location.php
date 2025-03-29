<?php

?>
<DOCTYPE! html>

<html>
<head>
    <title>
    <?php
    function getLocData()
    {
        $csvFile = file('/locations/locations.csv');
        $data = [];
        foreach ($csvFile as $line) 
        {
            $data[] = str_getcsv($line);

        }//foreach
    }//close function
    ?>
    </title>
<script language="javascript">

function getElementSizePos(objElement)
{
    //function returning size and position of a given element, returning an array
    //oX,oY,oH,oW (xpos, ypos, height, width)
    xPos=objElement.
    let retArray = (objElement.style.left,objElement.style.top,objElement.style.height,objElement.style.width);
    
    return retArray;
}
</script>

<style>
    .header
    {
        position:absolute;
        top:0px;
        left:0px;
        margin:0px;
        padding:0px;
        width:100px;
        height:100px;
    }

    .locationsummary
    {

    }

</style>
</head>
<body bgcolor="#888888">
<div style="header" id="headerDiv">
    <img id="logoImage" src="logo.png"/>
</div>
<div style="locationsummary">
    <input type="button" value="Click Me" onclick="javascript:alert(document.getElementById('headerDiv').style.height);">
    <input type="button" value="Eat Me" onclick="javascript:getElementSizePos(document.getElementById('headerDiv'));">
    <inpwwut type="button" value="Drink Me" onclick="javascript:document.getElementById('headerDiv').style.top='200px';">
</div>
<?php
$csvFile = file('data/locations.csv');
$data = [];
foreach ($csvFile as $line) 
{
    $data[] = str_getcsv($line);
    ?>
<div>Data line :
    <?php
        echo $data[0][2];
    ?>
</div>
    <?php
}//foreach
?>
</body>
</html>
