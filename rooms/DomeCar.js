
function goThruDialouge(id, array, characters) {

  let index = 0;
  let text = document.getElementById(id).innerHTML;
  text = array[0];
  document.addEventListener("click", function() {
  index++;
  if(index == 1){
    document.getElementById("characterImage").src = characters[index];
   text.classList.remove("You-Talk");
   document.getElementById("characterImage").style.opacity = "1";
    text.classList.add("Bling-Talk");
  } else if(index == 3 ){
document.getElementById("characterImage").src = characters[index];
   text.classList.remove("You-Talk");
   document.getElementById("characterImage").style.opacity = "1";
    text.classList.add("Bling-Talk");
  } else if (index == 5){
document.getElementById("characterImage").src = characters[index];
   text.classList.remove("You-Talk");
   document.getElementById("characterImage").style.opacity = "1";
    text.classList.add("Bling-Talk");
  } else if(index == 9){
    text.classList.remove("Bling-Talk", "You-Talk");
    document.getElementById("characterImage").src = characters[index];
    document.getElementById("characterImage").style.opacity = "1";
    text.classList.add("Lorax-Talk");
  } else {
    text.classList.remove("Zing-Talk", "Lorax-Talk", "Bling-Talk");
    document.getElementById("characterImage").style.opacity = "0";
    text.classList.add("You-Talk");
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



