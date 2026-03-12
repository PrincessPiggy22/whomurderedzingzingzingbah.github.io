
function goThruDialouge(id, array, characters) {

  let index = 0;
  let text = document.getElementById(id).innerHTML;
  text = array[0];
  document.addEventListener("click", function() {
  index++;
  if(index == 1 | index == 3 | index == 5){
    document.getElementById("characterImage").src = characters[index];
   document.getElementById("characterImage").style.opacity = "1";
    text.style.backgroundColor = "#0cf100";
    text.style.color = "rgb(0, 0, 0)";
    text.style.border = "3px solid #066b1c";

  }  else if(index == 9){
    document.getElementById("characterImage").src = characters[index];
    document.getElementById("characterImage").style.opacity = "1";
    text.style.backgroundColor = "#f1dd00";
    text.style.color = "rgb(0, 0, 0)";
    text.style.border = "3px solid #ff4eaf";
 
  } else {
    document.getElementById("characterImage").style.opacity = "0";
    text.style.backgroundColor = "898989";
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
    window.location.href = "WhatAnUndertale.html";
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
Hum = "../sprites/Humbah.png";
Jum = "../sprites/Jumbah.png";
Zum = "../sprites/Zumbah.png";
You = "../sprites/you.png"; 
Lorax = "../sprites/Lorax.png";


// Begning convo
const character1 =[You,Bling,You,Bling,You,Bling,You,You,Lorax];
const dialouge1 = ["&quot;What happened?&quot;","&quot;Zing Zing Zingbah's dead&quot;","&quot;Who are you?&quot;","&quot;Blingbah, I run the casino&quot;","&quot;Gambling?&quot;","&quot;No&quot;","&quot;Anyway...&quot;","&quot;Who could've-&quot;","&quot;I am the Lorax, I speak for the trees, I killed the Zingbah, It was MEEEEEEE!!!&quot;"];

console.log("There is an imposter among us");
goThruDialouge("roomText", dialouge1, character1);



