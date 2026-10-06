// 商品 API
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const merchantId = url.searchParams.get('mid');

  // GET - 获取商品列表
  if (request.method === 'GET') {
    if (!merchantId) {
      return new Response(JSON.stringify({ error: '缺少商家ID' }), { status: 400 });
    }
    const { results } = await env.DB.prepare(
      'SELECT * FROM goods WHERE merchant_id = ? ORDER BY id DESC'
    ).bind(merchantId).all();
    return new Response(JSON.stringify(results));
  }

  // POST - 添加商品
  if (request.method === 'POST') {
    const body = await request.json();
    const { merchant_id, name, short_desc, price, stock } = body;
    await env.DB.prepare(
      'INSERT INTO goods (merchant_id, name, short_desc, price, stock) VALUES (?, ?, ?, ?, ?)'
    ).bind(merchant_id, name, short_desc, price, stock || 0).run();
    return new Response(JSON.stringify({ success: true }));
  }

  // DELETE - 删除商品
  if (request.method === 'DELETE') {
    const id = url.searchParams.get('id');
    await env.DB.prepare('DELETE FROM goods WHERE id = ?').bind(id).run();
    return new Response(JSON.stringify({ success: true }));
  }
}
