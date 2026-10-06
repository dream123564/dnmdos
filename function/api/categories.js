export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  if (request.method === 'GET') {
    const mid = url.searchParams.get('mid');
    const cats = await env.DB.prepare('SELECT * FROM categories WHERE mid = ?').bind(mid).all();
    return new Response(JSON.stringify(cats.results));
  }

  if (request.method === 'POST') {
    const body = await request.json();
    await env.DB.prepare('INSERT INTO categories (mid, name) VALUES (?, ?)').bind(body.mid, body.name).run();
    return new Response(JSON.stringify({ success: true }));
  }
}
