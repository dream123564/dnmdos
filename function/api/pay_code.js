// 注册验证码下单 API - 易支付 V2（￥0.10 获取邮箱验证码）
import { CONFIG } from '../_lib/config.js';
import { rsaSign, buildSignContent } from '../_lib/rsa.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.json();
  const email = body.email;
  if (!email) {
    return new Response(JSON.stringify({ error: '缺少邮箱' }), { status: 400 });
  }

  const origin = new URL(request.url).origin;
  const out_trade_no = 'code_' + Date.now().toString() + Math.floor(Math.random() * 100000);
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // 先落库，支付成功后由 notify 回填状态并发邮件
  await env.DB.prepare('INSERT INTO code_orders (order_no, email, code, status) VALUES (?, ?, ?, 0)')
    .bind(out_trade_no, email, code).run();

  const params = {
    pid: CONFIG.PID,
    type: 'alipay',
    out_trade_no: out_trade_no,
    notify_url: origin + '/api/notify',
    return_url: origin + '/register.html',
    name: '邮箱验证码',
    money: '0.10',
    timestamp: Math.floor(Date.now() / 1000).toString(),
    sign_type: 'RSA',
  };
  params.sign = await rsaSign(buildSignContent(params), CONFIG.PRIVATE_KEY);

  const payUrl = CONFIG.PAY_API_SUBMIT + '?' + new URLSearchParams(params).toString();

  return new Response(JSON.stringify({ pay_url: payUrl }));
}
