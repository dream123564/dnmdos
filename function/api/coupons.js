export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  if (request.method === 'GET') {
    const mid = url.searchParams.get('mid');
    const coupons = await env.DB.prepare('SELECT * FROM coupons WHERE mid = ?').bind(mid).all();
    return new Response(JSON.stringify(coupons.results));
  }

  if (request.method === 'POST') {
    const body = await request.json();
    await env.DB.prepare('INSERT INTO coupons (mid, name, money, min) VALUES (?, ?, ?, ?)').bind(body.mid, body.name, body.money, body.min).run();
    return new Response(JSON.stringify({ success: true }));
  }
}
