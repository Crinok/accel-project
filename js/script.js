var canvas = document.getElementById("canvas");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
var ctx = canvas.getContext("2d");

var objArray = [];
var paused = false;
var totalKineticEnergy = 0;
var bumped = false;

var leftHeld = false;
var upHeld = false;
var rightHeld = false;
var downHeld = false;

var gravityOn = false;
var dragOn = false;
var soundOn = true;

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


function canvasBackground() {
    // canvas.style.backgroundColor = "rgb(215, 235, 240)";
}

function wallCollision() {
    for (var obj in objArray) {
        if (objArray[obj].x - objArray[obj].radius + objArray[obj].dx < 0 ||
            objArray[obj].x + objArray[obj].radius + objArray[obj].dx > canvas.width) {
            objArray[obj].dx *= -1;
        }
        if (objArray[obj].y - objArray[obj].radius + objArray[obj].dy < 0 ||
            objArray[obj].y + objArray[obj].radius + objArray[obj].dy > canvas.height) {
            objArray[obj].dy *= -1;
        }
        if (objArray[obj].y + objArray[obj].radius > canvas.height) {
            objArray[obj].y = canvas.height - objArray[obj].radius;
        }
        if (objArray[obj].y - objArray[obj].radius < 0) {
            objArray[obj].y = objArray[obj].radius;
        }
        if (objArray[obj].x + objArray[obj].radius > canvas.width) {
            objArray[obj].x = canvas.width - objArray[obj].radius;
        }
        if (objArray[obj].x - objArray[obj].radius < 0) {
            objArray[obj].x = objArray[obj].radius;
        }
    }
}

function ballCollision() {
    for (var obj1 in objArray) {
        for (var obj2 in objArray) {
            if (obj1 !== obj2 && distanceNextFrame(objArray[obj1], objArray[obj2]) <= 0) {
                // ballCollisionSafety();
                var theta1 = objArray[obj1].angle();
                var theta2 = objArray[obj2].angle();
                var phi = Math.atan2(objArray[obj2].y - objArray[obj1].y, objArray[obj2].x - objArray[obj1].x);
                var m1 = objArray[obj1].mass;
                var m2 = objArray[obj2].mass;
                var v1 = objArray[obj1].speed();
                var v2 = objArray[obj2].speed();

                var dx1F = (v1 * Math.cos(theta1 - phi) * (m1-m2) + 2*m2*v2*Math.cos(theta2 - phi)) / (m1+m2) * Math.cos(phi) + v1*Math.sin(theta1-phi) * Math.cos(phi+Math.PI/2);
                var dy1F = (v1 * Math.cos(theta1 - phi) * (m1-m2) + 2*m2*v2*Math.cos(theta2 - phi)) / (m1+m2) * Math.sin(phi) + v1*Math.sin(theta1-phi) * Math.sin(phi+Math.PI/2);
                var dx2F = (v2 * Math.cos(theta2 - phi) * (m2-m1) + 2*m1*v1*Math.cos(theta1 - phi)) / (m1+m2) * Math.cos(phi) + v2*Math.sin(theta2-phi) * Math.cos(phi+Math.PI/2);
                var dy2F = (v2 * Math.cos(theta2 - phi) * (m2-m1) + 2*m1*v1*Math.cos(theta1 - phi)) / (m1+m2) * Math.sin(phi) + v2*Math.sin(theta2-phi) * Math.sin(phi+Math.PI/2);

                objArray[obj1].dx = dx1F;                
                objArray[obj1].dy = dy1F;                
                objArray[obj2].dx = dx2F;                
                objArray[obj2].dy = dy2F;
            }

        }
    }
}
function ballCollisionSafety() { //because i suck at coding proper collision
    for (var obj1 in objArray) {
        for (var obj2 in objArray) {
            if (obj1 !== obj2 &&
                distance(objArray[obj1], objArray[obj2]) < objArray[obj1].radius + objArray[obj2].radius) {
                var theta = Math.atan2((objArray[obj1].y - objArray[obj2].y), (objArray[obj1].x - objArray[obj2].x));
                var overlap = objArray[obj1].radius + objArray[obj2].radius - distance (objArray[obj1], objArray[obj2]);
                objArray[obj1].x += overlap * Math.cos(theta);
                objArray[obj1].y += overlap * Math.sin(theta);
            }
        }
    }
}
function applyGravity() {
    for (var obj in objArray) {
        if (objArray[obj].onGround() == false) {
            objArray[obj].dy += 0.29;
        }   
    }
}
function applyDrag() {
    for (var obj in objArray) {
        objArray[obj].dx *= 0.99
        objArray[obj].dy *= 0.99
    }
}
function moveObjects() {
    for (var obj in objArray) {
        objArray[obj].x += objArray[obj].dx;
        objArray[obj].y += objArray[obj].dy;
    }
    
}

function drawObjects() {
    for (var obj in objArray) {
        objArray[obj].draw();
    }
}

function draw() {
    clearCanvas();
    canvasBackground();
    if (!paused) {
        // arrowControls();
        if (gravityOn) {
            applyGravity();
            applyDrag(); }
        moveObjects();
        }
    drawObjects();
    ballCollision();
    wallCollision();
    // logShit();
    requestAnimationFrame(draw);
}

//setInterval(draw, 1000/60);
objArray[objArray.length] = new Ball(canvas.width/2, canvas.height/2, 20);
// objArray[objArray.length] = new Ball(randomX(), randomY(), randomRadius());
// objArray[objArray.length] = new Ball(randomX(), randomY(), randomRadius());
// objArray[objArray.length] = new Ball(randomX(), randomY(), randomRadius());
// objArray[objArray.length] = new Ball(randomX(), randomY(), randomRadius());

draw();

function logShit() {
    for (var obj in objArray) {
        totalKineticEnergy += objArray[obj].kineticEnergy();
    }
    console.log("kinetic energy:", totalKineticEnergy.toLocaleString());
    totalKineticEnergy = 0;
}

