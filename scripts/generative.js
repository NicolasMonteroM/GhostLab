const toInteraction = document.querySelector('.toInteraction');
const interaction = document.querySelector('.interaction');

var inc;
var scl = 5;
var cols, rows;

var zoff = 0;

var fr;

var particles = [];

var np;

var flowfield;

var angulo;

var colores;
var colores2;
var colores3;

let activado;

toInteraction.addEventListener('click', function (event) {

    event.preventDefault();

    document.getElementById('interaction').style.height = '100vh';

    window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);

    document.getElementById("interaction").innerHTML = `
    <div class="hidden">
    <form class="interactionForm">
        <button class="interactionForm__btn">
        Generate
        </button>
    </form>
    </div>
    `;

    const interactionForm = document.querySelector('.interactionForm');
    interactionForm.addEventListener('submit', function (event) {

        event.preventDefault();
        interactionWithout.classList.remove('hidden');
        interactionWith.classList.add('hidden');
    });

});

function Particle() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxspeed = 4;
    this.h = 0;

    this.prevPos = this.pos.copy();

    this.update = function () {
        this.vel.add(this.acc);
        this.vel.limit(this.maxspeed);
        this.pos.add(this.vel);
        this.acc.mult(0);
    };

    this.follow = function (vectors) {
        var x = floor(this.pos.x / scl);
        var y = floor(this.pos.y / scl);
        var index = x + y * cols;
        var force = vectors[index];
        this.applyForce(force);
    };

    this.applyForce = function (force) {
        this.acc.add(force);
    };

    this.show = function () {
        stroke(this.h, 255, 255, 25);
        this.h = this.h + 1;
        if (this.h > 255) {
            this.h = 0;
        }
        strokeWeight(1);
        line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
        this.updatePrev();
    };

    this.updatePrev = function () {
        this.prevPos.x = this.pos.x;
        this.prevPos.y = this.pos.y;
    };

    this.edges = function () {
        if (this.pos.x > width) {
            this.pos.x = 0;
            this.updatePrev();
        }
        if (this.pos.x < 0) {
            this.pos.x = width;
            this.updatePrev();
        }
        if (this.pos.y > height) {
            this.pos.y = 0;
            this.updatePrev();
        }
        if (this.pos.y < 0) {
            this.pos.y = height;
            this.updatePrev();
        }
    };
}

function setup() {
    angulo = 3;
    inc = 0.1;
    np = 400;

    setupGeneral();

}

function draw() {

    drawGeneral();
}

function drawGeneral() {
    var yoff = 50;
    for (var y = 0; y < rows; y++) {
        var xoff = 0;
        for (var x = 0; x < cols; x++) {
            var index = x + y * cols;
            var angle = noise(xoff, yoff, zoff) * TWO_PI * angulo;
            var v = p5.Vector.fromAngle(angle);
            v.setMag(1);
            flowfield[index] = v;
            xoff += inc;
            stroke(0, 120);
        }
        yoff += inc;

        zoff += 0.0003;
    }

    for (var i = 0; i < particles.length; i++) {
        particles[i].follow(flowfield);
        particles[i].update();
        particles[i].edges();
        particles[i].show();
    }
}

function setupGeneral() {
    createCanvas(1500, 750);
   
    cols = floor(width / scl);
    rows = floor(height / scl);
    fr = createP('');
    flowfield = new Array(cols * rows);
    for (var i = 0; i < np; i++) {
        particles[i] = new Particle();
    }
    background(0);
    console.log(np);
}
