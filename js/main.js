// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine
});

var boxA;
// var boxB;
function readMouseMove(e){
  // ball1 = new Circle(e.clientX, e.clientY, 10, "white");
  // create two boxes and a ground
	boxA = Bodies.rectangle(e.clientX, e.clientY, 80, 80);
	//boxB = Bodies.rectangle(450, 50, 80, 80);
	

// add all of the bodies to the world
}

var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
World.add(engine.world, [boxA, ground]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);
document.onmousemove = readMouseMove;