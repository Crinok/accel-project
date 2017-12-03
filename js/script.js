var canvas = document.getElementById("canvas");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
var ctx = canvas.getContext("2d");

var x = document.documentElement.clientWidth / 2, y = document.documentElement.clientHeight / 2;
var vx = 0, vy = 0,
    ax = 0, ay = 0;
var ball;
var ballBorder = [];
var bigCircle;
var radius = canvas.width/4;
var objArray = [];
var frameRate = 20;
var acceleration = 7;
var gravity = 0.97;
var bounciness = 8;
var centerPivotX = canvas.width / 2;
var centerPivotY = canvas.height / 2;

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

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

        for(var i = 0; i < 360; i+=5){
            ballBorder[i] = new drawPoint(i, 1);
        }

        }, frameRate
    );
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

    if (ball.x - ball.radius + ball.dx < 0 || ball.x + ball.radius + ball.dx > canvas.width) {
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

function boundingBoxCheck(){
    if (x < 20) {
        x = 20;
        vx = -vx / bounciness; 
    }

    if (y < 20) {
        y = 20;
        vy = -vy / bounciness; 
    }

    if (x > document.documentElement.clientWidth-20) {
        x = document.documentElement.clientWidth-20;
        vx = -vx / bounciness; 
    }
    if (y > document.documentElement.clientHeight-20) {
        y = document.documentElement.clientHeight-20;
        vy = -vy / bounciness; 
    }   
    
}

function ballCollision() {
    for (var obj1 in objArray) {
        for (var obj2 in ballBorder) {
            if (ball !== obj2 && distanceNextFrame(ball, ballBorder[obj2]) <= 0) {
                // ballCollisionSafety();
                var theta1 = ball.angle();
                var theta2 = ballBorder[obj2].angle();
                var phi = Math.atan2(ballBorder[obj2].y - ball.y, ballBorder[obj2].x - ball.x);
                var m1 = ball.mass;
                var m2 = ballBorder[obj2].mass;
                var v1 = ball.speed();
                var v2 = ballBorder[obj2].speed();

                var dx1F = (v1 * Math.cos(theta1 - phi) * (m1-m2) + 2*m2*v2*Math.cos(theta2 - phi)) / (m1+m2) * Math.cos(phi) + v1*Math.sin(theta1-phi) * Math.cos(phi+Math.PI/2);
                var dy1F = (v1 * Math.cos(theta1 - phi) * (m1-m2) + 2*m2*v2*Math.cos(theta2 - phi)) / (m1+m2) * Math.sin(phi) + v1*Math.sin(theta1-phi) * Math.sin(phi+Math.PI/2);
                var dx2F = (v2 * Math.cos(theta2 - phi) * (m2-m1) + 2*m1*v1*Math.cos(theta1 - phi)) / (m1+m2) * Math.cos(phi) + v2*Math.sin(theta2-phi) * Math.cos(phi+Math.PI/2);
                var dy2F = (v2 * Math.cos(theta2 - phi) * (m2-m1) + 2*m1*v1*Math.cos(theta1 - phi)) / (m1+m2) * Math.sin(phi) + v2*Math.sin(theta2-phi) * Math.sin(phi+Math.PI/2);

                ball.dx = dx1F;                
                ball.dy = dy1F;                
                ballBorder[obj2].dx = dx2F;                
                ballBorder[obj2].dy = dy2F;
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

// function moveBall() {
//     ball.x += ball.dx;
//     ball.y += ball.dy;
// }

function drawPoint(angle, distanceFromCenter){
    var x = centerPivotX + radius * Math.cos(-angle*Math.PI/180) * distanceFromCenter;
    var y = centerPivotY + radius * Math.sin(-angle*Math.PI/180) * distanceFromCenter;

    this.radius = radius;
    this.dx = 3;
    this.dy = 3;
    // mass is that of a sphere, except the constants like PI and 4/3
    // reason for sphere over circle is, well, we're looking at spheres from above, duh
    this.mass = this.radius * this.radius * this.radius;
    this.x = x;
    this.y = y;
    ctx.beginPath();
        ctx.arc(this.x, this.y, 25, 0, 2*Math.PI);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'red';
        ctx.stroke();
        ctx.closePath();

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

function drawObjects() {
    for (var obj in objArray) {
        bigCircle.draw();
        objArray[obj].draw();  
    }

    ball.draw();
}

function draw() {
    clearCanvas();
    boundingBoxCheck();
    ball = new Ball(x, y, 20, "white");
    drawObjects();
    // moveBall();
    moveObjects();
    
    ballCollision();
    wallCollisionBall()
    wallCollision();
    // requestAnimationFrame(draw);
}

bigCircle = new Ball(canvas.width/2, canvas.height/2, radius, 'transparent');
// objArray[objArray.length] = new Ball(canvas.width, canvas.height/2, 20, "transparent");
objArray[objArray.length] = new Ball(canvas.width, canvas.height/2, 20, "red");


function Ball(x, y, radius, ballColor) {
    this.radius = radius;
    this.dx = 3;
    this.dy = 3;
    // mass is that of a sphere, except the constants like PI and 4/3
    // reason for sphere over circle is, well, we're looking at spheres from above, duh
    this.mass = this.radius * this.radius * this.radius;
    this.x = x;
    this.y = y;
    this.color = ballColor;
    this.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
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