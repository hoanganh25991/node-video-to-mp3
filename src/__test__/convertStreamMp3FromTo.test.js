import { convertStreamMp3FromTo, convertStreamToMp3 } from "../convert"
import fs from "fs"

const testMp4 = `${__dirname}/24-hours.mp4`
const fakeStream = fs.createWriteStream(testMp4)

const stream = convertStreamToMp3(fakeStream)
// convertStreamMp3FromTo(fakeStream)
