let databaseColours, computerColours, myRound, myColours, pickedColour, newColour, myIds, myEvals, gameOver, gameResult, repeatColour;

function generateIds() {
  myIds = [];
  for (let j=1; j<7; j++) {
    myIds.push([])
  }

  for (let j=1; j<7; j++) {
    for (let i=1; i<5; i++) {
      myIds[j-1].push(`js${j}_${i}`);
    }
  }
}

function generateEvals() {
  myEvals = [];
  for (let i=1; i<7; i++) {
    myEvals.push([])
  }

  for (let j=1; j<7; j++) {
    for (let i=1; i<5; i++) {
      myEvals[j-1].push(`jse${j}_${i}`);
    }
  }
}

function generateColours() {
  databaseColours = ['red', 'green', 'blue', 'yellow', 'white', 'black'];
  /* randomly generate 4 secret colours */
  computerColours = [];
  let n = 6;
  for (let i=0; i<4; i++) {
    let randomNumber = Math.floor(Math.random() * n);
    computerColours.push(databaseColours[randomNumber])
    databaseColours.splice(randomNumber, 1);
    n--;
  }

}
function prepareColourArray() {
  /* my colours will be stored here */ 
  myColours = [];
  for (let i=0; i<4; i++) {
    myColours.push(null);
  }
}

function pickColour(colour) {
  newColour = colour;
}

function enterColour(myId) {
  document.getElementById('notify-tab').style.display = 'none';

  if (gameOver === false) {
    for (let i=0; i<6; i++) {
      if ((myRound === i) && (myIds[i].includes(myId))) {
        document.getElementById(myId).style.backgroundColor = newColour;
        myColours[(parseInt(myId.split('_')[1], 10)) - 1] = newColour;
      }
    }
  }

  repeatColourCheck();
  if ((!myColours.includes(null)) && (repeatColour === false)) {
    confirmButtonGray('no');
  } else {
    confirmButtonGray('yes');
  }
  
  /* reset button after evaluating */
 
}

function evaluateRound() {

  if (gameOver === false) {
    repeatColourCheck();
    
    if (myColours.includes(null)) {  /* if there is an empty field */
      notificationMessage('four colours !') 
      return;
    } else if (repeatColour === true) { /* check if the colours repeat in my selection */ 
      notificationMessage('four different colours !')
      return;
    }
  
    if (myRound < 5) {
      compareColours(); /* evaluate round */
      myRound ++;
      document.getElementById('instructions').style.display = 'none';
      if (gameOver === false) {
        document.getElementById(`js_myRow${myRound+1}`).style.display = 'flex';
        confirmButtonGray();
      }
    } else if (myRound === 5) {
      compareColours(); 
     
      if (gameResult === 'win' ) {
        notificationGameOver('win');
      } else {
        notificationGameOver('defeat');
      }
    
      startAgainButton();

    }  
    prepareColourArray();
  }
}

function repeatColourCheck() {
  repeatColour = false; /* check if the colours repeat in my selection */ 
    for (let j=0; j<4; j++) {
      for (let i=0; i<4; i++) {
        if ((myColours[i] === myColours[j]) && (i !== j)) {
          repeatColour = true;
        } 
      }
    }
}

function confirmButtonGray(value) {
  if (value === 'yes') {
    document.getElementById('confirm-button').style.border = '2px rgb(145, 145, 145) solid';
    document.getElementById('confirm-button').style.color= 'rgb(145, 145, 145)';
  } else if (value === 'no') {
    document.getElementById('confirm-button').style.border = '2px rgb(207, 193, 67) solid';
    document.getElementById('confirm-button').style.color= 'rgb(207, 193, 67)';
  }
}

