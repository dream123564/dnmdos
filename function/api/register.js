// 注册 API
export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.json();
  const { email, password, code } = body;

  if (!email || !password || password.length < 6) {
    return new Response(JSON.stringify({ error: '密码至少6位' }), { status: 400 });
  }

  if (!code) {
    return new Response(JSON.stringify({ error: '请输入验证码' }), { status: 400 });
  }

  try {
    // 验证验证码
    const codeOrder = await env.DB.prepare(
      'SELECT * FROM code_orders WHERE email = ? AND code = ? AND status = 1 ORDER BY id DESC LIMIT 1'
    ).bind(email, code).first();

    if (!codeOrder) {
      return new Response(JSON.stringify({ error: '验证码错误，请先支付获取验证码' }), { status: 400 });
    }

    // 标记验证码已使用
    await env.DB.prepare('UPDATE code_orders SET status = 2 WHERE id = ?').bind(codeOrder.id).run();

    const existing = await env.DB.prepare('SELECT id FROM merchants WHERE email = ?').bind(email).first();
    if (existing) {
      return new Response(JSON.stringify({ error: '邮箱已被注册' }), { status: 400 });
    }

    const result = await env.DB.prepare(
      'INSERT INTO merchants (email, password, shop_name) VALUES (?, ?, ?)'
    ).bind(email, password, email).run();

    return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id, email: email }));
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
