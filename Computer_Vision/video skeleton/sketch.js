let video;
let bodyPose;
let poses = [];
let connections;

let particles = [];


function preload() {
  // Load the bodyPose model
  bodyPose = ml5.bodyPose(() => {
    console.log("Model loaded");
  });
}

function setup() {
  createCanvas(640, 480);

  // Create the video and hide it
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // Start detecting poses in the webcam video
  bodyPose.detectStart(video, gotPoses);
  // Get the skeleton connection information
  connections = bodyPose.getSkeleton();
}

// Callback function for when bodyPose outputs data
function gotPoses(results) {
  // Save the output to the poses variable
  poses = results;
}

function draw() {
  // Draw the webcam video
  drawPixelatedVideo();

  // Draw the skeleton connections
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    for (let j = 0; j < connections.length; j++) {
      let pointAIndex = connections[j][0];
      let pointBIndex = connections[j][1];
      let pointA = pose.keypoints[pointAIndex];
      let pointB = pose.keypoints[pointBIndex];
      // Only draw a line if both points are confident enough
      if (pointA.confidence > 0.1 && pointB.confidence > 0.1) {
        stroke(250, 0, 0, 0);
        strokeWeight(2);
        line(pointA.x, pointA.y, pointB.x, pointB.y);
      }
    }
  }

  // Draw all the tracked landmark points
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      // Only draw a circle if the keypoint's confidence is bigger than 0.1
      if (keypoint.confidence > 0.1) {
        fill(0, 250, 0, 0);
        noStroke();
        circle(keypoint.x, keypoint.y, 10);
      }
    }
  }

for (let i = particles.length - 1; i >= 0; i--) {
  particles[i].update();
  particles[i].display();

  if (particles[i].isFinished()) {
    particles.splice(i, 1);
  }
}

  
  if (poses.length > 0) {
    //get the left and right hand
    let leftHand = createVector(poses[0].keypoints[9].x, poses[0].keypoints[9].y);
    let rightHand = createVector(poses[0].keypoints[10].x, poses[0].keypoints[10].y);
    
    //draw the hands
    ellipse(leftHand.x, leftHand.y,40,40,);
    ellipse(rightHand.x, rightHand.y,40,40,);
    
    //draw line
    strokeWeight(4);
    stroke(255, 0, 0, 0);
    line(leftHand.x,leftHand.y,rightHand.x,rightHand.y);





//Neu
// Abstand zwischen den Händen
let handDistance = dist(leftHand.x, leftHand.y, rightHand.x, rightHand.y);

// Mittelpunkt zwischen den Händen
let centerX = (leftHand.x + rightHand.x) / 2;
let centerY = (leftHand.y + rightHand.y) / 2;



// Abstand auf Anzahl der Partikel übertragen
let spawnCount = int(map(handDistance, 20, 500, 1, 20, true));
let particleSize = map(handDistance, 20, 500, 1, 150, true);

/* let r = map(handDistance, 20, 500, 0, 255, true);
let g = map(handDistance, 20, 500, 100, 120, true);
let b = map(handDistance, 20, 500, 255, 150, true);
 */
// neue Partikel erzeugen
if (frameCount % 15 === 0) {
for (let i = 0; i < spawnCount; i++) {
  particles.push(new Particle(centerX, centerY, particleSize));
}
}






    let leftEllbow = createVector(poses[0].keypoints[7].x, poses[0].keypoints[7].y);
    let leftShoulder = createVector(poses[0].keypoints[5].x, poses[0].keypoints[5].y);

    stroke(0,0,255, 0);
    line(leftHand.x,leftHand.y,leftEllbow.x,leftEllbow.y);
    line(leftShoulder.x,leftShoulder.y,leftEllbow.x,leftEllbow.y);
  }
}


class Particle {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.vx = random(-2, 2);
    this.vy = random(-2, 2);
    this.size = size;
    this.transparency = 255;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.transparency -= 4;
  }

  display() {
    push();
    tint(255, this.transparency);

    copy(
      video,
      this.x - this.size / 2, this.y - this.size / 2,   // Quelle im Video
      this.size, this.size,                              // Größe des Ausschnitts
      this.x - this.size / 2, this.y - this.size / 2,   // Ziel auf Canvas
      this.size, this.size
    );

    pop();
  }

  isFinished() {
    return this.transparency <= 0;
  }
}

function drawPixelatedVideo() {
  background(0);
  video.loadPixels();

  let stepSize = 15;

  for (let y = 0; y < height; y += stepSize) {
    for (let x = 0; x < width; x += stepSize) {
      let index = (x + y * width) * 4;

      let r = video.pixels[index];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];

      fill(r, g, b);
      noStroke();
      rect(x, y, stepSize, stepSize);
    }
  }
}