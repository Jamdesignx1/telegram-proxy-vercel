export default async function handler(req) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // regex مطابق مسیر مورد نظر
  const URL_PATH_REGEX = /^\/api\/telegram\/bot([^\/]+)\/([a-z]+)/i;

  if (pathname === '/') {
    return new Response(JSON.stringify({
      ok: true,
      result: 'Everything looks good! You are ready to use your Vercel API proxy.'
    }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  }

  if (URL_PATH_REGEX.test(pathname)) {
    // استخراج توکن و متد از URL
    const [, bot_token, api_method] = pathname.match(URL_PATH_REGEX);

    // تغییر hostname به api.telegram.org
    url.hostname = 'api.telegram.org';
    url.protocol = 'https:'; // حتما باید https باشه

    // ساخت درخواست جدید
    const newRequest = new Request(url.toString(), {
      method: req.method,
      headers: req.headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? await req.text() : null,
      redirect: 'follow'
    });

    // ارسال درخواست به تلگرام
    try {
      const response = await fetch(newRequest);
      const body = await response.text();

      return new Response(body, {
        status: response.status,
        headers: {
          'content-type': 'application/json'
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        ok: false,
        error_code: 500,
        description: error.message
      }), {
        status: 500,
        headers: { 'content-type': 'application/json' }
      });
    }
  }

  // مسیرهای دیگه 404
  return new Response(JSON.stringify({
    ok: false,
    error_code: 404,
    description: 'No matching route found'
  }), {
    status: 404,
    headers: { 'content-type': 'application/json' }
  });
}
