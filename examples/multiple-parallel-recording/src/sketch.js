let graphics = [];
let colors = [];
let recorders = [];
let startBtn, stopBtn, pauseBtn, resumeBtn;

function setup() {
  createCanvas(400, 400);
  background(200);

  for(let i=0; i<4; i++){
    graphics.push(createGraphics(400, 400));
    colors.push(color(random(255), random(255), random(255)));

    const options = {
      source: graphics[i]
    }
    recorders.push(createRecording(options));
  }

  startBtn = select("#start-recording");
  stopBtn = select("#stop-recording");
  pauseBtn = select("#pause-recording");
  resumeBtn = select("#resume-recording");

  startBtn.mouseClicked(() => {
    recorders.forEach((recorder) => {
      recorder.start();
    });
  });
  stopBtn.mouseClicked(() => {
    recorders.forEach((recorder) => {
      recorder.stop();
    });
  });
  pauseBtn.mouseClicked(() => {
    recorders.forEach((recorder) => {
      recorder.pause();
    });
  });
  resumeBtn.mouseClicked(() => {
    recorders.forEach((recorder) => {
      recorder.resume();
    });
  });
}

function draw() {
  line(mouseX, mouseY, pmouseX, pmouseY);

  for(let j=0; j<2; j++){
    for(let i=0; i<2; i++){
      const graphic = graphics[j*2+i];
      graphic.background(0);
      graphic.fill(colors[j*2+i]);
      graphic.push();
      graphic.translate(200, 200);
      graphic.rotate(frameCount/10);
      graphic.rect(-100, -100, 200, 200);
      graphic.pop();

      image(graphic, i * 200, j * 200, 200, 200);
    }
  }
}

function keyTyped() {
  if(key === "a"){
    recorders.forEach((recorder) => {
      recorder.start();
    });
  }else if(key === "s"){
    recorders.forEach((recorder) => {
      recorder.stop();
    });
  }else if(key === "d"){
    recorders.forEach((recorder) => {
      recorder.pause();
    });
  }else if(key === "f"){
    recorders.forEach((recorder) => {
      recorder.resume();
    });
  }
}