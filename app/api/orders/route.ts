export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

function generateOrderNumber() {
  const prefix = 'HP';
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}

// GET /api/orders — список заказов текущего пользователя
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: { product: { select: { name: true, slug: true, imageUrl: true } } },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('GET /api/orders error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки заказов' }, { status: 500 });
  }
}

// POST /api/orders — создание заказа
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, serviceName, description, quantity, totalPrice, fileCloudPath, fileIsPublic, notes } = body ?? {};

    if (!productId && !serviceName) {
      return NextResponse.json({ error: 'Укажите продукт или услугу' }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session.user.id,
        productId: productId || null,
        serviceName: serviceName || null,
        description: description || null,
        quantity: quantity || 1,
        totalPrice: totalPrice || null,
        fileCloudPath: fileCloudPath || null,
        fileIsPublic: fileIsPublic || false,
        notes: notes || null,
      },
      include: { product: { select: { name: true, slug: true } } },
    });

    // Email notification to admin
    try {
      const user = await prisma.user.findUnique({ where: { id: session.user.id } });
      const appUrl = process.env.NEXTAUTH_URL || '';
      const appName = appUrl ? new URL(appUrl).hostname.split('.')[0] : 'HotPrint';

      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #FF0000; padding-bottom: 10px;">Новый заказ #${order.orderNumber}</h2>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Клиент:</strong> ${user?.name || 'Не указано'} (${user?.email})</p>
            ${user?.phone ? `<p><strong>Телефон:</strong> ${user.phone}</p>` : ''}
            <p><strong>Продукт/Услуга:</strong> ${order.product?.name || order.serviceName || 'Не указано'}</p>
            <p><strong>Количество:</strong> ${order.quantity}</p>
            ${order.totalPrice ? `<p><strong>Сумма:</strong> ${order.totalPrice} MDL</p>` : ''}
            ${order.description ? `<p><strong>Описание:</strong> ${order.description}</p>` : ''}
            ${order.notes ? `<p><strong>Примечания:</strong> ${order.notes}</p>` : ''}
          </div>
        </div>
      `;

      await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deployment_token: process.env.ABACUSAI_API_KEY,
          app_id: process.env.WEB_APP_ID,
          notification_id: process.env.NOTIF_ID_ORDER_REQUEST,
          subject: `Новый заказ #${order.orderNumber}`,
          body: htmlBody,
          is_html: true,
          recipient_email: 'nisa.com.md@gmail.com',
          sender_email: `noreply@${appUrl ? new URL(appUrl).hostname : 'hotprint.md'}`,
          sender_alias: appName,
        }),
      });
    } catch (emailErr: any) {
      console.error('Order email notification error:', emailErr);
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/orders error:', error);
    return NextResponse.json({ error: 'Ошибка создания заказа' }, { status: 500 });
  }
}
