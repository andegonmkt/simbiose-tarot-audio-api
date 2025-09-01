// server.js
import express from "express";
import { exec } from "child_process";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

const TEMP_DIR = "./temp";
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

app.post("/download", (req, res) => {
  try {
    const { url } = req.body || {};
    if (!url) return res.status(400).json({ error: "URL é obrigatória" });

    const id = uuidv4();
    const filePath = path.join(TEMP_DIR, `${id}.mp3`);

    // extrai só o áudio em mp3
    const command = `yt-dlp -x --audio-format mp3 -o "${filePath}" "${url}"`;

    exec(command, (error) => {
      if (error) {
        console.error("Erro no download:", error);
        return res.status(500).json({ error: "Falha ao baixar áudio" });
      }
      res.json({ audio_url: `${req.protocol}://${req.get("host")}/audio/${id}.mp3` });
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro interno" });
  }
});

app.use("/audio", express.static(TEMP_DIR));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
