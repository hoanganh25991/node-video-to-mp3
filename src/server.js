import http from "http"
import { getVideoStream } from "./getVideoStream"
import { convertStreamToMp3 } from "./convert"
import { msg } from "./message"
import url from "url"

const setDownloadHeader = res => {
  const timestamp = new Date().getTime()
  res.setHeader("Content-disposition", `attachment; filename=${timestamp}.mp3`)
  res.setHeader("Content-type", "application/octet-stream")
}

const getUrl = req => {
  const { query } = url.parse(req.url, true)
  console.log(query)
}

const run = () => {
  http
    .createServer(async (req, res) => {
      setDownloadHeader(res)
      const url = getUrl(req)

      if (!url) return res.end(msg.GET_VIDEO_FAIL)

      const videoStream = await getVideoStream(url)

      if (!videoStream) return res.end(msg.GET_VIDEO_FAIL)

      const convertStream = convertStreamToMp3(videoStream)
      convertStream.on("data", chunk => res.write(chunk))
      convertStream.on("finish", () => res.end())
    })
    .listen(3000)
}

run()
