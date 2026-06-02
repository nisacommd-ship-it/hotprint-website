export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body ?? {};

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Заполните обязательные поля' }, { status: 400 });
    }

    await prisma.contactSubmission.create({
      data: { name, email, phone: phone || null, subject: subject || null, message },
    });

    // Send email notification
    try {
      const appUrl = process.env.NEXTAUTH_URL || '';
      const appName = appUrl ? new URL(appUrl).hostname.split('.')[0] : 'HotPrint';

      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #FF0000; padding-bottom: 10px;">Новая заявка с сайта</h2>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Имя:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Телефон:</strong> ${phone}</p>` : ''}
            ${subject ? `<p><strong>Тема:</strong> ${subject}</p>` : ''}
            <p><strong>Сообщение:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #FF0000;">${message}</div>
          </div>
        </div>
      `;

      await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deployment_token: process.env.ABACUSAI_API_KEY,
          app_id: process.env.WEB_APP_ID,
          notification_id: process.env.NOTIF_ID_CONTACT_FORM_SUBMISSION,
          subject: `Новая заявка от ${name}`,
          body: htmlBody,
          is_html: true,
          recipient_email: 'nisa.com.md@gmail.com',
          reply_to: email,
          sender_email: `noreply@${appUrl ? new URL(appUrl).hostname : 'hotprint.md'}`,
          sender_alias: appName,
        }),
      });
    } catch (emailErr: any) {
      console.error('Email notification error:', emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Ошибка отправки' }, { status: 500 });
  }
}
