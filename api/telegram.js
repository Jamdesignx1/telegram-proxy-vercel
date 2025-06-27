export default function handler(req) {
  return new Response(JSON.stringify({ ok: true, msg: "سلام! API فعاله." }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
