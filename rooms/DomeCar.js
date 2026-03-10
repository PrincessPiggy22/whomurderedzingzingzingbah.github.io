
let done = 0;


function goThruDialouge(id, array, characters) {

  let index = 0;
  document.getElementById(id).innerHTML = array[0];
  document.getElementById("characterImage").src = characters[0];

  document.addEventListener("click", function() {
  index++;

  if(index < array.length) {

    document.getElementById(id).innerHTML = array[index];
    document.getElementById("characterImage").src = characters[index];
    
  }
  if(index == array.length){
    await.sleep(2000)
    window.location.href = "WhatAnUndertale.html";
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



