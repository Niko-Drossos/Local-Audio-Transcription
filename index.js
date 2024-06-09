const express = require('express');
const multer = require('multer');
const Queue = require('bull');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const { PORT, Redis_Connection } = process.env

const app = express();
const port = PORT || 3000;

const transcribeQueue = new Queue('transcription_queue', Redis_Connection || "redis://127.0.0.1:6379");

const storage = multer.diskStorage({
    dest: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save the uploaded files
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Custom file name
    }
});

const upload = multer({ dest: "./uploads" });

app.post('/transcribe', upload.single('audio'), async (req, res) => {
    const inputPath = req.file.path;
    const outputPath = `${req.file.path}.wav`;

    // Add the job to the queue
    await transcribeQueue.add({ inputPath, outputPath });

    res.json({ message: 'File uploaded and transcription started' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
