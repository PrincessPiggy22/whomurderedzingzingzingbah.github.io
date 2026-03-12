

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
  console.log("start game");
  window.location.href = "rooms/intro.html";

};

document.getElementById("test").onclick = function() {
  console.log("testing");
  window.location.href = "rooms/DomeCar4.html";

};


// if key not in inventory --> don't open door 










