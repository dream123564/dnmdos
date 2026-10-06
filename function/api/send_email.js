// 发送邮件 API - EmailJS
import { CONFIG } from '../_lib/config.js';

export async function onRequestPost(context) {
  const { request } = context;
  const body = await request.json();
  const { to_email, subject, message, card_content, order_no } = body;

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
        template_params: {
          to_email: to_email,
          subject: subject,
          message: message,
          card_content: card_content || '',
          order_no: order_no || '',
        },
      }),
    });

    const data = await res.text();
    return new Response(JSON.stringify({ success: res.ok, data }));
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
