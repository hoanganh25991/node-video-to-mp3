import http from "http"
import { getVideoStream } from "./getVideoStream"
import { convertStreamToMp3 } from "./convert"
import { msg } from "./message"
import URL from "url"

const setDownloadHeader = res => {
  const timestamp = new Date().getTime()
  res.setHeader("Content-disposition", `attachment; filename=${timestamp}.mp3`)
  res.setHeader("Content-type", "application/octet-stream")
}

const hexToString = hex => {
  let string = ""
  for (let i = 0; i < hex.length; i += 2) {
    string += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
  }
  return string
}

const getUrl = req => {
  const { query = {} } = URL.parse(req.url, true)
  const { url: hexUrl } = query
  const url = hexToString(hexUrl)
  console.log("[hexUrl, url]", hexUrl, url)

  return url
}

const run = () => {
  http
    .createServer(async (req, res) => {
      const url = getUrl(req)
      if (!url) return res.end(msg.GET_VIDEO_FAIL)

      const videoStream = await getVideoStream(url)
      if (!videoStream) return res.end(msg.GET_VIDEO_FAIL)

      setDownloadHeader(res)
      const convertStream = convertStreamToMp3(videoStream)
      convertStream.on("data", chunk => res.write(chunk))
      convertStream.on("finish", () => res.end())
    })
    .listen(3000)
}

run()
