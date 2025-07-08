export function p5Record(p5, fn, lifecycles){
  let recorder;

  // check p5.VERSION

  lifecycles.predraw = function() { };
  lifecycles.postdraw = function() { };
  lifecycles.remove = function() { };

  let options;

  fn.setRecording = function(options) {
    // framerate https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/captureStream#framerate
    // mime type
    // recording type (requestFrame() method)
    options = options;

  };

  fn.startRecording = function() {
    recorder = setupRecorder.call(this, options.frameRate, options.mimeType);
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
      link.download = "recording.mp4";
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

    return recorder;
  }
};

if(typeof p5 !== "undefined"){
  p5.registerAddon(p5Record);
}
