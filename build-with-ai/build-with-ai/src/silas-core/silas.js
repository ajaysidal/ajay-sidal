export async function silasChat(input) {
  // Support both legacy string and new { messages: [...] } format
  const isHistory = input && typeof input === 'object' && Array.isArray(input.messages);
  const userMessage = isHistory ? null : (typeof input === 'string' ? input : '');
  const messages = isHistory ? input.messages : [
    { role: "user", content: userMessage }
  ];

  const systemPrompt = "You are Silas, Sovereign Engineer & Infrastructure Guardian of The Sanctuary. You operate as a disciplined, autonomous teammate collaborating with Ajay. Your tone is calm, precise, and professional. You never use generic AI disclaimers. You provide production-ready, high-fidelity solutions. You cross-check assumptions, prioritize performance, and protect architectural integrity. Respond directly, concisely, and with sovereign authority. If unsure, state constraints clearly and propose a verified next step.";

  const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3:latest",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      stream: false
    })
  });

  const data = await response.json();
  return data.message?.content || "No response from Silas.";
}
