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

function preloadImages() {
    enemyImage = new Image();
    enemyImage.src = "images/enemy1.png";
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
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
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
        this.image = enemyImage;
    }
    draw() {
        c.save();
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.clip(); // This will clip the image to the circle
        // Draw the image centered on the enemy's position
        c.drawImage(this.image, this.x - this.radius * 1.33, this.y - this.radius * 1.33, this.radius * 2.66, this.radius * 2.66);
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



//define the center of the screen
const x = canvas.width / 2
const y = canvas.height / 2

// draw player on screen
let player = new Player(x, y, 10, 'white')
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
    enemiesToSpawn = 10
    scoreEl.innerHTML = score;
    bigScoreEl.innerHTML = score;
}

let spawnIntervalId;
let enemiesToSpawn = 10; // Set initial number of enemies
let newLevelStarted = false; 
//spawn enemies
function spawnEnemies() {
    // This will run enemiesToSpawn number of times
    for (let i = 0; i < enemiesToSpawn; i++) {
        setTimeout(() => {
            const radius = Math.random() * (30 - 4) + 4
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
function animate() {
    animationId = requestAnimationFrame(animate)
    c.fillStyle = 'rgba(0, 0, 0, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.draw()
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
                if (enemy.radius -10 > 5) {
                    //increase score
                    score += 100
                    scoreEl.innerHTML = score
                    gsap.to(enemy, {
                        radius: enemy.radius - 10
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
addEventListener('click', (event) => 
    {
        const angle = Math.atan2(event.clientY - canvas.height/2, event.clientX - canvas.width/2)
        
        const velocity = {
            x: Math.cos(angle) *5,
            y: Math.sin(angle) *5
        }
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, 5, 'white', velocity)
    )
})

startGameBtn.addEventListener('click', () => {
    init()
    animate()
    clearInterval(spawnIntervalId);
    spawnEnemies()
    modalEl.style.display = 'none'
})