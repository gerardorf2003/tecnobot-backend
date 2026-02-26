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
        model: "mistralai/mistral-7b-instruct",
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

    // 🔎 LOG PARA VER QUE RESPONDE OPENROUTER
    console.log("RESPUESTA OPENROUTER:", data);

    if (!data.choices) {
      return res.status(500).json({
        reply: "Error del modelo de IA. Revisa la API Key o el modelo."
      });
    }

    const reply = data.choices[0].message.content;

    res.json({ reply });

  } catch (error) {
    console.error("ERROR COMPLETO:", error);
    res.status(500).json({
      reply: "Hubo un error interno en el servidor."
    });
  }
});
