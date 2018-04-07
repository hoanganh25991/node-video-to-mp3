import ffmpeg from "fluent-ffmpeg"

const _ = console.log

const handleErr = err => _(`[convertStreamToMp3] ERR: ${err.message}`)
const printCmd = cmd => _(`[convertStreamToMp3] Spawned ffmpeg with command: ${cmd}`)

export const convertStreamToMp3 = videoStream => {
  return ffmpeg(videoStream)
    .on("start", printCmd)
    .on("error", handleErr)
    .format("mp3")
    .outputOptions("-ab 320k")
    .pipe()
}

//https://trac.ffmpeg.org/wiki/Seeking
//ffmpeg -ss 50 -i D:\work-station\node-video-to-mp3\src/__test__/24-hours.mp4 -t 60 -f mp3 -ab 320k abc.mp3
export const convertStreamMp3FromTo = videoStream => {
  return ffmpeg(videoStream)
    .on("start", printCmd)
    .on("error", handleErr)
    .setStartTime(50)
    .withDuration(5)
    .format("mp3")
    .outputOptions("-ab 320k")
    .pipe()
}
