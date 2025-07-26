import { crc32 } from "./crc32.js";

const textEncoder = new TextEncoder();

export class Zip {
	#files = [];
	#centralDirectories = [];
	#currentOffset = 0;

	constructor(){}

	static generateCentralDirectoryHeader(file, localFileHeaderOffset){
		const buf = new ArrayBuffer(46 + file.filename.length);
		const arr = new Uint8Array(buf);
		const view = new DataView(buf);

		// Set Magic Number
		view.setUint32(0, 1347092738);
		// Set Version
		view.setUint16(4, 20, true);
		// Set Version extract
		view.setUint16(6, 20, true);
		// Set last modify time
		view.setUint16(12, file.modifyTime, true);
		// Set last modify date
		view.setUint16(14, file.modifyDate, true);
		// Set CRC-32
		view.setUint32(16, file.checksum, true);
		// Set Compressed size
		view.setUint32(20, file.compressedSize, true);
		// Set Uncompressed size
		view.setUint32(24, file.uncompressedSize, true);
		// Set file name length
		view.setUint16(28, file.filename.length, true);
		// Set relative offset
		view.setUint32(42, localFileHeaderOffset, true);
		// Set file name
		const filenameBytes = textEncoder.encode(file.filename);
		arr.set(filenameBytes, 46);

		return view.buffer;
	}

	addFile(file){
		const centralDirectory = Zip.generateCentralDirectoryHeader(file, this.#currentOffset);
		this.#files.push(file);

		this.#centralDirectories.push(centralDirectory);
		this.#currentOffset += file.localFileHeader.byteLength;
		this.#currentOffset += file.content.length;
	}

	pack(){
		// Calcualte needed buffer size
		const centralDirectoriesSize = this.#centralDirectories.reduce((acc, data) => {
			acc += data.byteLength
			return acc;
		}, 0);
		this.#currentOffset += centralDirectoriesSize;

		// Calculate end of central directory record
		const buf = new ArrayBuffer(22);
		const view = new DataView(buf);
		// Set Magic Number
		view.setUint32(0, 1347093766);
		// Set central directory number
		view.setUint16(8, this.#files.length, true);
		// Set total central directory number
		view.setUint16(10, this.#files.length, true);
		// Set size of central directory in byes
		view.setUint32(12, centralDirectoriesSize, true); // VARIABLE
		// Set offset of central directory
		view.setUint32(16, this.#currentOffset-centralDirectoriesSize, true); // VARIABLE

		// Put all components into blob and return
		const items = [];
		// Insert files
		for(const file of this.#files){
			items.push(file.localFileHeader);
			items.push(file.content);
		}

		// Insert central directory
		items.push(...this.#centralDirectories);

		// Insert end of central directory
		items.push(view.buffer);

		return new Blob(items);
	}
}

export class FileEntry {
	modifyTime;
	modifyDate;
	checksum;
	compressedSize;
	uncompressedSize;
	filename;
	content;

	constructor(filename, content){
		this.filename = filename;
		this.content = content;
		const { date, time } = getDosDateTime();
		this.modifyTime = time;
		this.modifyDate = date;
		this.checksum = crc32(0, content, content.length, 0);
		this.compressedSize = content.length;
		this.uncompressedSize = content.length;
	}

	get localFileHeader(){
		const buf = new ArrayBuffer(30 + this.filename.length);
		const arr = new Uint8Array(buf);
		const view = new DataView(buf);

		// Set Magic Number
		view.setUint32(0, 1347093252);
		// Set Version extract
		view.setUint16(4, 20, true);
		// Set last modify time
		view.setUint16(10, this.modifyTime, true);
		// Set last modify date
		view.setUint16(12, this.modifyDate, true);
		// Set CRC-32
		view.setUint32(14, this.checksum, true);
		// Set Compressed size
		view.setUint32(18, this.compressedSize, true);
		// Set Uncompressed size
		view.setUint32(22, this.uncompressedSize, true);
		// Set file name length
		view.setUint16(26, this.filename.length, true);
		// Set file name
		const filenameBytes = textEncoder.encode(this.filename);
		arr.set(filenameBytes, 30);

		return view.buffer;
	}
}

function getDosDateTime(){
	const date = new Date();

	let dosTime = date.getUTCHours();
	dosTime = dosTime << 6;
	dosTime = dosTime | date.getUTCMinutes();
	dosTime = dosTime << 5;
	dosTime = dosTime | date.getUTCSeconds() / 2;

	let dosDate = date.getUTCFullYear() - 1980;
	dosDate = dosDate << 4;
	dosDate = dosDate | (date.getUTCMonth() + 1);
	dosDate = dosDate << 5;
	dosDate = dosDate | date.getUTCDate();

	return {
		date: dosDate,
		time: dosTime
	};
}
