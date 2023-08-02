// client.js
const socket = io();

// the two main divs to interact with
let game = document.getElementById('game')
let join = document.getElementById('joining')

let mainContainer = document.getElementById('mainContainer');
let myClicksDiv = document.getElementById('my-clicks');
let opponentClicksDiv = document.getElementById('opponent-clicks');
let button = document.getElementById('button')

// let standing = document.getElementById('standing')
let initialBird = document.getElementById('initial')
let clicked = document.getElementById('clicked')
let notClicked = document.getElementById('notClicked')
let countdown = document.getElementById('countdown')

let results = document.getElementById('results')

// joining/creating game code
//  

let createBtn = document.getElementById('createBtn')
let joinBtn = document.getElementById('joinBtn')
let createGame = document.getElementById('createGame')
let joinGame = document.getElementById('joinGame')

let createInp = document.getElementById('createInp')
let createAndStartGame = document.getElementById('createAndStartGame')
let joinInp = document.getElementById('joinInp')
let joinAndStartGame = document.getElementById('joinAndStartGame')
let roomDisplay = document.getElementById('roomName');


createAndStartGame.addEventListener('click', () => {
    let room = createInp.value
    socket.emit('joinRoom', room);
	roomDisplay.innerText = `ROOM NAME: ${room}`
    join.style.display = 'none'
    game.style.display = 'block'
})

joinAndStartGame.addEventListener('click', () => {
    let room = joinInp.value
    socket.emit('joinRoom', room);
	roomDisplay.innerText = `ROOM NAME: ${room}`
    join.style.display = 'none'
    game.style.display = 'block'
})

createBtn.addEventListener('click', () => {
    createGame.style.display = 'block'
    createBtn.style.display = 'none'
    joinBtn.style.display = 'none'
})
joinBtn.addEventListener('click', () => {
    joinGame.style.display = 'block'
    createBtn.style.display = 'none'
    joinBtn.style.display = 'none'
})

// 
// end of joining/creating room



socket.on('counterUpdate', (counterValue) => {
    // Update the displayed value with the received counter value
    opponentClicksDiv.textContent = `Opponent's Points: ${counterValue}`;
});

var timeLeft = 10;


function stopGame() {
    mainContainer.style.display = 'none'
    countdown.style.display = 'none'

    results.innerHTML = `
    <h1>SCORES</h1>
    <br>
    <h2>${myClicksDiv.innerText} </h2>
    <h2>${opponentClicksDiv.innerText} </h2>
	<button class='leaveBtn' onclick='window.location.reload()'>Leave Game</button>
    `
}

function openButtons() {
    button.style.pointerEvents = 'auto'

    timeLeft = 30
    function countdownfunc() {
        if (timeLeft == -1) {
            clearInterval(aftercount);
            stopGame()
        } else {
            countdown.innerHTML = timeLeft;
            timeLeft--;
        }
    }

    var aftercount = setInterval(countdownfunc, 1000);

}



socket.on('startCountdown', () => {
    function countdownfunc() {
        if (timeLeft === -1) {
            clearInterval(timerId);
            openButtons();
        } else {
            countdown.innerHTML = timeLeft;
            timeLeft--;
        }
    }

    var timerId = setInterval(countdownfunc, 1000);
});



let counter = 0;


button.addEventListener('mousedown', () => {
    clicked.style.display = 'block'
    initialBird.style.transform = 'translate(0,-10px)'
    notClicked.style.display = 'none'


    counter++;
    myClicksDiv.textContent = `Your Points: ${counter}`
    socket.emit('counterUpdate', counter);
})

button.addEventListener('mouseup', () => {
    clicked.style.display = 'none'
    initialBird.style.transform = 'translate(0,0)'
    notClicked.style.display = 'block'

})