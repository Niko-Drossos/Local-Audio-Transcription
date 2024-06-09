const Queue = require('bull')
const DeepSpeech = require('deepspeech')
const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')
const dotenv = require('dotenv')
dotenv.config()

const { Redis_Connection } = process.env

const transcribeQueue = new Queue('transcription_queue', Redis_Connection || "redis://127.0.0.1:6379")

const modelPath = 'models/deepspeech-0.9.3-models.pbmm'
const scorerPath = 'models/deepspeech-0.9.3-models.scorer'

const model = new DeepSpeech.Model(modelPath)
model.enableExternalScorer(scorerPath)

function convertToWav(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat('wav')
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(err))
      .save(outputPath)
  })
}

function transcribe(audioFilePath) {
  const buffer = fs.readFileSync(audioFilePath)
  const audioLength = buffer.length / 2 / 16000 // 16-bit PCM, 16kHz

  const result = model.stt(buffer.slice(0, audioLength * 16000 * 2))
  return result
}

transcribeQueue.process(async (job) => {
  const { inputPath, outputPath } = job.data

  await convertToWav(inputPath, outputPath)
  const transcription = transcribe(outputPath)
  console.log(inputPath)

  // Write txt file with transcription
  const txtOutputPath = `./${outputPath.split('.')[0]}.txt`;
  fs.writeFileSync(txtOutputPath, transcription);

  console.log('Transcription:', transcription)

  return transcription
})
