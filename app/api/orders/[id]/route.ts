export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/orders/[id] — детали заказа
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const order = await prisma.order.findFirst({
      where: { id: params.id, userId: session.user.id },
      include: { product: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('GET /api/orders/[id] error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки заказа' }, { status: 500 });
  }
}

// PATCH /api/orders/[id] — обновление заказа (отмена клиентом)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const body = await req.json();
    const { status, notes } = body ?? {};

    // Клиент может только отменить свой заказ в статусе PENDING
    const order = await prisma.order.findFirst({
      where: { id: params.id, userId: session.user.id },
    });

    if (!order) {
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 });
    }

    if (status === 'CANCELLED' && order.status !== 'PENDING') {
      return NextResponse.json({ error: 'Нельзя отменить заказ в текущем статусе' }, { status: 400 });
    }

    const updateData: any = {};
    if (status === 'CANCELLED') updateData.status = 'CANCELLED';
    if (notes !== undefined) updateData.notes = notes;

    const updated = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
      include: { product: true },
    });

    return NextResponse.json({ order: updated });
  } catch (error: any) {
    console.error('PATCH /api/orders/[id] error:', error);
    return NextResponse.json({ error: 'Ошибка обновления заказа' }, { status: 500 });
  }
}
