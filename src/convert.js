import Oaxios from "axios"

const ALLOW_TIMEOUT = 120 * 60 * 1000 // 120m = 2h

const axios = Oaxios.create({
  timeout: ALLOW_TIMEOUT,
  validateStatus: status => status !== 500
})

export const convert = async url => {
  const streamOpt = {  url, method: "get", responseType: "stream" }
  const videoStream = await axios(streamOpt).then(res => res.data).catch(err => {
    console.log("[axios call][ERR]", err)
    return null
  })

  return videoStream
}