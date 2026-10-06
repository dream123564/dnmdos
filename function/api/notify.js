// 支付回调通知 API - 易支付 V2（平台公钥验签 + 自动发卡/发码）
import { CONFIG } from '../_lib/config.js';
import { rsaVerify, buildSignContent } from '../_lib/rsa.js';

async function sendEmail(toEmail, subject, message, extra = {}) {
  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + CONFIG.EMAILJS_PRIVATE_KEY,
      },
      body: JSON.stringify({
        service_id: CONFIG.EMAILJS_SERVICE_ID,
        template_id: CONFIG.EMAILJS_TEMPLATE_ID,
        template_params: { to_email: toEmail, subject, message, ...extra },
      }),
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);

  // 1. 验签（必须）
  let valid = false;
  try {
    valid = await rsaVerify(buildSignContent(params), params.sign || '', CONFIG.PLATFORM_PUBLIC_KEY);
  } catch (e) {
    valid = false;
  }
  if (!valid) {
    return new Response('fail');
  }
  if (params.trade_status !== 'TRADE_SUCCESS') {
    return new Response('success');
  }

  const orderNo = params.out_trade_no;

  // 2. 验证码订单（注册用）
  if (orderNo.startsWith('code_')) {
    const co = await env.DB.prepare('SELECT * FROM code_orders WHERE order_no = ?').bind(orderNo).first();
    if (co && co.status === 0) {
      await env.DB.prepare('UPDATE code_orders SET status = 1 WHERE order_no = ?').bind(orderNo).run();
      await sendEmail(co.email, '【龙黑发卡】邮箱验证码', '您的验证码是：' + co.code + '，5 分钟内有效。', {
        code: co.code,
      });
    }
    return new Response('success');
  }

  // 3. 商品订单（幂等处理）
  const order = await env.DB.prepare('SELECT * FROM orders WHERE order_no = ?').bind(orderNo).first();
  if (!order || order.status === 1) {
    return new Response('success');
  }

  await env.DB.prepare('UPDATE orders SET status = 1 WHERE order_no = ?').bind(orderNo).run();
  await env.DB.prepare('UPDATE goods SET stock = stock - 1 WHERE id = ?').bind(order.goods_id).run();

  // 取一张未使用的卡密并标记已用
  const card = await env.DB.prepare(
    'SELECT * FROM cards WHERE goods_id = ? AND status = 0 ORDER BY id ASC LIMIT 1'
  ).bind(order.goods_id).first();

  let cardContent = '';
  if (card) {
    cardContent = card.content;
    await env.DB.prepare('UPDATE cards SET status = 1 WHERE id = ?').bind(card.id).run();
  }

  // 发给买家
  if (order.email) {
    await sendEmail(
      order.email,
      '【龙黑发卡】购买成功',
      cardContent ? '您的卡密：' + cardContent : '库存不足，请联系客服补发。',
      { card_content: cardContent, order_no: orderNo }
    );
  }

  return new Response('success');
}
