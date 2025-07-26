import { SequenceRecorder, imageTypesMap } from "./SequenceRecorder";

export class Recorder {
  #stream;
  #recorder;

  constructor(options) {
    const frameRate = options.frameRate === "manual" ? 0 : options.frameRate;
    const chunks = [];
    const canvas = (
      options.source instanceof HTMLCanvasElement ?
        options.source :
        options.source.canvas
    );
    const stream = canvas.captureStream(frameRate);
    let recorder;
    if(Object.keys(imageTypesMap).includes(options.mimeType)){
      recorder = new SequenceRecorder(canvas, options.mimeType, frameRate);
    }else{
      recorder = new MediaRecorder(stream, {
        mimeType: options.mimeType ?? "video/webm;codecs=vp8"
      });
    }

    recorder.addEventListener("start", (e) => {
      console.log("recording started");
    });

    recorder.addEventListener("stop", (e) => {
      let blob, filename;

      if(this.#recorder instanceof SequenceRecorder){
        blob = e.detail.blob;
        filename = "recording.zip";
      }else{
        blob = new Blob(chunks);
        filename = "recording.webm";
      }

      const executeDefault = typeof options?.stopCallback === "function" ?
        options?.stopCallback(blob) :
        true;

      if(executeDefault){
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        link.click();
      }
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

    this.#recorder = recorder;
    this.#stream = stream;
  }

  get state() {
    return this.#recorder.state;
  }

  start() {
    this.#recorder.start();
  }

  stop() {
    this.#recorder.stop();
  }

  pause() {
    this.#recorder.pause();
  }

  resume() {
    this.#recorder.resume();
  }

  frame() {
    if(this.#recorder instanceof SequenceRecorder){
      this.#recorder.frame();
    }else{
      this.#stream.getVideoTracks()[0].requestFrame();
    }
  }
}