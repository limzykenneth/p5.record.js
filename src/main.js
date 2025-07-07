export function p5Record(p5, fn, lifecycles){
  let stream, recorder, chunks = [];

  lifecycles.presetup = function() { };
  lifecycles.postsetup = function() {
    stream = this.canvas.captureStream(30);
    recorder = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=vp8"
    });

    recorder.addEventListener("start", (e) => {
      console.log("recording started");
    });

    recorder.addEventListener("stop", (e) => {
      console.log("recording stopped");
      console.log(chunks);
      const blobUrl = URL.createObjectURL(chunks[0]);
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
  };

  lifecycles.predraw = function() { };
  lifecycles.postdraw = function() { };
  lifecycles.remove = function() { };

  fn.startRecording = function() {
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

if(typeof p5 !== "undefined"){
  p5.registerAddon(p5Record);
}
