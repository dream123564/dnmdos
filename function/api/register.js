// 注册 API
export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password || password.length < 6) {
    return new Response(JSON.stringify({ error: '密码至少6位' }), { status: 400 });
  }

  try {
    const existing = await env.DB.prepare('SELECT id FROM merchants WHERE email = ?').bind(email).first();
    if (existing) {
      return new Response(JSON.stringify({ error: '邮箱已被注册' }), { status: 400 });
    }

    const result = await env.DB.prepare(
      'INSERT INTO merchants (email, password, shop_name) VALUES (?, ?, ?)'
    ).bind(email, password, email).run();

    return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id }));
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
