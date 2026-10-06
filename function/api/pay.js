// 发起支付 API - 易支付 V2（页面跳转支付 + SHA256WithRSA 签名）
import { CONFIG } from '../_lib/config.js';
import { rsaSign, buildSignContent } from '../_lib/rsa.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.json();
  const { goods_id, name, money, email, return_url } = body;

  const origin = new URL(request.url).origin;
  const out_trade_no = Date.now().toString() + Math.floor(Math.random() * 100000);

  const params = {
    pid: CONFIG.PID,
    type: 'alipay',
    out_trade_no: out_trade_no,
    notify_url: origin + '/api/notify',
    return_url: return_url || origin + '/shop.html',
    name: name || '商品',
    money: String(money),
    timestamp: Math.floor(Date.now() / 1000).toString(),
    sign_type: 'RSA',
  };
  params.sign = await rsaSign(buildSignContent(params), CONFIG.PRIVATE_KEY);

  // 落库订单（含商家ID、买家邮箱，供回调发卡用）
  const goods = await env.DB.prepare('SELECT merchant_id FROM goods WHERE id = ?').bind(goods_id).first();
  const merchantId = goods ? goods.merchant_id : 0;

  await env.DB.prepare(
    'INSERT INTO orders (order_no, merchant_id, goods_id, name, email, amount, status) VALUES (?, ?, ?, ?, ?, ?, 0)'
  ).bind(out_trade_no, merchantId, goods_id, name || '商品', email || '', money).run();

  const payUrl = CONFIG.PAY_API_SUBMIT + '?' + new URLSearchParams(params).toString();

  return new Response(JSON.stringify({ success: true, order_no: out_trade_no, pay_url: payUrl }));
}
