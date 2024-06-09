# Local Audio Transcription
This was created for the purpose of making local audio transcription fast and easy.  
I needed a way to transcribe audio locally but i couldn't find anything that fit my needs, so i made an Express server to run Mozilla's DeepSpeech models locally.  

## Installation
Clone the repo,
```
git clone https://github.com/Niko-Drossos/Local-Audio-Transcription.git
```

Install dependencies,
```
npm i
```

Install Redis on your server using the [Redis Docs](https://redis.io/docs/latest/get-started/),

Download the **Deepspeech** .pbmm and .scorer files with these commands,
```
mkdir models
cd models

curl -LO https://github.com/mozilla/DeepSpeech/releases/download/v0.9.3/deepspeech-0.9.3-models.pbmm

curl -LO https://github.com/mozilla/DeepSpeech/releases/download/v0.9.3/deepspeech-0.9.3-models.pbmm
```


Set up the **.env** file,

```
PORT="3000" (Default)
Redis_Connection="redis://127.0.0.1:6379" (Default)
```

Start the server,
```
npm start
```

The server will now be listening on either a port specified in the **.env** file of the default **3000**

## Api

To transcribe an audio file simply make a **POST** request to the route sending **Multipart Form Data**. The name of the value is "audio",
```
fetch("http://localhost:PORT/transcribe", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: Multipart Form Data with name "audio"
})
```
