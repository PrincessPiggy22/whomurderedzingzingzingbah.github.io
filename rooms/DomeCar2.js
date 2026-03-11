
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
    if (index == array.length) {
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
ZingBorax = "../sprites/ZingbahBorax.png";
Hum = "../sprites/Humbah.png";
Jum = "../sprites/Jumbah.png";
Zum = "../sprites/Zumbah.png";
You = "../sprites/you.png"; 
Lorax = "../sprites/Lorax.png";


// Begning convo
const character1 =[Lorax,Lorax,Zing];
const dialouge1 = ["&quot;NOOOOOOO How could you defeat me!!!!&quot;","&quot;I'll have to use my seceret ultimate mega move!!!&quot;","&quot;THE POWER OF BORAX COMPELLS YOU!!!!!!!&quot;"];

console.log("There is an imposter among us");
goThruDialouge("roomText", dialouge1, character1);



