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
    <form action="saveagent.php" method="GET(" name="newagent" id="newagent">

<div class="genTxt">
Agent Id : &nbsp; <input type="text" size="30" name="agentid"/>
</div>
<div class="genTxt">
AR00 Contact : &nbsp; <input type="text" size="30" name="ar00contact"/>
</div>
<div class="genTxt">
Affiliation : &nbsp; <input type="text" size="30" name="affiliation"/>
</div>
<div class="genTxt">
Location ID : &nbsp; <input type="text" size="30" name="locationid"/>
</div>
<div class="genTxt">X Pos : &nbsp; <input type="text" size="5" name="gridx"/>
</div>
<div class="genTxt">Y Pos : &nbsp; <input type="text" size="5" name="gridy"/>
</div>
<div class="genTxt">
    <input type="submit" value="Submit"/>
</div>
</form>
<?php
?>

</body>
</html>