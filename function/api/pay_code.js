import { createMD5 } from 'cloudflare:workers';

const PAY_API = 'https://pay.ykmcn.com/submit.php';
const PID = '1184';
const KEY = 'pv9PDVv1fQJ12vAtAQqcPD9p8fpdV2UQ';

async function md5(str) {
  const data = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('MD5', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function makeSign(params) {
  const keys = Object.keys(params).filter(k => k !== 'sign' && k !== 'sign_type' && params[k] !== '').sort();
  const str = keys.map(k => `${k}=${params[k]}`).join('&') + KEY;
  return md5(str);
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.json();
  const email = body.email;

  const out_trade_no = 'code_' + Date.now().toString() + Math.floor(Math.random() * 100000);
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // 存验证码到数据库（等支付成功后用）
  await env.DB.prepare('INSERT INTO code_orders (order_no, email, code, status) VALUES (?, ?, ?, 0)')
    .bind(out_trade_no, email, code).run();

  const params = {
    pid: PID,
    type: 'alipay',
    out_trade_no: out_trade_no,
    notify_url: 'https://serverdo.ccwu.cc/api/notify',
    return_url: 'https://serverdo.ccwu.cc/register.html',
    name: '邮箱验证码',
    money: '0.10',
    sign_type: 'MD5'
  };

  params.sign = await makeSign(params);
  const query = new URLSearchParams(params).toString();
  const payUrl = `${PAY_API}?${query}`;

  return new Response(JSON.stringify({ pay_url: payUrl }));
}
