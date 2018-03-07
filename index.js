const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs")
const https = require('https');
const http = require('http');

const curDir = __dirname;
const audioMp3 = "mp3";
const _ = console.log

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

const run2 = () => {
	const len = 1600000;
	const ffStream = ffmpeg(testMp4).format(audioMp3).pipe();

	let downloaded = 0;

	// outStream
	ffStream
	.on("data", chunk => {
		downloaded += chunk.length;
		outStream.write(chunk)
		process.stdout.write(`Sending ${(100.0 * downloaded / len).toFixed(2)}% ${downloaded} bytes \r`)
	})
	.on("finish", () => outStream.end())
}

const convertNStream = (url, res) => {
	https.get(url).on("response", (videoStream) => {
		videoStream.on("data", chunk => _(chunk))
		// const ffStream = ffmpeg(videoStream).format("mp4").on("error", (err, stdout, stderr) => {
  //               _("[ERR]", err.message, err, stderr);
  //           }).pipe();
		// const timestamp = new Date().getTime();

		// res.setHeader('Content-disposition', `attachment; filename=${timestamp}.mp3`);
		// res.setHeader('Content-type', 'application/octet-stream');

		// // outStream
		// ffStream.on("data", chunk => {
		// 	_("Chunk size", chunk.length)
		// 	res.write(chunk);
		// })
		// .on("finish", () => res.end())
		
	})
}

const run = () => {
	const server = http.createServer((req, res) => {
		const url = "https://r5---sn-oguelned.googlevideo.com/videoplayback?mime=video/mp4&itag=18&expire=1520350244&fvip=5&lmt=1418283934285556&ratebypass=yes&clen=64651238&source=youtube&key=yt6&ip=45.76.211.250&mn=sn-oguelned,sn-i3belnel&mm=31,26&ms=au,onr&ipbits=0&pl=26&gir=yes&mt=1520328536&c=WEB&signature=D5DD6AE0A7F4FF3F8DC5F6C08F8C4278EF01A8BE.394971E8DD802D76C13238D478BB4E54CCB6711A&sparams=clen,dur,ei,gir,id,initcwndbps,ip,ipbits,itag,lmt,mime,mm,mn,ms,mv,pl,ratebypass,requiressl,source,expire&requiressl=yes&ei=xF-eWs2fHIHg4wL1kJ6oCA&id=o-AOyMkYt8UxvuQdovSjJusnQ6LLjvQAsP60G4iVbr3WYj&initcwndbps=662500&dur=943.055&mv=m&signature=D5DD6AE0A7F4FF3F8DC5F6C08F8C4278EF01A8BE.394971E8DD802D76C13238D478BB4E54CCB6711A";
		// const url = "https://tinker.press/videos/say-hello-to-cozmo.mp4";
		// const url = "https://tinker.press/videos/abc.mp4";
		// const url = "https://tinker.press/videos/def.mp4";
		convertNStream(url, res)
	}).listen(3000);
}


run();