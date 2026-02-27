const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("TecnoBot backend funcionando 🚀");
});

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
        model: "openrouter/free",
        messages: [
          {
            role: "system",
            content: `
Eres TecnoBot, asesor académico del Tecnológico Superior de Acayucan.
Responde claro, profesional y motivador.
Las respuestas deben ser cortas (máximo 3 oraciones).
No escribas párrafos largos.
Solo temas relacionados con informática, inscripciones y actividades académicas.
Cuando pregunten sobre inscripciones aclara que ahora son gratuitas.
Preguntas relacionadas a la ubicacion de la universidad orientalos a usar el boton en la pantalla de inicio que ya muestra la ubicacion en el mapa.
El termino ITSA corresponde a las abreviaturas de la universidad.
Las actividades que muestro en la pagina son: Creacion de aplicaciones, Bases de datos, Redes, Ciberseguridad, Ensamblaje y mantenimiento, Creacion de paginas web, Machine learning, Sistemas operativos, Sistemas embebidos.
La oferta educativa esta en el apartado de Conocenos de la pagina web.
`
          },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    console.log("RESPUESTA COMPLETA:", data);

    if (data.error) {
      console.log("ERROR OPENROUTER:", data.error);
      return res.status(500).json({ reply: "Error del modelo gratuito." });
    }

    if (!data.choices) {
      console.log("Respuesta inesperada:", data);
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
  console.log("Servidor corriendo 🚀");
});









