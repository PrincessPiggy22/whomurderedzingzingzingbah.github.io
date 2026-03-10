

// SET UP
// function to be able to click thru dialouge
function goThruDialouge(id, array) {

  let index = 0;
  document.getElementById(id).textContent = array[0];

  document.addEventListener("click", function() {
  index++;

  if(index < array.length) {

    document.getElementById(id).textContent = array[index];
    
  }
});
};

const inventory = [];

// Start Button
document.getElementById("start").onclick = function() {

  window.location.href = "rooms/intro.html";

};

// Player Room
// Starting Dialouge
const dialouge1 = ["*Insert Boohbah Screaming as their being murdered noises*" , "That sounded like it's coming from the Dome Car","I should get my key and check it out", " "];
goThruDialouge("roomText", dialouge1);



// if key not in inventory --> don't open door 










