const yourShip = document.querySelector('.player');
const playArea = document.querySelector('#main-play-area');
const aliensImg = ['Imagens/monster-1.png', 'Imagens/monster-2.png', 'Imagens/monster-3.png'];
const instructionsText = document.querySelector('.game-instructions');
const startButton = document.querySelector('.start-button');
let alienInterval;

//função que detecta as teclas pressionadas
function flyShip(event) {
    if(event.key === 'ArrowUp'){
        event.preventDefault();
        moveUp();
    } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        moveDown();
    } else if (event.key === ' ') {
        event.preventDefault();
        shoot();
    }
}

//função que movimenta a nave pra cima
function moveUp() {
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
    if(topPosition === '10px'){
        return
    }else{
        let position = parseInt(topPosition);
        position -= 30;
        yourShip.style.top = `${position}px`;
    }
}

//função que movimenta a nave para baixo
function moveDown() {
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
    if(topPosition === '520px'){
        return
    }else{
        let position = parseInt(topPosition);
        position += 30;
        yourShip.style.top = `${position}px`;
    }
}

//script para atirar
function shoot() {
    let laser = createLaserElement();
    playArea.appendChild(laser);
    moveLaser(laser);
}
function createLaserElement() {
    let xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('left'));
    let yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('top'));
    let newLaser = document.createElement('img');
    newLaser.src = 'Imagens/shoot.png';
    newLaser.classList.add('laser');
    newLaser.style.left = `${xPosition}px`;
    newLaser.style.top = `${yPosition - 10}px`;
    return newLaser;    
}
function moveLaser(laser) {
    let laserInterval = setInterval(() => {
        let xPosition = parseInt(laser.style.left);
        let aliens = document.querySelectorAll('.alien');

        aliens.forEach(alien => {
            if(colision(laser,alien)){
                alien.src = 'Imagens/explosion.png';
                alien.classList.remove('.alien');
                alien.classList.add('.dead-alien');
            }            
        });
        xPosition === 340 ? laser.remove() : laser.style.left = `${xPosition + 8}px`;        
    }, 10);
}

//função para criar inimigos aleatórios
function createAliens() {
    let newAlien = document.createElement('img');
    let alienSprite = aliensImg[Math.floor(Math.random() *aliensImg.length)]; //sorteio de imagem
    newAlien.src = alienSprite;
    newAlien.classList.add('alien');
    newAlien.classList.add('alien-transition');
    newAlien.style.left = '370px';
    newAlien.style.top = `${Math.floor(Math.random()* 330)+ 30}px`;
    playArea.appendChild(newAlien);
    moveAlien(newAlien);
}

// função para movimentação dos inimigos
function moveAlien (alien) {
    let moveAlienInterval = setInterval(() => {
        let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));
        if(xPosition <= 50) {
            Array.from(alien.classList).includes('.dead-alien')? alien.remove() : gameOver();
        }
        else{
            alien.style.left = `${xPosition -4}px`;
        }
    },30);
}

//função de colisão
function colision(laser, alien) {
    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let laserBottom = laserTop -20;
    let alienTop = parseInt(alien.style.top);
    let alienLeft = parseInt(alien.style.left);
    let alienBottom = alienTop - 30;

    if(laserLeft != 340 && laserLeft + 40 >= alienLeft) {
        if(laserTop <= alienTop && laserTop >= alienBottom){
            return true;
        }else{
            return false;
        }
    }else {
        return false;
    }
    

}

//inicio do jogo
startButton.addEventListener('click', (event) => {
    playGame();
})
function playGame() {
    startButton.style.display = 'none';
    instructionsText.style.display = 'none';
    window.addEventListener('keydown', flyShip);
    alienInterval = setInterval(() => {
        createAliens();
    }, 2000);
}

//função game over
function gameOver() {
    window.removeEventListener('keydown', flyShip);
    clearInterval(alienInterval);
    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => alien.remove());
    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove());
    setTimeout(() => {
        alert('Game Over!');
        yourShip.style.top = '250px';
        startButton.style.display = 'block'
        instructionsText.style.display = 'block'
    });

}


