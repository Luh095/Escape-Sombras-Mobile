
const container = document.getElementById('gameContainer');
const player = document.getElementById('player');
const monster = document.getElementById('monster');
const door = document.getElementById('door');
const message = document.getElementById('message');
const msgText = document.getElementById('msgText');
const restartBtn = document.getElementById('restartBtn');
const speed = 10;
let playerPos = { x: 10, y: 10 };
let monsterPos = { x: 200, y: 200 };
let level = 1;
let loop;

function setPositions() {
  player.style.left = `${playerPos.x}px`;
  player.style.top = `${playerPos.y}px`;
  monster.style.left = `${monsterPos.x}px`;
  monster.style.top = `${monsterPos.y}px`;
  door.style.left = `${window.innerWidth - 70}px`;
  door.style.top = `${window.innerHeight - 90}px`;
}

function movePlayer(dx, dy) {
  playerPos.x = Math.max(0, Math.min(window.innerWidth - 40, playerPos.x + dx));
  playerPos.y = Math.max(0, Math.min(window.innerHeight - 40, playerPos.y + dy));
  player.style.left = `${playerPos.x}px`;
  player.style.top = `${playerPos.y}px`;
  checkCollision();
}

function move(key) {
  switch (key) {
    case 'ArrowUp': movePlayer(0, -speed); break;
    case 'ArrowDown': movePlayer(0, speed); break;
    case 'ArrowLeft': movePlayer(-speed, 0); break;
    case 'ArrowRight': movePlayer(speed, 0); break;
  }
}

document.addEventListener('keydown', e => move(e.key));

function updateMonster() {
  const dx = playerPos.x - monsterPos.x;
  const dy = playerPos.y - monsterPos.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist > 1) {
    monsterPos.x += (dx / dist) * (1.5 + level);
    monsterPos.y += (dy / dist) * (1.5 + level);
  }
  monster.style.left = `${monsterPos.x}px`;
  monster.style.top = `${monsterPos.y}px`;
  checkCollision();
}

function checkCollision() {
  const monsterRect = monster.getBoundingClientRect();
  const playerRect = player.getBoundingClientRect();
  const doorRect = door.getBoundingClientRect();

  const collidedWithMonster = !(monsterRect.right < playerRect.left || monsterRect.left > playerRect.right || monsterRect.bottom < playerRect.top || monsterRect.top > playerRect.bottom);
  const atDoor = !(doorRect.right < playerRect.left || doorRect.left > playerRect.right || doorRect.bottom < playerRect.top || doorRect.top > playerRect.bottom);

  if (collidedWithMonster) {
    msgText.innerText = 'Game Over';
    message.style.display = 'block';
    cancelAnimationFrame(loop);
  } else if (atDoor) {
    level++;
    msgText.innerText = `Você passou para o nível ${level}!`;
    message.style.display = 'block';
    setTimeout(() => {
      message.style.display = 'none';
      playerPos = { x: 10, y: 10 };
      monsterPos = { x: 200, y: 200 };
    }, 1000);
  }
}

function startGame() {
  setPositions();
  function gameLoop() {
    updateMonster();
    loop = requestAnimationFrame(gameLoop);
  }
  loop = requestAnimationFrame(gameLoop);
}

restartBtn.onclick = () => {
  level = 1;
  playerPos = { x: 10, y: 10 };
  monsterPos = { x: 200, y: 200 };
  message.style.display = 'none';
  startGame();
}

startGame();
