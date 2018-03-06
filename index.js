var ffmpeg = require('fluent-ffmpeg');

const curDir = __dirname;
const audioMp3 = "mp3";

const testMp4 = `${curDir}/test.mp4`;
const testMp3 = `${curDir}/test.mp3`;


ffmpeg(testMp4)
.format(audioMp3)
.output(testMp3)
.run();