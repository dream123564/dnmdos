export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  if (request.method === 'GET') {
    const gid = url.searchParams.get('goods_id');
    const cards = await env.DB.prepare('SELECT * FROM cards WHERE goods_id = ? ORDER BY id DESC').bind(gid).all();
    return new Response(JSON.stringify(cards.results));
  }

  if (request.method === 'POST') {
    const body = await request.json();
    for (const c of body.cards) {
      await env.DB.prepare('INSERT INTO cards (goods_id, content) VALUES (?, ?)').bind(body.goods_id, c).run();
    }
    return new Response(JSON.stringify({ success: true }));
  }
}
