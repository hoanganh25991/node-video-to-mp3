import Oaxios from "axios"

const ALLOW_TIMEOUT = 120 * 60 * 1000 // 120m = 2h

const axios = Oaxios.create({
  timeout: ALLOW_TIMEOUT,
  validateStatus: status => status !== 500
})

// export const convertNStream = (url, res) => {
//   axios({
//     url,
//     method:'GET',
//     responseType:'stream'
//   }).then(videoStream => {
//     const {headers, status} = videoStream
//     _("[headers, status]", headers, status)
//     const ffStream = ffmpeg(videoStream.data).format(audioMp3).on("error", (err, stdout, stderr) => {
//       _("[ERR]", err.message, err, stderr);
//     }).pipe();
//     const timestamp = new Date().getTime();
//
//     res.setHeader("Content-disposition", `attachment; filename=${timestamp}.mp3`);
//     res.setHeader("Content-type", "application/octet-stream");
//
//     // outStream
//     ffStream.on("data", chunk => {
//       // _("Chunk size", chunk.length)
//       res.write(chunk);
//     })
//       .on("finish", () => res.end())
//   })
// }

export const convert = async url => {
  const streamOpt = {  url, method: "get", responseType: "stream" }
  const videoStream = await axios(streamOpt).then(res => res.data).catch(err => {
    console.log("[axios call][ERR]", err)
    return null
  })

  return videoStream
}