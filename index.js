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
	http.get(url).on("response", (videoStream) => {
			const ffStream = ffmpeg(videoStream).format(audioMp3).pipe();

			res.setHeader('Content-disposition', 'attachment; filename=' + "test.mp3");
			res.setHeader('Content-type', 'application/octet-stream');

			// outStream
			ffStream.on("data", chunk => {
				res.write(chunk);
			})
			.on("finish", () => res.end())
		})
}

const run = () => {
	const server = http.createServer((req, res) => {
		// const url = "https://r3---sn-ogueln7d.googlevideo.com/videoplayback?dur=794.656&key=yt6&lmt=1519393339878059&ipbits=0&initcwndbps=936250&clen=42173389&requiressl=yes&signature=8A0D53C76A1DABE2E1564FD97946076D5B164805.A4C1EDA3ACBEAFAAE31AD663D02161F706FEDCCF&source=youtube&ip=45.76.211.250&ms=au,rdu&ei=UlyeWtvYGJTW4wLFjrSwDA&mv=m&pl=26&mt=1520327680&itag=18&mn=sn-ogueln7d,sn-oguesnzz&mm=31,29&id=o-ALjgzeDJD9Vpcwjap4d-7q_IbU6bu7RJZ23usGwcTs63&fvip=3&c=WEB&mime=video/mp4&ratebypass=yes&sparams=clen,dur,ei,gir,id,initcwndbps,ip,ipbits,itag,lmt,mime,mm,mn,ms,mv,pl,ratebypass,requiressl,source,expire&gir=yes&expire=1520349362&signature=8A0D53C76A1DABE2E1564FD97946076D5B164805.A4C1EDA3ACBEAFAAE31AD663D02161F706FEDCCF";
		const url = "http://tinker.press/videos/say-hello-to-cozmo.mp4";
		convertNStream(url, res)
	}).listen(3000);
}


run();