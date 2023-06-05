const canvas = document.
    querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const scoreEl = document.querySelector('#scoreEl')
const startGameBtn = document.querySelector('#startGameBtn')
const modalEl = document.querySelector('#modalEl')
const bigScoreEl = document.querySelector('#bigScoreEl')
const levelEl = document.querySelector('#levelEl')

let enemyImage;
let playerImage;
let enemyImages= []

function preloadImages() {
    const enemyImageNames = ["enemy_0.png", "enemy_1.png", "enemy_3.png", "enemy_6.png", "enemy_5.png", "enemy_4.png",
    "enemy_7.png", "enemy_8.png", "enemy_9.png", "enemy_10.png", "enemy_11.png", "enemy_12.png",
    "enemy_13.png", "enemy_14.png", "enemy_15.png", "enemy_16.png", "enemy_17.png", "enemy_18.png", "enemy_19.png",
    "enemy_20.png", "enemy_21.png", "enemy_22.png", "enemy_23.png", "enemy_24.png", "enemy_25.png", "enemy_26.png",
    "enemy_27.png", "enemy_28.png", "enemy_29.png", "enemy_30.png", "enemy_31.png", "enemy_32.png", "enemy_33.png",
    "enemy_34.png", "enemy_35.png", "enemy_36.png", "enemy_37.png", "enemy_38.png", "enemy_39.png", "enemy_40.png",
    "enemy_41.png", "enemy_42.png", "enemy_43.png", "enemy_44.png", "enemy_45.png", "enemy_46.png", "enemy_47.png",
    "enemy_48.png", "enemy_49.png"   /*...more filenames...*/];
    for(let imageName of enemyImageNames) {
        let img = new Image();
        img.src = "images/color/" + imageName;
        enemyImages.push(img)
    }
    
    // enemyImage = new Image();
    // enemyImage.src = "images/enemy1.png";
    playerImage = new Image();
    playerImage.src = "images/hero1.png";
    
    // Repeat this process for all your images
    // e.g., playerImage, projectileImage, etc.
    // playerImage = new Image();
    // playerImage.src = "images/player.png";
    // ...
}
preloadImages();


//player class]
class Player {
    constructor(x, y, radius, color) {
        this.x = x
        this.y =y
        this.radius =radius 
        this.color = color
        this.dx = 0;
        this.dy = 0;
        this.speed = 2;
        this.image = playerImage

    }
    draw() {
        let dx = mouseX - this.x;
        let dy = mouseY - this.y;
        let angle = Math.atan2(dy, dx) + Math.PI / 2;

        c.save();  // save the current state of the context
        c.translate(this.x, this.y);  // move the context to the player's position
        c.rotate(angle);  // rotate the context

        // draw the image with its center at the origin (which is now at the player's position due to the translate)
        c.drawImage(this.image, -this.radius*2, -this.radius*2, this.radius * 4, this.radius * 4);

        c.restore();  // restore the context to its original state
    }
    update() {
        // Prevent the player from moving off the screen
        if (this.x - this.radius + this.dx < 0 || this.x + this.radius + this.dx > canvas.width) {
            this.dx = 0;
        }
        if (this.y - this.radius + this.dy < 0 || this.y + this.radius + this.dy > canvas.height) {
            this.dy = 0;
        }

        // Update position
        this.x += this.dx;
        this.y += this.dy;

        // Draw the player
        this.draw();
    }
}
// projcetile class
class Projectile {
    constructor(x,y,radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI *2, false)
        c.fillStyle = this.color
        c.fill()
    }
    update() {
        // Update position
        this.x += this.velocity.dx;
        this.y += this.velocity.dy;

        // Draw the projectile
        this.draw();
    }
}

//enemy class
class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.image = enemyImages[Math.floor(Math.random() * enemyImages.length)];
    }
    draw() {
        c.save();
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.clip(); // This will clip the image to the circle
        // Draw the image centered on the enemy's position
        c.drawImage(this.image, this.x - this.radius * 1, this.y - this.radius * 1, this.radius * 2, this.radius * 2);
        c.restore();
    }
    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

let mouseX = 0;
let mouseY = 0;

canvas.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});


const friction = 0.99
class Particle {
    constructor(x,y,radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }
    draw() {
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI *2, false)
        c.fillStyle = this.color
        c.fill()
        c.restore()
    }
    update() {
        this.draw()
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha -= 0.01
        
    }
}

class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5;
        this.speed = Math.random() * 3;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fillStyle = 'white';
        c.fill();
    }

    update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
            this.y = 0;
            this.x = Math.random() * canvas.width;
            this.speed = Math.random() * 3;
            this.size = Math.random() * 5;
        }
    }
}

const stars = new Array(200).fill().map(() => new Star());

//define the center of the screen
const x = canvas.width *0.5
const y = canvas.height *0.5

// draw player on screen
let playewr = new Player(x, y, 35, 'white')
//create a group of projectiles
let projectiles = []
let enemies = []
let particles = []

let level = 0;
let enemiesKilled = 0;

function init() {
    player = new Player(x, y, 10, 'white');
    projectiles = [];
    enemies = [];
    particles = [];
    score = 0;
    level = 0;
    enemiesKilled = 0;
    enemiesToSpawn = 5
    scoreEl.innerHTML = score;
    bigScoreEl.innerHTML = score;
}

