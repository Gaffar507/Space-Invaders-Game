// initial variable declaration
const grid = document.querySelector('.grid');
const result =  document.querySelector('#result');

// custom valiable declaration
let currentShooterIndex = 202;
const width = 15;
let removeInvaders
let direction = 1;
let goingDirection = true;
let aliensRemoved = [];
let resultCount = 0;

//child div create
for (let index = 0; index < 225; index++) {
    const square = document.createElement('div');
    grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll('.grid div')); 
for (let y = 0; y <= 14; y++) {
    squares[y].classList.add('last');
}
// alienInvaders
const alienInvaders = [
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
  ];

squares[currentShooterIndex].classList.add('shooter')

// draw invaders
function drawInvader() {
    for (let index = 0; index < alienInvaders.length; index++) {
        if (!aliensRemoved.includes(index)) {
            squares[alienInvaders[index]].classList.add('invader');
        }
    }
}
drawInvader();

// remove invaders
function remove() {
    for (let index = 0; index < alienInvaders.length; index++) {
        squares[alienInvaders[index]].classList.remove('invader')
    }
}

// move shooter
function moveShooter(e) {
        squares[currentShooterIndex].classList.remove('shooter');
        switch (e.key) {
            case 'ArrowLeft':
                if (currentShooterIndex % width !== 0) {
                    currentShooterIndex -= 1;
                } 
                break;
        case 'ArrowRight':
                    if (currentShooterIndex % width < width -1) {
                        currentShooterIndex += 1;
                    } 
            break;
        }
        squares[currentShooterIndex].classList.add('shooter');
    }
document.addEventListener('keydown', moveShooter);

// move invaders
function moveInvaders() {
    const rightInvader = alienInvaders[alienInvaders.length -1 ] % width === width - 1;
    const leftInvader = alienInvaders[0] % width === 0;
    remove();

    if (rightInvader && goingDirection) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width +1 
            direction = -1
            goingDirection = false
        }
    }
    if (leftInvader && !goingDirection) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width -1
            direction = 1
            goingDirection = true;
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction;
    }
    drawInvader();

    if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
        result.innerHTML = 'GAME OVER!'
        clearInterval(removeInvaders);
        document.removeEventListener('keydown', shoot)
    }
    for (let y = 210; y <= 224; y++) {
        for (let i = 0; i < alienInvaders.length; i++) {
            if (alienInvaders[i] === y) {
                result.innerHTML = 'GAME OVER!'
                clearInterval(removeInvaders);
                document.removeEventListener('keydown', shoot)
            }
        }
    }

    if (aliensRemoved.length === alienInvaders.length) {
        result.innerHTML = 'YOY WIN'
        clearInterval(shooterId)
    }
}
removeInvaders = setInterval(moveInvaders, 200);

//shoot
function shoot(e) {
    let shooterId
    let laserIndex = currentShooterIndex;

    function moveLaser() {
        if (squares[laserIndex].classList.contains('last')) {
            squares[laserIndex].classList.remove('laser');
            clearInterval(shooterId);
        }
        squares[laserIndex].classList.remove('laser');
        laserIndex -= width
        squares[laserIndex].classList.add('laser');

        if (squares[laserIndex].classList.contains('invader')) {
            squares[laserIndex].classList.remove('laser');
            squares[laserIndex].classList.remove('invader');
            squares[laserIndex].classList.add('boom');

            setTimeout(() =>squares[laserIndex].classList.remove('boom'), 100);
            clearInterval(shooterId);

            const alienRemoved = alienInvaders.indexOf(laserIndex);
            aliensRemoved.push(alienRemoved);
            resultCount++;
            result.innerHTML = resultCount;
        }
    }
    switch (e.key) {
        case 'ArrowUp':
            shooterId = setInterval(moveLaser, 50)
            break;
    }
}
document.addEventListener('keydown', shoot);
