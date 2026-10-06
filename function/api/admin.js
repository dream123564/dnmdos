export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/api/admin/merchants') {
    const merchants = await env.DB.prepare('SELECT id, email, created_at FROM users ORDER BY id DESC').all();
    return new Response(JSON.stringify(merchants.results));
  }

  if (path === '/api/admin/stats') {
    const users = await env.DB.prepare('SELECT COUNT(*) as cnt FROM users').first();
    const orders = await env.DB.prepare('SELECT COUNT(*) as cnt FROM orders').first();
    return new Response(JSON.stringify({ users: users.cnt, orders: orders.cnt }));
  }

  return new Response(JSON.stringify({ error: 'not found' }), { status: 404 });
}
