// 发起支付 API - 易支付v1
import { createMD5 } from 'cloudflare:workers';

const PAY_API = 'https://pay.ykmcn.com/submit.php';
const PID = '1184';
const KEY = 'pv9PDVv1fQJ12vAtAQqcPD9p8fpdV2UQ';

function sign(params) {
  const keys = Object.keys(params).filter(k => k !== 'sign' && k !== 'sign_type' && params[k] !== '').sort();
  const str = keys.map(k => `${k}=${params[k]}`).join('&') + KEY;
  // Cloudflare Workers 用 Web Crypto API 做MD5
  return md5(str);
}

async function md5(str) {
  const data = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('MD5', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.json();
  const { goods_id, name, money, return_url } = body;

  const out_trade_no = Date.now().toString() + Math.floor(Math.random() * 100000);
  const notify_url = 'https://serverdo.ccwu.cc/api/notify';
  const final_return = return_url || 'https://serverdo.ccwu.cc/shop.html';

  const params = {
    pid: PID,
    type: 'alipay',
    out_trade_no: out_trade_no,
    notify_url: notify_url,
    return_url: final_return,
    name: name,
    money: money,
    sign_type: 'MD5'
  };

  params.sign = await sign(params);

  // 存入数据库
  await env.DB.prepare(
    'INSERT INTO orders (order_no, goods_id, amount, status) VALUES (?, ?, ?, 0)'
  ).bind(out_trade_no, goods_id, money).run();

  // 构造跳转URL
  const query = new URLSearchParams(params).toString();
  const payUrl = `${PAY_API}?${query}`;

  return new Response(JSON.stringify({
    success: true,
    order_no: out_trade_no,
    pay_url: payUrl
  }));
}
