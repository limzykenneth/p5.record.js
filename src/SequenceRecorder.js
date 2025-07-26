import { Zip, FileEntry } from "./Zip";

export const imageTypesMap = {
	"image/png": "png",
	"image/jpeg": "jpg",
	"image/webp": "webp"
};

export class SequenceRecorder extends EventTarget {
	#counter = 0;
	#source;
	#images = [];
	#animationFrame;
	#timePerFrame;
	#deltaTime;
	#previousTimestamp;
	#accumulator = 0;
	#mimeType;
	state = "inactive";

	constructor(source, mimeType, frameRate = 60) {
		super();
		this.#source = source;
		this.#timePerFrame = 1000 / frameRate;
		this.#mimeType = mimeType;
	}

	start() {
		this.state = "recording";
		this.dispatchEvent(new CustomEvent("start"));
		this.frame();
	}

	stop() {
		this.state = "inactive";
		if(this.#animationFrame){
			cancelAnimationFrame(this.#animationFrame);
		}

		const buffersPromise = Promise.all(this.#images.map((image) => {
			return image.arrayBuffer();
		}));

		const zip = new Zip();
		buffersPromise.then((buffers) => {
			for(let i=0; i<buffers.length; i++){
				const file = new FileEntry(
					`capture-${String(i+1).padStart(5, "0")}.${imageTypesMap[this.#mimeType]}`,
					new Uint8Array(buffers[i])
				);
				zip.addFile(file);
			}

	        this.dispatchEvent(new CustomEvent("stop", {
	        	detail: {
	        		blob: zip.pack()
	        	}
	        }));
		});
	}

	pause() {
		this.state = "paused";
		if(this.#animationFrame){
			cancelAnimationFrame(this.#animationFrame);
		}
		this.dispatchEvent(new CustomEvent("pause"));
	}

	resume() {
		this.state = "recording";
		this.dispatchEvent(new CustomEvent("resume"));
		this.frame();
	}

	frame(timestamp) {
		if(this.state === "recording"){
			this.#deltaTime = timestamp - this.#previousTimestamp;
			this.#previousTimestamp = timestamp;
			this.#accumulator += this.#deltaTime || 0;

			if(this.#accumulator >= this.#timePerFrame || this.#timePerFrame === Number.POSITIVE_INFINITY){
				this.#accumulator = 0;
				let c = this.#counter;
				this.#source.toBlob((blob) => {
					this.#images[c] = blob;
				}, this.#mimeType);
				this.#counter++;
			}

			if(this.#timePerFrame < Number.POSITIVE_INFINITY){
				this.#animationFrame = requestAnimationFrame(this.frame.bind(this));
			}
		}
	}
}