let data;

function setup() {
  createCanvas(400, 400);
  background(200);
}

function draw() {
  line(mouseX, mouseY, pmouseX, pmouseY);
}

function keyTyped() {
  if(key === "a"){
    startRecording();
  }else if(key === "s"){
    stopRecording();
  }
}