export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (user?.role !== 'ADMIN') return null;
  return session;
}

// GET — все заказы
export async function GET(request: Request) {
  try {
    const session = await checkAdmin();
    if (!session) return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

    const where: any = {};
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: { select: { name: true, email: true, phone: true, company: true } },
          product: { select: { name: true, slug: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({ orders, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error: any) {
    console.error('Admin orders GET error:', error);
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 });
  }
}

// PATCH — изменить статус заказа
export async function PATCH(request: Request) {
  try {
    const session = await checkAdmin();
    if (!session) return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });

    const { id, status, notes } = await request.json();
    if (!id) return NextResponse.json({ error: 'Укажите ID' }, { status: 400 });

    const updateData: any = {};
    if (status && ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(status)) {
      updateData.status = status;
    }
    if (notes !== undefined) updateData.notes = notes;

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { name: true } },
      },
    });
    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Admin orders PATCH error:', error);
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 });
  }
}
