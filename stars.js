//import utils from "./utils"

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

window.addEventListener("resize", function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

// Objects
function Star(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = {
        x: (Math.random() - 0.5) * 8,
        y: 3
    };
    this.friction = 0.8;
    this.gravity = 1;
}

Star.prototype.draw = function() {
    c.save();
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.shadowColor = '#E3EAEF';
    c.shadowBlur = 20;
    c.fill();
    c.closePath();
    c.restore();
}

Star.prototype.update = function() {
    this.draw();

    if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
        this.velocity.y = -this.velocity.y * this.friction;
        this.shatter();
    } else {
        this.velocity.y += this.gravity;
    }

    if (this.x + this.radius + this.velocity.x > canvas.width || this.x - this.radius <= 0) {
        this.velocity.x = -this.velocity.x * this.friction;
        this.shatter();
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;

}

Star.prototype.shatter = function() {
    this.radius -= 3;
    for (let i = 0; i < 8; i++) {
        miniStars.push(new MiniStar(this.x, this.y, 2));
    }

}

function MiniStar(x, y, radius, color) {
    Star.call(this, x, y, radius, color);
    this.velocity = {
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 30
    };
    this.friction = 0.8;
    this.gravity = 0.1;
    this.ttl = 100;
    this.opacity = 1;
}

MiniStar.prototype.draw = function() {
    c.save();
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = `rgba(227,234, 239, ${this.opacity})`;
    c.shadowColor = '#E3EAEF';
    c.shadowBlur = 20;
    c.fill();
    c.closePath();
    c.restore();
}

MiniStar.prototype.update = function() {
    this.draw();

    if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
        this.velocity.y = -this.velocity.y * this.friction;
    } else {
        this.velocity.y += this.gravity;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.ttl -= 1;
    this.opacity -= 0.0001 * this.ttl;
}

// Function to draw a heart
function drawHeart(x, y, size, color) {
    c.save();
    c.fillStyle = color;
    c.beginPath();
    c.moveTo(x, y);
    c.bezierCurveTo(x + size / 2, y - size * 2, x + size * 1.5, y - size * 2, x + size * 2, y);
    c.bezierCurveTo(x + size * 2.5, y + size * 2, x, y + size * 4, x, y + size * 4);
    c.bezierCurveTo(x - size, y + size * 4, x - size * 2.5, y + size * 2, x - size * 2, y);
    c.bezierCurveTo(x - size * 1.5, y - size * 2, x - size / 2, y - size * 2, x, y);
    c.closePath();
    c.fill();
    c.restore();
}

// Implementation
const backgroundGradient = c.createLinearGradient(0, 0, canvas.width, canvas.height);
backgroundGradient.addColorStop(0, '#F73B3B');
backgroundGradient.addColorStop(1, '#EB6B9D');

let stars;
let miniStars;
let backgroundStars;
let ticker = 0;
let randomSpawnRate = 75;
const groundHeight = 0.09 * canvas.height;
let inf = 1e9;

function init() {
    stars = [];
    miniStars = [];
    backgroundStars = [];

    for (let i = 0; i < 200; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 3;
        backgroundStars.push(new Star(x, y, radius, 'white'));
    }
}

// Function to generate random hearts
function generateHearts(count) {
    for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width;
        const y = canvas.height - groundHeight + Math.random() * (canvas.height * 0.3); // Randomize y position within the bottom area of the canvas
        const size = Math.random() * 20 + 10; // Randomize heart size
        drawHeart(x, y, size, '#FF0000');
    }
}

// Animation Loop
function animate() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = backgroundGradient;
    c.fillRect(0, 0, canvas.width, canvas.height);

    backgroundStars.forEach(backgroundStar => {
        backgroundStar.update();
    });

    c.fillStyle = '#281821';
    c.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);

    stars.forEach((star, index) => {
        star.update();
        if (star.radius == 0) {
            stars.splice(index, 1);
        }
    });

    miniStars.forEach((miniStar, index) => {
        miniStar.update();
        if (miniStar.ttl == 0) {
            miniStars.splice(index, 1);
        }
    });

    ticker++;
    if (ticker >= inf) {
        ticker = 0;
    }
    if (ticker % randomSpawnRate == 0) {
        const radius = 9;
        const x = Math.max(radius, Math.random() * canvas.width - radius);
        stars.push(new Star(x, -100, 9, '#F29BCA'));
        randomSpawnRate = Math.floor(Math.random() * (200 - 125 + 1) + 125);
    }

    generateHearts(3); // Generate 3 random hearts each frame

    requestAnimationFrame(animate);
}

init();
animate();
