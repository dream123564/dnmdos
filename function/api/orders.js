export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const mid = url.searchParams.get('mid');
  const orders = await env.DB.prepare('SELECT * FROM orders WHERE mid = ? ORDER BY created_at DESC').bind(mid).all();
  return new Response(JSON.stringify(orders.results));
}
