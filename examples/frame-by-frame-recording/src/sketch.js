let data;
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

  setRecording({
    frameRate: "manual"
  });
}

function draw() {
  line(mouseX, mouseY, pmouseX, pmouseY);
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