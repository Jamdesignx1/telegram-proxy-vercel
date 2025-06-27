export default async function handler(req) {
  try {
    const url = new URL(req.url);
    const match = url.pathname.match(/^\/api\/telegram\/bot([^/]+)\/([^/?]+)/);

    if (!match) {
      return new Response(JSON.stringify({ ok: false, description: "Invalid URL" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const [, token, method] = match;
    const telegramApiUrl = `https://api.telegram.org/bot${token}/${method}${url.search}`;

    const options = {
      method: req.method,
      headers: {
        "content-type": req.headers.get("content-type") || "application/json",
      },
    };

    if (req.method !== "GET" && req.method !== "HEAD") {
      options.body = await req.text();
    }

    const response = await fetch(telegramApiUrl, options);
    const text = await response.text();

    return new Response(text, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ ok: false, error_code: 500, description: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
