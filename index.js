const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs")
const http = require('http');

const curDir = __dirname;
const audioMp3 = "mp3";

const testMp4 = `${curDir}/test.mp4`;
const testMp3 = `${curDir}/test.mp3`;

const timestamp = new Date().getTime()
const outStream = fs.createWriteStream(`${timestamp}.mp3`);

const run1 = () => {
	// Simple run on full video
	ffmpeg(testMp4)
	.format(audioMp3)
	.output(testMp3)
	.run();
}

const run = () => {
	const len = 1600000;
	const ffStream = ffmpeg(testMp4).format(audioMp3).on("end", () => outStream.end()).pipe();

	let downloaded = 0;

	// outStream
	ffStream
	.on("data", chunk => {
		downloaded += chunk.length;
		outStream.write(chunk)
		process.stdout.write(`Sending ${(100.0 * downloaded / len).toFixed(2)}% ${downloaded} bytes \r`)
	})
}



run();