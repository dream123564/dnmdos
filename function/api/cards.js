// 卡密 API
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
    const goodsId = body.goods_id;
    // 通过商品反查商家ID
    const goods = await env.DB.prepare('SELECT merchant_id FROM goods WHERE id = ?').bind(goodsId).first();
    const merchantId = goods ? goods.merchant_id : 0;
    for (const c of body.cards) {
      await env.DB.prepare(
        'INSERT INTO cards (merchant_id, goods_id, content, status) VALUES (?, ?, ?, 0)'
      ).bind(merchantId, goodsId, c).run();
    }
    return new Response(JSON.stringify({ success: true }));
  }
}
