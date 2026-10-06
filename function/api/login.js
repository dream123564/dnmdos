// 登录 API
export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.json();
  const { email, password } = body;

  try {
    const user = await env.DB.prepare('SELECT * FROM merchants WHERE email = ? AND password = ?')
      .bind(email, password).first();

    if (!user) {
      return new Response(JSON.stringify({ error: '邮箱或密码错误' }), { status: 401 });
    }

    return new Response(JSON.stringify({
      success: true,
      id: user.id,
      email: user.email
    }));
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
