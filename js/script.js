var canvas = document.getElementById("canvas");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
var ctx = canvas.getContext("2d");

var x = document.documentElement.clientWidth / 2, y = document.documentElement.clientHeight / 2;
var vx = 0, vy = 0;
var ax, ay;
var ball;
var bigCircle;
var objArray = [];
var frameRate = 20;
var acceleration = 7;
var gravity = 0.97;

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

function wallCollisionBall() {

    if (ball.x - ball.radius + ball.dx < 0 ||ball.x + ball.radius + ball.dx > canvas.width) {
        ball.dx *= -1;
    }
    if (ball.y - ball.radius + ball.dy < 0 ||
        ball.y + ball.radius + ball.dy > canvas.height) {

        ball.dy *= -1;
    }
    if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;
    }
    if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
    }
    if (ball.x + ball.radius > canvas.width) {
        ball.x = canvas.width - ball.radius;
    }
    if (ball.x - ball.radius < 0) {
        ball.x = ball.radius;
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

function moveObjects() {
    for (var obj in objArray) {
        objArray[obj].x += objArray[obj].dx;
        objArray[obj].y += objArray[obj].dy;
    }
    
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function drawObjects() {
    for (var obj in objArray) {
        bigCircle.draw();
        objArray[obj].draw();
        ball.draw();
    }
}

function draw() {
    clearCanvas();
    drawObjects();
    moveBall();
    moveObjects();
    
    ballCollision();
    wallCollisionBall()
    wallCollision();
    // requestAnimationFrame(draw);
}

bigCircle = new Ball(canvas.width/2, canvas.height/2, canvas.width/4, 'transparent');
// objArray[objArray.length] = new Ball(canvas.width, canvas.height/2, 20, "transparent");
objArray[objArray.length] = new Ball(canvas.width, canvas.height/2, 20, "red");
ball = new Ball(canvas.width/2, canvas.height/2, 20, "white", x, y);



if (window.DeviceMotionEvent != undefined) {
    window.ondevicemotion = function(e) {
        ax = event.accelerationIncludingGravity.x * - acceleration;
        ay = event.accelerationIncludingGravity.y * - acceleration;
    }

    setInterval( function() {
        var landscapeOrientation = window.innerWidth/window.innerHeight > 1;
        if (landscapeOrientation) {
            vx = vx + ay;
            vy = vy + ax;
        } else {
            vy = vy - ay;
            vx = vx + ax;
        }

        vx = vx * gravity;
        vy = vy * gravity;
        y = parseInt(y + vy / 50);
        x = parseInt(x + vx / 50);

        draw();

        }, frameRate
    );
}

function Ball(x, y, radius, ballColor, a, b) {
    this.radius = radius;
    this.dx = a;
    this.dy = b;
    // mass is that of a sphere, except the constants like PI and 4/3
    // reason for sphere over circle is, well, we're looking at spheres from above, duh
    this.mass = this.radius * this.radius * this.radius;
    this.x = x;
    this.y = y;
    this.color = ballColor;
    this.draw = function() {
        ctx.beginPath();
        ctx.arc(Math.round(this.x), Math.round(this.y), this.radius, 0, 2*Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
        ctx.closePath();
    };
    this.speed = function() {
        // magnitude of velocity vector
        return Math.sqrt(this.dx * this.dx + this.dy * this.dy);
    };
    this.angle = function() {
        //angle of ball with the xy plane
        return Math.atan2(this.dy, this.dx);
    };
    this.kineticEnergy = function () {
    // only for masturbation purposes, not rly used for computation.
        return (0.5 * this.mass * this.speed() * this.speed());
    };
    this.onGround = function() {
        return (this.y + this.radius >= canvas.height)
    }
}