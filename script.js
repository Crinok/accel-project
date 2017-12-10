/*
  matter.js physics engine
http://brm.io/matter-js/docs/
http://brm.io/matter-js/demo/#mixed
  device API's
https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent
https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation

*/

/* var Gx = 0;
var Gy = 0;
Events.on(engine, "afterTick", function(event) {
  engine.world.gravity.y = y * 0.05;
  engine.world.gravity.x = x * 0.05;
}); */

//acceleration isn't working that well so I disabled it
/* window.addEventListener('devicemotion', function(event) {
  engine.world.gravity.y = event.acceleration.y;
  engine.world.gravity.x = event.acceleration.x;
  document.getElementById("accelx").innerHTML =  event.acceleration.x.toFixed(2);
  document.getElementById("accely").innerHTML =  event.acceleration.y.toFixed(2);
  document.getElementById("accelz").innerHTML =  event.acceleration.z.toFixed(2);
}); */

function handleOrientation(event) {
  var x = event.gamma; // In degree in the range [-90,90]
  var y = event.beta; // In degree in the range [-180,180]
  var z = event.alpha; //??

  document.getElementById("gamma").innerHTML = Math.round(x);
  document.getElementById("beta").innerHTML = Math.round(y);
  document.getElementById("alpha").innerHTML = Math.round(z);
  engine.world.gravity.y = y * 0.05;
  engine.world.gravity.x = x * 0.05;
}
window.addEventListener('deviceorientation', handleOrientation);

// module aliases
var Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Events = Matter.Events,
  Composites = Matter.Composites,
  Bodies = Matter.Bodies;

// create an engine
var engine = Engine.create();

var render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: 800,
    height: 600,
    pixelRatio: 1,
    background: '#fafafa',
    wireframeBackground: '#222',
    hasBounds: false,
    enabled: true,
    wireframes: true,
    showSleeping: false,
    showDebug: false,
    showBroadphase: false,
    showBounds: false,
    showVelocity: false,
    showCollisions: false,
    showSeparations: false,
    showAxes: false,
    showPositions: false,
    showAngleIndicator: false,
    showIds: false,
    showShadows: false,
    showVertexNumbers: false,
    showConvexHulls: false,
    showInternalEdges: false,
    showMousePosition: false
  }
});

var stackA = Composites.stack(100, 300, 6, 6, 0, 0, function(x, y) {
  return Bodies.rectangle(x, y, 15, 15);
});

var wall = Bodies.rectangle(400, 300, 500, 20, {
  isStatic: true
});
World.add(engine.world, [stackA, wall]);

var offset = 5;
World.add(engine.world, [
  Bodies.rectangle(400, -offset, 800 + 2 * offset, 50, {
    isStatic: true
  }),
  Bodies.rectangle(400, 600 + offset, 800 + 2 * offset, 50, {
    isStatic: true
  }),
  Bodies.rectangle(800 + offset, 300, 50, 600 + 2 * offset, {
    isStatic: true
  }),
  Bodies.rectangle(-offset, 300, 50, 600 + 2 * offset, {
    isStatic: true
  })
]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);