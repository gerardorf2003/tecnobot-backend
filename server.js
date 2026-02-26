const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `
Eres TecnoBot, asesor académico del Tecnológico Superior de Acayucan.
Responde claro y profesional.
`
          },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices) {
      console.log(data);
      return res.status(500).json({ reply: "Error del modelo IA" });
    }

    const reply = data.choices[0].message.content;

    res.json({ reply });

  } catch (error) {
    console.error("ERROR COMPLETO:", error);
    res.status(500).json({ reply: "Error interno del servidor" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor corriendo");
});

