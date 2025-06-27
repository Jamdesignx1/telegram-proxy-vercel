export default async function handler(req, res) {
  const { url, method, headers } = req;
  const { searchParams, pathname } = new URL(req.url);

  // مطمئن شو مسیر درست باشه
  const regex = /^\/api\/telegram\/bot([^/]+)\/(.+)$/;
  const match = pathname.match(regex);

  if (!match) {
    return new Response(
      JSON.stringify({ ok: false, description: "Invalid URL structure" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  const [_, token, apiMethod] = match;

  const tgUrl = `https://api.telegram.org/bot${token}/${apiMethod}?${searchParams}`;

  try {
    const telegramRes = await fetch(tgUrl, {
      method,
      headers: {
        "content-type": headers.get("content-type") || "application/json",
      },
      body: method !== "GET" && method !== "HEAD" ? await req.text() : undefined,
    });

    const body = await telegramRes.text();

    return new Response(body, {
      status: telegramRes.status,
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error_code: 500, description: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
