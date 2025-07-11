import { Recorder } from "./Recorder.js";

export function p5Record(p5, fn, lifecycles){
  let recorder, options;

  const p5VersionSemver = p5.VERSION.split(".")
    .map((n) => parseInt(n));
  if(!(
    p5VersionSemver[0] > 2 ||
    (p5VersionSemver[0] > 2 && p5VersionSemver[1] > 0) ||
    (p5VersionSemver[0] === 2 && p5VersionSemver[1] === 0 && p5VersionSemver[2] >= 3)
  )){
    console.error(`p5.record.js requires p5.js >= 2.0.3`);
    return;
  }

  lifecycles.postdraw = function() {
    if(recorder && recorder.state === "recording" && options?.frameRate === "manual"){
      recorder.frame();
    }
  };

  fn.setRecording = function(opt) {
    if(opt.frameRate === "manual" && !("CanvasCaptureMediaStreamTrack" in window)){
      console.error("Your browser does not support directly specifying frame capture timing with { frameRate: 'manual' }.");
      return;
    }
    options = opt;
  };

  fn.startRecording = function() {
    options = Object.assign({
      source: this.canvas,
      frameRate: this.getTargetFrameRate()
    }, options);
    recorder = new Recorder(options);
    recorder.start();
  };

  fn.stopRecording = function() {
    recorder.stop();
  };

  fn.pauseRecording = function() {
    recorder.pause();
  };

  fn.resumeRecording = function() {
    recorder.resume();
  };

  fn.createRecording = function(options) {
    return new Recorder(options);
  };
};

if(typeof p5 !== "undefined"){
  p5.registerAddon(p5Record);
}

export { Recorder };