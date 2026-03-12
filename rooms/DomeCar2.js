    let text = document.getElementById("roomText");
    text.style.backgroundColor = "#f1dd00";
    text.style.color = "rgb(0, 0, 0)";
    text.style.border = "3px solid #ff4eaf";
function goThruDialouge(id, array, characters) {

  let index = 0;

  text.innerHTML = array[0];
  document.addEventListener("click", function() {
  index++;
  //const character1 =[Lorax,Lorax,ZingBorax,Lorax,You,Zing,You,Bling];
  if(index == 0 || index == 1 || index == 3){
    document.getElementById("characterImage").src = characters[index];
   document.getElementById("characterImage").style.opacity = "1";
    text.style.backgroundColor = "#f1dd00";
    text.style.color = "rgb(0, 0, 0)";
    text.style.border = "3px solid #ff4eaf";

  }  else if(index == 2 || index == 5){
    document.getElementById("characterImage").src = characters[index];
    document.getElementById("characterImage").style.opacity = "1";
    text.style.backgroundColor = "#ff5733";
    text.style.color = "white";
    text.style.border = "3px solid #c70039";
 
  } else if(index >= 7){
    document.getElementById("characterImage").src = Bling;
    document.getElementById("characterImage").style.opacity = "1";
    text.style.backgroundColor = "#0cf100";
    text.style.color = "rgb(0, 0, 0)";
    text.style.border = "3px solid #066b1c";
  }
  else {
    document.getElementById("characterImage").style.opacity = "0";
    text.style.backgroundColor = "#898989";
    text.style.color = "white";
    text.style.border = "3px solid #575757";
    
  }
  if(index < array.length) {
    //document.getElementById("characterImage").src = characters[index];
    document.getElementById(id).innerHTML = array[index];
    
  }

  if(index == array.length){
    if (index == array.length) {
      document.getElementById("characterImage").src = characters[index];
  setTimeout(() => {
    window.location.href = "LetsGoGambling.html";
  }, 3000);
}
  }
});
};


const inventory = ["key"];

Bling = "../sprites/Blingbah.png";
Jing = "../sprites/Jingbah.png";
Zing = "../sprites/Zingbah.png";
ZingDead = "../sprites/ZingbahDead.png";
ZingPhil = "../sprites/Philzingzingcollins.png";
ZingBorax = "../sprites/ZingbahBorax.png";
Hum = "../sprites/Humbah.png";
Jum = "../sprites/Jumbah.png";
Zum = "../sprites/Zumbah.png";
You = "../sprites/you.png"; 
Lorax = "../sprites/Lorax.png";


// Begning convo
const character1 =[Lorax,Lorax,ZingBorax,Lorax,You,Zing,You,Bling];
const dialouge1 = ["&quot;NOOOOOOO How could you defeat me!!!!&quot;","&quot;I'll have to use my seceret ultimate mega move!!!&quot;","&quot;THE POWER OF BORAX COMPELLS YOU!!!!!!!&quot;","&quot;NOOOOOOOOOOOOOOOOOOOO!!!!!!&quot;","&quot;I thought you were dead?&quot;","&quot; lol no&quot;","...","&quot;... Gambling time&quot;"];
console.log("plot twist");
goThruDialouge("roomText", dialouge1, character1);



