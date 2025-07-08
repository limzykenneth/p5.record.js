export function p5Record(p5, fn, lifecycles){
  let recorder, stream, options;

  // check p5.VERSION
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
    const frameRate = options?.frameRate === "manual" ? 0 : options?.frameRate;
    ({recorder, stream} = setupRecorder.call(this, frameRate, options?.mimeType));
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

  function setupRecorder(frameRate, mimeType){
    const chunks = [];
    const stream = this.canvas.captureStream(frameRate ?? this.frameRate());
    const recorder = new MediaRecorder(stream, {
      mimeType: mimeType ?? "video/webm;codecs=vp8"
    });

    recorder.addEventListener("start", (e) => {
      console.log("recording started");
    });

    recorder.addEventListener("stop", (e) => {
      console.log("recording stopped");
      const blob = new Blob(chunks);
      console.log(blob);

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
};

if(typeof p5 !== "undefined"){
  p5.registerAddon(p5Record);
}