let spawnIntervalId;
let enemiesToSpawn = 5; // Set initial number of enemies
let newLevelStarted = false; 
//spawn enemies
function spawnEnemies() {
    // This will run enemiesToSpawn number of times
    for (let i = 0; i < enemiesToSpawn; i++) {
        setTimeout(() => {
            const radius = Math.random() * (45 - 10) + 8  //determines the size of the enemy
            let x
            let y
            if (Math.random() < 0.5) {
                x = Math.random() < 0.5 ? 0 -  radius : canvas.width + radius
                y = Math.random() * canvas.height
            } else {
                x = Math.random() * canvas.width
                y = Math.random() < 0.5 ? 0 -  radius : canvas.height + radius
            }
            //random color for enemy
            const color = `hsl(${Math.random() *360}, 50%, 50%)`
            const angle = Math.atan2(canvas.width /2 -y, canvas.height/2 - x)
            const velocity = {
                x: Math.cos(angle),
                y: Math.sin(angle)
            }
            enemies.push(new Enemy(x, y, radius, color, velocity))
            if (newLevelStarted) {
                newLevelStarted = false;
            }
        }, 1000) 
    }
    enemiesToSpawn += 5;
}


//animate objects on screen
let animationId
let score = 0
let lightningTimeout;
function animate() {
    animationId = requestAnimationFrame(animate)
    c.fillStyle = 'rgba(0, 0, 0, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1)
        } else {
            particle.update()
        }
    })
    projectiles.forEach((projectile, index) => {
        projectile.update()
        // remove from screen
        if (projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height){
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
        }
    })
    stars.forEach(star => {
        star.draw();
        star.update();
    });

    if (Math.random() < 0.005 && !lightningTimeout) { // 0.5% chance each frame
        c.fillStyle = 'rgba(255, 255, 255, 0.7)';
        c.fillRect(0, 0, canvas.width, canvas.height);
        lightningTimeout = setTimeout(() => {
            lightningTimeout = null;
        }, 100); // lightning lasts for 100 ms
    }

    enemies.forEach((enemy, index) => {
        enemy.update()
        // remove enemies when they are off screen
        if (
            enemy.x + enemy.radius < 0 ||
            enemy.x - enemy.radius > canvas.width ||
            enemy.y + enemy.radius < 0 ||
            enemy.y - enemy.radius > canvas.height
        ) {
            setTimeout(() => {
                enemies.splice(index, 1)
            }, 0)
        }
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        //player collisions end game
        if (dist - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId)
            modalEl.style.display = 'flex'
            bigScoreEl.innerHTML = score
        }

        //calc dist between enemy and projectile
        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
            // projectile collision detections
            if (dist - enemy.radius - projectile.radius < 1) {

                 // creating explosions
                 for  (let i =0; i < enemy.radius *2; i ++) {
                    particles.push(new Particle(projectile.x, projectile.y, Math.random() *2, enemy.color, 
                    {x: (Math.random() - 0.5) * (Math.random() * 6), 
                     y: (Math.random() - 0.5) * (Math.random() * 6)}))
                }
                if (enemy.radius -10 > 10) {
                    //increase score
                    score += 100
                    scoreEl.innerHTML = score
                    gsap.to(enemy, {
                        radius: enemy.radius - 15
                    })
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1)
                    }, 0)
                } else {
                    score += 250
                    scoreEl.innerHTML = score
                    
                    setTimeout(() => {
                        enemies.splice(index, 1)
                        projectiles.splice(projectileIndex, 1)
                    }, 10)
                }
            }
        }) // End of projectiles.forEach
    }) // End of enemies.forEach

    // In your animate function, after the forEach loop for enemies
    if (enemies.length === 0 && !newLevelStarted) {
        newLevelStarted = true;
        level++;
        levelEl.innerHTML = level;
        // modalEl.style.display = 'flex';
        // bigScoreEl.innerHTML = "Level: " + level;

        // Add a delay before starting the next level
        setTimeout(() => {
            modalEl.style.display = 'none';
            spawnEnemies();
        }, 3000);  // adjust delay as needed
    }
}
//porjectiles shooting method
addEventListener('click', (event) => {
    const angle = Math.atan2(
        event.clientY - player.y,  // Use player's y position
        event.clientX - player.x   // Use player's x position
    );

    const velocity = {
        dx: Math.cos(angle) * 5,  // Adjust speed as needed
        dy: Math.sin(angle) * 5  // Adjust speed as needed
    };

    projectiles.push(new Projectile(player.x, player.y, 5, 'white', velocity));
});

// Keydown event
addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'ArrowUp':
        case 'w':
            player.dy = -player.speed;
            break;
        case 'ArrowDown':
        case 's':
            player.dy = player.speed;
            break;
        case 'ArrowLeft':
        case 'a':
            player.dx = -player.speed;
            break;
        case 'ArrowRight':
        case 'd':
            player.dx = player.speed;
            break;
    }

    // Normalize the velocity vector to ensure consistent speed in all directions
    const length = Math.hypot(player.dx, player.dy);
    if (length > player.speed) {
        player.dx *= player.speed / length;
        player.dy *= player.speed / length;
    }
});

// Keyup event
addEventListener('keyup', function(event) {
    switch(event.key) {
        case 'ArrowUp':
        case 'w':
            if (player.dy < 0) player.dy = 0;
            break;
        case 'ArrowDown':
        case 's':
            if (player.dy > 0) player.dy = 0;
            break;
        case 'ArrowLeft':
        case 'a':
            if (player.dx < 0) player.dx = 0;
            break;
        case 'ArrowRight':
        case 'd':
            if (player.dx > 0) player.dx = 0;
            break;
    }
});
startGameBtn.addEventListener('click', () => {
    init()
    animate()
    clearInterval(spawnIntervalId);
    spawnEnemies()
    modalEl.style.display = 'none'
})
