export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { pathname, search } = new URL(req.url);
  const match = pathname.match(/^\/api\/telegram\/bot([^/]+)\/([a-zA-Z_]+)/);

  if (match) {
    const [, token, method] = match;
    const tgUrl = `https://api.telegram.org/bot${token}/${method}${search}`;

    const tgReq = new Request(tgUrl, {
      method: req.method,
      headers: {
        "content-type": req.headers.get("content-type") || "application/json",
      },
      body: req.method !== "GET" && req.method !== "HEAD" ? await req.text() : null,
    });

    try {
      const tgRes = await fetch(tgReq);
      const tgBody = await tgRes.text();
      return new Response(tgBody, {
        status: tgRes.status,
        headers: { "content-type": "application/json" },
      });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error_code: 500, description: e.message }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }
  }

  return new Response(JSON.stringify({ ok: false, description: "Invalid URL" }), {
    status: 404,
    headers: { "content-type": "application/json" },
  });
}
