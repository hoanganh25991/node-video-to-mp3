import http from "http"
import { getVideoStream } from "./getVideoStream"
import { convertStreamToMp3 } from "./convert"
import { msg } from "./message"

const setDownloadHeader = res => {
  const timestamp = new Date().getTime()
  res.setHeader("Content-disposition", `attachment; filename=${timestamp}.mp3`)
  res.setHeader("Content-type", "application/octet-stream")
}

const run = () => {
  http
    .createServer(async (req, res) => {
      setDownloadHeader(res)

      const url =
        "https://r3---sn-ogueln7r.googlevideo.com/videoplayback?ipbits=0&sparams=clen,dur,ei,gir,id,initcwndbps,ip,ipbits,itag,lmt,mime,mm,mn,ms,mv,pcm2,pl,ratebypass,requiressl,source,expire&ratebypass=yes&itag=18&requiressl=yes&dur=351.782&id=o-AI87-elE7KR21XjeF3j-cooxYmVPnXQxbzCyzhTus73_&mn=sn-ogueln7r,sn-ogul7n7z&mm=31,29&ms=au,rdu&fvip=3&mv=m&source=youtube&lmt=1458188974192657&key=yt6&ip=45.76.211.250&ei=FWOfWq6QMZa1gQOj9LHoAg&pcm2=no&pl=26&mt=1520394937&gir=yes&expire=1520416629&clen=22787896&initcwndbps=650000&c=WEB&mime=video/mp4&signature=8B3F5132FB208F9BF1A65FACADE980B5441B9DB6.C5C5510460C0C17D800903B50F12AD6C812417EC&signature=8B3F5132FB208F9BF1A65FACADE980B5441B9DB6.C5C5510460C0C17D800903B50F12AD6C812417EC"
      const videoStream = await getVideoStream(url)

      if (!videoStream) return res.end(msg.GET_VIDEO_FAIL)

      const convertStream = convertStreamToMp3(videoStream)
      convertStream.on("data", chunk => res.write(chunk))
      convertStream.on("finish", () => res.end())
    })
    .listen(3000)
}

run()
