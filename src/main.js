export function p5Record(p5, fn, lifecycles){
  let recorder, stream, options;

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
      stream.getVideoTracks()[0].requestFrame();
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
    ({recorder, stream} = setupRecorder.call(this, options));
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
};

function setupRecorder(options) {
  const frameRate =
    (options?.frameRate === "manual" ? 0 : options?.frameRate) ??
    this.getTargetFrameRate();
  const chunks = [];
  const stream = (
    options?.source instanceof HTMLCanvasElement ?
      options.source :
      (
        options?.source?.canvas instanceof HTMLCanvasElement ?
          options.source.canvas :
          this.canvas
      )
    ).captureStream(frameRate);
  const recorder = new MediaRecorder(stream, {
    mimeType: options?.mimeType ?? "video/webm;codecs=vp8"
  });

  recorder.addEventListener("start", (e) => {
    console.log("recording started");
  });

  recorder.addEventListener("stop", (e) => {
    const blob = new Blob(chunks);
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "recording.webm";
    link.click();
  });

  recorder.addEventListener("dataavailable", (e) => {
    chunks.push(e.data);
  });

  recorder.addEventListener("pause", (e) => {
    console.log("recording paused");
  });

  recorder.addEventListener("resume", (e) => {
    console.log("recording resumed");
  });

  return {
    recorder,
    stream
  };
}

if(typeof p5 !== "undefined"){
  p5.registerAddon(p5Record);
}
