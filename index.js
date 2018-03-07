const ffmpeg = require("fluent-ffmpeg")
const fs = require("fs")
const https = require("https")
const http = require("http")
const { URL } = require("url")
const Oaxios = require("axios")

const curDir = __dirname
const audioMp3 = "mp3"
const _ = console.log
const axios = Oaxios.create({
  timeout: 600000
})

const testMp4 = `${curDir}/test.mp4`
const testM4a = `${curDir}/test.m4a`
const testMp3 = `${curDir}/test.mp3`

const timestamp = new Date().getTime()
const outStream = fs.createWriteStream(`${timestamp}.mp3`)

const run1 = () => {
  // Simple run on full video
  ffmpeg(testM4a)
    .format(audioMp3)
    .output(testMp3)
    // .outputOptions("-ab 320k")
    .run()
}

const run2 = () => {
  const len = 1600000
  const ffStream = ffmpeg(testMp4)
    .format(audioMp3)
    .pipe()

  let downloaded = 0

  // outStream
  ffStream
    .on("data", chunk => {
      downloaded += chunk.length
      outStream.write(chunk)
      process.stdout.write(`Sending ${(100.0 * downloaded / len).toFixed(2)}% ${downloaded} bytes \r`)
    })
    .on("finish", () => outStream.end())
}

const convertNStream = (url, res) => {
  // const pUrl = new URL(url);
  // const options = {
  // 	host: pUrl.host,
  // 	port: 443,
  // 	path: pUrl.pathname,
  // 	method: "GET",
  // 	headers: {
  // 		"content-type": "audio/m4a"
  // 	}
  // };

  axios({
    url,
    method: "GET",
    responseType: "stream"
  }).then(videoStream => {
    const { headers, status } = videoStream
    _("[headers, status]", headers, status)
    const ffStream = ffmpeg(videoStream.data)
      .format(audioMp3)
      .on("error", (err, stdout, stderr) => {
        _("[ERR]", err.message, err, stderr)
      })
      .pipe()
    const timestamp = new Date().getTime()

    res.setHeader("Content-disposition", `attachment; filename=${timestamp}.mp3`)
    res.setHeader("Content-type", "application/octet-stream")

    // outStream
    ffStream
      .on("data", chunk => {
        // _("Chunk size", chunk.length)
        res.write(chunk)
      })
      .on("finish", () => res.end())
  })

  // https.get(url).on("response", (videoStream) => {
  // 	const {headers, statusCode} = videoStream
  // 	_("[headers, statusCode]", headers, statusCode)
  // 	// videoStream.on("data", chunk => _(chunk))
  // 	const ffStream = ffmpeg(videoStream).format(audioMp3).on("error", (err, stdout, stderr) => {
  //              _("[ERR]", err.message, err, stderr);
  //          }).pipe();
  // 	const timestamp = new Date().getTime();
  //
  // 	res.setHeader("Content-disposition", `attachment; filename=${timestamp}.mp3`);
  // 	res.setHeader("Content-type", "application/octet-stream");
  //
  // 	// outStream
  // 	ffStream.on("data", chunk => {
  // 		// _("Chunk size", chunk.length)
  // 		res.write(chunk);
  // 	})
  // 	.on("finish", () => res.end())
  //
  // })
}

const run = () => {
  const server = http
    .createServer((req, res) => {
      const url =
        "https://r3---sn-ogueln7r.googlevideo.com/videoplayback?ipbits=0&sparams=clen,dur,ei,gir,id,initcwndbps,ip,ipbits,itag,lmt,mime,mm,mn,ms,mv,pcm2,pl,ratebypass,requiressl,source,expire&ratebypass=yes&itag=18&requiressl=yes&dur=351.782&id=o-AI87-elE7KR21XjeF3j-cooxYmVPnXQxbzCyzhTus73_&mn=sn-ogueln7r,sn-ogul7n7z&mm=31,29&ms=au,rdu&fvip=3&mv=m&source=youtube&lmt=1458188974192657&key=yt6&ip=45.76.211.250&ei=FWOfWq6QMZa1gQOj9LHoAg&pcm2=no&pl=26&mt=1520394937&gir=yes&expire=1520416629&clen=22787896&initcwndbps=650000&c=WEB&mime=video/mp4&signature=8B3F5132FB208F9BF1A65FACADE980B5441B9DB6.C5C5510460C0C17D800903B50F12AD6C812417EC&signature=8B3F5132FB208F9BF1A65FACADE980B5441B9DB6.C5C5510460C0C17D800903B50F12AD6C812417EC"
      // const url = "https://tinker.press/videos/say-hello-to-cozmo.mp4";
      // const url = "https://tinker.press/videos/abc.mp4";
      // const url = "https://tinker.press/videos/def.mp4";
      // const url = "https://r3---sn-oguesnzl.googlevideo.com/videoplayback?ipbits=0&dur=343.608&fvip=3&expire=1520408387&itag=140&clen=5458032&signature=47024B57FDD1D5EADA18CBC607D7CE9C43297D13.0198FFF7EAD7BFA80AA528F8278010B7125C02C1&mime=audio/mp4&gir=yes&key=yt6&keepalive=yes&c=WEB&ei=40KfWqb8EcaEqQHy7I_ACw&lmt=1509079416429548&mt=1520386672&source=youtube&mm=31,26&mn=sn-oguesnzl,sn-i3b7knlk&id=o-AEfvbw0_wCSVjb4eK4xfU_hN1CLjbHGlWkfRYk4VqJRX&pl=26&ip=45.76.211.250&beids=[9466594]&requiressl=yes&initcwndbps=555000&sparams=clen,dur,ei,gir,id,initcwndbps,ip,ipbits,itag,keepalive,lmt,mime,mm,mn,ms,mv,pl,requiressl,source,expire&mv=m&ms=au,onr&signature=47024B57FDD1D5EADA18CBC607D7CE9C43297D13.0198FFF7EAD7BFA80AA528F8278010B7125C02C1";
      convertNStream(url, res)
    })
    .listen(3000)
}

run1()
