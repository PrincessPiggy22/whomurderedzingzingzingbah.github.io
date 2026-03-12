

function goThruDialouge(id, array, characters) {

  let index = 0;
  let text = document.getElementById(id);
  text.innerHTML = array[0];
  document.addEventListener("click", function() {
  index++;
  text.style.backgroundColor = "#898989";
  text.style.color = "white";
  text.style.border = "3px solid #575757";

  if(index < array.length) {
    document.getElementById("characterImage").src = characters[index];
    document.getElementById(id).innerHTML = array[index];
    
  }

  if(index == array.length){
    if (index == array.length) {
      document.getElementById("characterImage").src = characters[index];
  setTimeout(() => {
    window.location.href = "ending.html";
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
const character1 =[ZingDead,ZingDead];

const dialouge1 = ["...","&quot;whoops...&quot;",];
console.log("ZingZing time!!!!");
goThruDialouge("roomText", dialouge1, character1);



