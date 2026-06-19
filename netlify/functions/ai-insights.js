exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  // Check API key is present
  const apiKey = process.env.ANTHROPIC_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "ANTHROPIC_KEY environment variable not set" })
    };
  }

  try {
    const { summary } = JSON.parse(event.body);

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `Post-tournament feedback survey data for the Founders Cup app (Church of the Holy Ghost biennial sports tournament). Data: ${JSON.stringify(summary)}. Write 4-6 concise actionable bullet-point insights for the organising team: what worked well, what to improve, key themes from open feedback. Plain text, no markdown.`
        }]
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Anthropic API error:", res.status, errText);
      return {
        statusCode: res.status,
        body: JSON.stringify({ error: `API returned ${res.status}: ${errText}` })
      };
    }

    const data = await res.json();
    const text = data.content
      .filter(b => b.type === "text")
      .map(b => b.text)
      .join("\n");

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ text })
    };

  } catch (e) {
    console.error("Function error:", e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};
