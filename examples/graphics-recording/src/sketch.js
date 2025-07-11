let graphic;
let startBtn, stopBtn, pauseBtn, resumeBtn;

function setup() {
  createCanvas(400, 400);
  background(200);

  startBtn = select("#start-recording");
  stopBtn = select("#stop-recording");
  pauseBtn = select("#pause-recording");
  resumeBtn = select("#resume-recording");

  startBtn.mouseClicked(startRecording);
  stopBtn.mouseClicked(stopRecording);
  pauseBtn.mouseClicked(pauseRecording);
  resumeBtn.mouseClicked(resumeRecording);

  graphic = createGraphics(400, 400);

  setRecording({
    source: graphic
  });
}

function draw() {
  line(mouseX, mouseY, pmouseX, pmouseY);
  graphic.background(255);
  graphic.fill(255, 0, 0);
  graphic.push();
  graphic.translate(200, 200);
  graphic.rotate(frameCount/10);
  graphic.rect(-100, -100, 200, 200);
  graphic.pop();
  image(graphic, 100, 100, 200, 200);
}

function keyTyped() {
  if(key === "a"){
    startRecording();
  }else if(key === "s"){
    stopRecording();
  }else if(key === "d"){
    pauseRecording();
  }else if(key === "f"){
    resumeRecording();
  }
}