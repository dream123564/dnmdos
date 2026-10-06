// 支付回调通知 API
const KEY = 'pv9PDVv1fQJ12vAtAQqcPD9p8fpdV2UQ';

async function md5(str) {
  const data = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('MD5', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifySign(params) {
  const keys = Object.keys(params).filter(k => k !== 'sign' && k !== 'sign_type' && params[k] !== '').sort();
  const str = keys.map(k => `${k}=${params[k]}`).join('&') + KEY;
  const expected = await md5(str);
  return expected === params.sign;
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);

  // 验证签名
  const valid = await verifySign(params);
  if (!valid || params.trade_status !== 'TRADE_SUCCESS') {
    return new Response('fail');
  }

  // 更新订单状态
  await env.DB.prepare('UPDATE orders SET status = 1 WHERE order_no = ?')
    .bind(params.out_trade_no).run();

  // 减库存 + 发卡
  const order = await env.DB.prepare('SELECT * FROM orders WHERE order_no = ?')
    .bind(params.out_trade_no).first();

  if (order) {
    // 减库存
    await env.DB.prepare('UPDATE goods SET stock = stock - 1 WHERE id = ?')
      .bind(order.goods_id).run();

    // 取一条未使用的卡密
    const card = await env.DB.prepare(
      'SELECT * FROM cards WHERE goods_id = ? AND status = 0 LIMIT 1'
    ).bind(order.goods_id).first();

    if (card) {
      // 标记卡密已使用
      await env.DB.prepare('UPDATE cards SET status = 1, used_at = datetime(\'now\',\'+8 hours\') WHERE id = ?')
        .bind(card.id).run();

      // 发邮件通知买家（这里可以接EmailJS）
    }
  }

  return new Response('success');
}
