const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.mensaje;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
     "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "system",
            content: `
Eres TecnoBot, asesor académico del Tecnológico Superior de Acayucan.
Responde de forma clara, motivadora y profesional.
Solo responde temas relacionados con informática, inscripciones, actividades o perfil académico.
`
          },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;

    res.json({ respuesta: reply });

  } catch (error) {
    res.json({ respuesta: "Hubo un error en el servidor." });
  }
});


app.listen(3000, () => console.log("Servidor corriendo en puerto 3000"));