function newGame() {
  gameOver = false;
  gameResult = 'defeat';
  myRound = 0;
  prepareColourArray();
  generateColours();
  for (let i=2; i<7; i++) {
    document.getElementById(`js_myRow${i}`).style.display = 'none';
  }

  for (let i=1; i<5; i++) {
    document.getElementById(`js_computer${i}`).style.backgroundColor = 'rgb(207, 193, 67)';
    document.getElementById(`js_computer${i}`).innerHTML='?';
  }

  for (let j=0; j<6; j++) {
    for (let i=0; i<4; i++) {
      document.getElementById(myIds[j][i]).style.backgroundColor = 'rgb(104, 53, 38)';
      document.getElementById(myEvals[j][i]).style.backgroundColor = 'rgb(104, 53, 38)';
    }
  }
  document.getElementById('notify-tab').style.display = 'none';
  document.getElementById('final-screen').style.display = 'none';
  document.getElementById('colour-picker').style.display = 'flex';
  confirmButtonGray('yes');
  document.getElementById('instructions').style.display = 'flex';
}

function compareColours() {
  
  /* first check if we won the game */
  let correctPositionCount = 0;
  for (i=0; i<4; i++) {
    if (myColours[i] === computerColours[i])
      correctPositionCount++;
    }
  if (correctPositionCount === 4) {
    for (let i=1; i<5; i++) {
      if (correctPositionCount > 0) {
        document.getElementById(`jse${myRound+1}_${i}`).style.backgroundColor = 'black';
        correctPositionCount--;
      }
    }
    gameResult = 'win';
    notificationGameOver('win');
  /* else check all colours for evaluation */
  } else if (gameOver === false) {
    confirmButtonGray('yes');
    /* corect colours in wrong position */
    let wrongPositionCount = 0;
    for (let i=0; i<4; i++) {
      for (let j=0; j<4; j++) {
        if ((myColours[i] === computerColours[j]) && (i !== j)) {
              wrongPositionCount++;
            }
        }
    }
    
    for (let i=1; i<5; i++) {
      if (correctPositionCount > 0) {
        document.getElementById(`jse${myRound+1}_${i}`).style.backgroundColor = 'black';
        correctPositionCount--;
      } else if (wrongPositionCount > 0) {
        document.getElementById(`jse${myRound+1}_${i}`).style.backgroundColor = 'white';
        wrongPositionCount--;
        }
    } 
  }
}

function notificationMessage(message) {

  document.getElementById('notify-tab').style.display = 'flex';
  document.getElementById('notify-tab').style.backgroundColor = 'red';
  document.getElementById('notify-line1').innerHTML = 'Please select';
  document.getElementById('notify-line2').innerHTML = message;
}

function notificationGameOver(result) {
  gameOver = true;
  revealColours();
  startAgainButton();
  if (result==='win') {
    document.getElementById('notify-tab').style.display = 'flex';
    document.getElementById('notify-tab').style.backgroundColor = 'green';
    document.getElementById('notify-line1').innerHTML = 'Congratulations !';
    document.getElementById('notify-line2').innerHTML = 'You have found all colours !';
    
  } else if (result==='defeat') {
    document.getElementById('notify-tab').style.display = 'flex';
    document.getElementById('notify-tab').style.backgroundColor = 'red';
    document.getElementById('notify-line1').innerHTML = 'You lose !';
    document.getElementById('notify-line2').innerHTML = 'Better luck next time !';
  }
}

function revealColours() {
  for (let i=1; i<5; i++) {
    document.getElementById(`js_computer${i}`).style.backgroundColor = computerColours[i-1];
    document.getElementById(`js_computer${i}`).innerHTML='';
  }
}

function startAgainButton() {
  document.getElementById('colour-picker').style.display = 'none';
  document.getElementById('final-screen').style.display = 'flex';
}

function resignGame() {
  if ((myRound <= 5) && (gameOver === false)) {
    document.getElementById('colour-picker').style.display = 'none';
    document.getElementById('resign-or-not').style.display = 'flex';
  }
}

function resign_yes() {
  document.getElementById('resign-or-not').style.display = 'none';
  document.getElementById('final-screen').style.display = 'flex';
  notificationGameOver('defeat');
}

function resign_no() {
  document.getElementById('resign-or-not').style.display = 'none';
  document.getElementById('colour-picker').style.display = 'flex';
}

generateIds();
generateEvals();
newGame();