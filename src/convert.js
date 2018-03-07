import ffmpeg from "fluent-ffmpeg"

const handleErr = err => {
  console.log("[convertStreamToMp3][ERR]", err)
}

export const convertStreamToMp3 = videoStream => {
  return ffmpeg(videoStream)
    .format("mp3")
    .on("error", handleErr)
    .pipe()
}
