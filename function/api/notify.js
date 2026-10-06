// 支付回调通知 API
const KEY = 'pv9PDVv1fQJ12vAtAQqcPD9p8fpdV2UQ';
const EMAILJS_SERVICE_ID = 'service_b14b5b2';
const EMAILJS_TEMPLATE_ID = 'template_r3dldzr';
const EMAILJS_PRIVATE_KEY = 'HBiEJBAk4IA61lVhIFU0U';

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

async function sendEmail(toEmail, code) {
  await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + EMAILJS_PRIVATE_KEY
    },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      template_params: {
        to_email: toEmail,
        subject: '【龙黑发卡】注册验证码',
        message: '您的注册验证码是：' + code + '，5分钟内有效。',
        code: code
      }
    })
  });
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);

  const valid = await verifySign(params);
  if (!valid || params.trade_status !== 'TRADE_SUCCESS') {
    return new Response('fail');
  }

  const orderNo = params.out_trade_no;

  // 验证码支付订单
  if (orderNo.startsWith('code_')) {
    const codeOrder = await env.DB.prepare('SELECT * FROM code_orders WHERE order_no = ?')
      .bind(orderNo).first();
    if (codeOrder) {
      await env.DB.prepare('UPDATE code_orders SET status = 1 WHERE order_no = ?')
        .bind(orderNo).run();
      await sendEmail(codeOrder.email, codeOrder.code);
    }
    return new Response('success');
  }

  // 商品订单
  await env.DB.prepare('UPDATE orders SET status = 1 WHERE order_no = ?')
    .bind(orderNo).run();

  const order = await env.DB.prepare('SELECT * FROM orders WHERE order_no = ?')
    .bind(orderNo).first();

  if (order) {
    await env.DB.prepare('UPDATE goods SET stock = stock - 1 WHERE id = ?')
      .bind(order.goods_id).run();

    const card = await env.DB.prepare(
      'SELECT * FROM cards WHERE goods_id = ? AND status = 0 LIMIT 1'
    ).bind(order.goods_id).first();

    if (card) {
      await env.DB.prepare('UPDATE cards SET status = 1, used_at = datetime(\'now\',\'+8 hours\') WHERE id = ?')
        .bind(card.id).run();
    }
  }

  return new Response('success');
}
