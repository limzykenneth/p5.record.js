# p5.record.js

Record your p5.js sketch and export it as a video or image sequence.

This p5.js addon library provides a simple interface to record your p5.js sketch into a video or image sequence by using the [`captureStream()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/captureStream) or [`toBlob`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob) APIs of `HTMLCanvasElement`. No external dependencies is included or required with this library.

p5.record.js starts with a set of default configuration that covers the simplest and likely most common use, while also providing additional customization options to achieve additional functionalities:

* Recording at specific defined frame rate, and in supported browsers, full control over [when individual frame capture should happen](https://developer.mozilla.org/en-US/docs/Web/API/CanvasCaptureMediaStreamTrack/requestFrame).
* Record canvas backed objects, such as `p5.Graphics`, and HTML canvas directly.
* Create multiple recordings at the same time.
* Record image sequence.

## Usage
To add p5.record.js to your sketch, include the following script tag in your HTML file:

```html
<script src="https://cdn.jsdelivr.net/npm/p5.record.js@0.1.2/dist/p5.record.min.js"></script>
```

ESM builds are also available either via CDN at https://cdn.jsdelivr.net/npm/p5.record.js@0.1.2-beta.0/dist/p5.record.esm.js or via NPM:

```sh
npm install p5.record.js
```

For different use cases, please check out the `examples/` folder. The available p5.js addon functions are as follow:

* `setRecording(options)` - Set a configuration for recording, accepts an options object as argument. All options are optional. The default configuration (already set without needing to call `setRecording`) is as follow:
  ```js
  options = {
  	frameRate: getTargetFrameRate(),
  	source: canvas.elt,
  	mimeType: "video/webm;codecs=vp8"
  }
  ```
  * `frameRate` - (`Number|"manual"`) If `options.frameRate` is set to a string with value `"manual"`, sketch recording will automatically be tied to each call of `draw()`. This is useful when you have set the sketch to `noLoop()` and is manually calling `redraw()`, only available in supported browsers.
  * `source` - An object containing a property of `canvas` of type `HTMLCanvasElement` (eg. `p5.Graphics` instance) or an `HTMLCanvasElement`.
  * `mimeType` - The container and codec to be used for recording. Currently only a very small set of containers and codecs are supported natively, it is recommended to leave the default and reencode the video after downloading the result. Set this to `image/png`, `image/jpeg`, or `image/webp` to capture image sequence instead of video, will download a zip file instead.
* `startRecording()` - Start recording at specified frame rate.
* `stopRecording()` - Stop recording and download the recording file.
* `pauseRecording()` - Pause recording to be resumed later.
* `resumeRecording()` - Resume previously paused recording.
* `createRecording(options)` - Create an independent recorder instance. See the `Recorder` class below for usage of its return value. Accepts the same `options` object as `setRecording(options)` as argument but `frameRate` and `source` are required.

The library also provides a `p5.Recorder` class for multiple simultaneous recording usage. In p5.js sketches, it is recommended to use `createRecording(options)` factory function to create instance of this class.

### `Recorder` class
* Constructor - `new Recorder(options)` accepts the same options object as `createRecording(options)`, ie. `frameRate` and `source` are required.
* `state` - Recorder state, can be one of `"inactive"`, `"recording"`, or `"paused"`.
* `start()` - Start the recording.
* `stop()` - Stop the recording.
* `pause()` - Pause the recording.
* `resume()` - Resume the recording.
* `frame()` - Record a single frame, to be used in conjunction with `options.frameRate = "manual"`

## Limitations
This library is only designed for canvas backed sketches and objects, recording of other inputs (eg. SVG) is not supported.

Currently the video recording output format is limited to VP8 encoded WebM video file, depending on use case you may need to reencode the video to a different format.

For image sequence recording, PNG, JPEG, and WebP formats are supported (except for Safari which does not support WebP). The image sequence will be downloaded as a Zip file with no compression applied. When capturing image sequence, you are more likely to encounter physical limits such as RAM limits or Zip file limits (archive size is currently limited to 4GB and 65,535 entries, I may implement ZIP64 later but it is a little bit less commonly supported, you may run out of RAM first anyway).

## Future features
* Custom output video formats
* Record as gif