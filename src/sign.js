import crypto from "crypto"

const SECRET = "AY#k$NGU#cEN=q9%"
const algorithm = "aes-128-ecb"

export const encrypt = text => {
  const cipher = crypto.createCipher(algorithm, SECRET)
  let crypted = cipher.update(text, "utf8", "hex")
  crypted += cipher.final("hex")
  return crypted
}

export const decrypt = text => {
  const decipher = crypto.createDecipher(algorithm, SECRET)
  let dec = decipher.update(text, "hex", "utf8")
  dec += decipher.final("utf8")
  return dec
}
