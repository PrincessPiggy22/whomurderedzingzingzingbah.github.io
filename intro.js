document.getElementById("wakeUpButton").onclick = function() {

  window.location.href = "PlayerRoom.html";

};

// the dream
const dreamTxt = ["You won a lottery allowing you to board the fabled Boohbah express before it opens to the public", "You're first day here was exciting and tired you out", "But you won't remain asleep  for long.."]

let dreamIndex = 0;
document.getElementById("dreamText").textContent = dreamTxt[0];

document.addEventListener("click", function() {

  dreamIndex++;

  if(dreamIndex < dreamTxt.length) {

    document.getElementById("dreamText").textContent = dreamTxt[dreamIndex];
    document.getElementById("dreamText").classList.add("fadeIn");
    
  } else if(dreamIndex === dreamTxt.length) {
    
    document.getElementById("wakeUpButton").classList.add("show");
    
  }
});