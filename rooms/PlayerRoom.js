let done = 0;
function goThruDialouge(id, array) {

  let index = 0;
  document.getElementById(id).textContent = array[0];

  document.addEventListener("click", function() {
  index++;

  if(index < array.length) {

    document.getElementById(id).textContent = array[index];
    done = 0;
    
  }
  if(index == array.length){
    done = 1;
  }
});
};




// Player Room
// Starting Dialouge
const inventory = [];
const dialouge1 = ["*Insert Boohbah Screaming as their being murdered noises*" , "That sounded like it's coming from the Dome Car","I should get my key and check it out", " "];
goThruDialouge("roomText", dialouge1);

const noKeyDialouge = ["I need to unlock the door", ""];
const gotKeyDialouge = ["I have the key", "I can unlock the door now", ""];

document.getElementById("key").onclick = function() {
  inventory.push("key");
  console.log(inventory);
  goThruDialouge("roomText", gotKeyDialouge);

};

document.getElementById("door").onclick = function() {
  if(inventory.includes("key")) {
    console.log("you have the key");
    window.location.href = "DomeCar.html";
  } else {
    console.log("you don't have the key");
    goThruDialouge("roomText", noKeyDialouge);
  }
};
