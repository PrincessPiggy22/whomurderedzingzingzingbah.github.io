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

const character1 =[You,Bling,You,Bling,You,Bling];
const dialouge1 = ["&quot;What happened?&quot;","&quot;Zing Zing Zingbah's dead&quot;","&quot;Who are you?&quot;","&quot;Blingbah, I run the casino&quot;","&quot;Gambling?&quot;","&quot;Not for You&quot;"];

goThruDialouge("roomText", dialouge1, character1);