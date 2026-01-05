import express from "express";
import cors from "cors";
import { exec } from "child_process";
import fs from "fs";

const app = express();
app.use(cors());

app.get("/transcript/:id", async (req,res)=>{
  const id=req.params.id;

  // 1. télécharger audio
  exec(`yt-dlp -x --audio-format mp3 https://youtube.com/watch?v=${id} -o temp.mp3`,()=>{
    
    // 2. transcription automatique
    exec(`whisper temp.mp3 --language French --output_format json`,()=>{
      const data=JSON.parse(fs.readFileSync("temp.json"));
      res.json(data.segments.map(s=>({start:s.start,text:s.text})));
    });
  });
});

app.listen(3000,()=>console.log("SERVER OK"));
